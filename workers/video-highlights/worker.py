"""Outbound worker for the Studio video highlights invite beta."""
import json
import logging
from logging.handlers import RotatingFileHandler
import re
from pathlib import Path
import subprocess
import sys
import tempfile
import time
from urllib.request import Request, urlopen

LIMIT = 32 * 1024 * 1024
MODEL = 'http://127.0.0.1:8930'
MEDIA_INPUT = ('-protocol_whitelist', 'file,pipe', '-f', 'mov', '-enable_drefs', '0')
PROMPTS = {
    'bus': 'Is a bus visibly present in this video? Answer only Yes or No.',
    'vehicle': 'Is a road vehicle visibly present in this video? Answer only Yes or No.',
    'person': 'Is a person visibly present in this video? Answer only Yes or No.',
}


def post(url, payload, timeout, key=None):
    headers = {'Content-Type': 'application/json'}
    if key:
        headers['Authorization'] = 'Bearer ' + key
    call = Request(url, data=json.dumps(payload).encode(), headers=headers)
    with urlopen(call, timeout=timeout) as response:
        return json.load(response)


def command(*args, limit=30):
    return subprocess.run(args, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                          timeout=limit, check=True).stdout


def media_duration(file, ffprobe):
    data = json.loads(command(ffprobe, '-v', 'error', *MEDIA_INPUT, '-show_entries',
                             'stream=codec_type,codec_name,width,height:format=duration,format_name',
                             '-of', 'json', str(file), limit=15))
    stream = next(track for track in data['streams'] if track['codec_type'] == 'video')
    width, height = stream['width'], stream['height']
    duration = float(data['format']['duration'])
    if ('mp4' not in data['format']['format_name'].split(',') or stream['codec_name'] not in {'h264', 'hevc'} or
            not (0.3 <= duration <= 30) or not (0 < min(width, height) <= 720 and 0 < max(width, height) <= 1280)):
        raise ValueError('Invalid clip')
    return duration


def analyze(source, event, seconds, config):
    deadline = time.monotonic() + 190
    result = []
    start = 0.0
    while start < seconds:
        if time.monotonic() >= deadline:
            raise TimeoutError('Analysis budget reached')
        end = min(round(start + 1.5, 3), round(seconds, 3))
        if end - start < 0.3:
            break
        window = source.with_name('window.mp4')
        command(config['ffmpeg'], '-loglevel', 'error', '-y', '-ss', str(start), *MEDIA_INPUT, '-i', str(source),
                '-t', str(end - start), '-map', '0:v:0', '-an', '-vf', 'scale=480:480:force_original_aspect_ratio=decrease:force_divisible_by=2',
                '-c:v', 'libx264', '-preset', 'ultrafast', str(window), limit=12)
        answer = post(config.get('model', MODEL) + '/api/analyze', {
            'video': str(window), 'num_frames': 16, 'max_pixels': 153664, 'max_new_tokens': 8,
            'prompt': PROMPTS[event],
        }, timeout=25)['answer'].strip().lower().rstrip('.!。！')
        decision = re.match(r'^(yes|no)\b|^([是否])(?:$|[，。,\s])', answer)
        label = (decision.group(1) or decision.group(2)) if decision else None
        if label in {'yes', '是'}:
            if result and result[-1]['end'] == start:
                result[-1]['end'] = end
            else:
                result.append({'start': start, 'end': end})
        elif label not in {'no', '否'}:
            raise ValueError('Model output outside the fixed contract')
        start = end
    return result


def export(source, segments, duration, config):
    files = []
    for index, segment in enumerate(segments):
        start, end = segment['start'], segment['end']
        if not 0 <= start < end <= duration + 0.001:
            raise ValueError('Segment outside source')
        name = f'piece-{index}.mp4'
        command(config['ffmpeg'], '-loglevel', 'error', '-y', '-ss', str(start), *MEDIA_INPUT, '-i', str(source),
                '-t', str(end - start), '-map', '0:v:0', '-map', '0:a:0?',
                '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-preset', 'veryfast',
                '-pix_fmt', 'yuv420p', '-crf', '24', '-c:a', 'aac', str(source.with_name(name)), limit=35)
        files.append(f"file '{name}'")
    concat = source.with_name('concat.txt')
    concat.write_text('\n'.join(files) + '\n', encoding='ascii')
    final = source.with_name('highlights.mp4')
    command(config['ffmpeg'], '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '1', '-i', str(concat),
            '-c', 'copy', '-movflags', '+faststart', str(final), limit=20)
    return final


def work(job, config):
    receipt = {'action': 'finish', 'id': job['id'], 'lease': job['lease']}
    with tempfile.TemporaryDirectory(prefix='studio-highlights-') as directory:
        source = Path(directory, 'input.mp4')
        try:
            with urlopen(job['inputUrl'], timeout=25) as response:
                data = response.read(LIMIT + 1)
            if len(data) != job['size'] or len(data) > LIMIT:
                raise ValueError('Wrong object size')
            source.write_bytes(data)
            duration = media_duration(source, config['ffprobe'])
        except (ValueError, KeyError, StopIteration, subprocess.CalledProcessError, subprocess.TimeoutExpired):
            return {**receipt, 'error': 'invalid_media'}
        try:
            if job['phase'] == 'analyze':
                return {**receipt, 'segments': analyze(source, job['event'], duration, config)}
            edited = export(source, job['selected'], duration, config)
            if not 0 < edited.stat().st_size <= LIMIT:
                raise ValueError('Output outside size limit')
            put = Request(job['outputUrl'], data=edited.read_bytes(), method='PUT', headers={'Content-Type': 'video/mp4'})
            with urlopen(put, timeout=45):
                pass
            return {**receipt, 'exported': True}
        except Exception as error:
            logging.warning('%s: %s stage failed (%s)', job['id'], job['phase'], type(error).__name__)
            return {**receipt, 'error': 'export_failed' if job['phase'] == 'export' else 'analysis_failed'}


def run(config):
    def api(data):
        return post(config['endpoint'], {'kind': 'video-highlights-job', **data}, timeout=25, key=config['worker_key'])

    last_idle_log = 0
    while True:
        try:
            with urlopen(config.get('model', MODEL) + '/health', timeout=5) as health:
                if json.load(health).get('status') != 'ok':
                    raise RuntimeError('Model not ready')
            job = api({'action': 'claim'})['job']
            if not job:
                if time.monotonic() - last_idle_log > 600:
                    logging.info('Worker ready')
                    last_idle_log = time.monotonic()
                time.sleep(12)
                continue
            result = work(job, config)
            for attempt in range(2):
                try:
                    api(result)
                    logging.info('%s: %s %s', job['id'], job['phase'], result.get('error', 'complete'))
                    break
                except (OSError, ValueError):
                    if attempt == 1:
                        raise
                    time.sleep(2)
        except Exception as error:
            logging.warning('Worker temporarily unavailable (%s)', type(error).__name__)
            time.sleep(15)


if __name__ == '__main__':
    config_file = Path(sys.argv[1])
    log_file = config_file.with_name('worker.log')
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s',
                        handlers=[RotatingFileHandler(log_file, maxBytes=1024 * 1024, backupCount=2)])
    run(json.loads(config_file.read_text(encoding='utf-8-sig')))
