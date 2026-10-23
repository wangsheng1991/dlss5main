#!/usr/bin/env python3
"""Probe final assets and reject held tails using one decoded frame per second."""
import sys, json, subprocess, hashlib, math
from pathlib import Path

def check(file):
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','format=duration,size:stream=width,height,nb_read_frames','-of','json',file]))
    stream=info['streams'][0];duration=float(info['format']['duration']);samples=[]; pixels=[]; sample_height=round(stream['height']*320/stream['width']/2)*2
    for second in range(math.ceil(duration)):
        raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(second),'-i',file,'-frames:v','1','-vf',f'scale=320:{sample_height}:flags=area','-f','rawvideo','-pix_fmt','gray','pipe:1'])
        if raw:
            samples.append({'second':second,'sha256':hashlib.sha256(raw).hexdigest()}); pixels.append(raw)
    start=len(samples)-1
    # Ignore codec noise: visually held frames must not pass just because a few pixels differ.
    def same(a,b):
        delta=[abs(x-y) for x,y in zip(a,b)]
        return sum(delta)/len(delta)<=0.35 and sum(d>4 for d in delta)/len(delta)<=0.002
    while start>0 and same(pixels[start-1],pixels[-1]):start-=1
    tail=round(duration-samples[start]['second'],6);limit=max(2,duration*0.2)
    result={'file':file,'duration':duration,'bytes':int(info['format']['size']),'width':stream['width'],'height':stream['height'],'frames':int(stream['nb_read_frames']),'held_tail_seconds':tail,'comparison':'1 fps, 320px grayscale; mean delta <=0.35 and fraction delta>4 <=0.002','limit_seconds':round(limit,6),'verdict':'PASS' if tail<=limit else 'FAIL','samples':samples}
    return result
if __name__=='__main__':
    if len(sys.argv)<2: sys.exit('Usage: check-video-held-tail.py public/videos/*.mp4')
    results=[check(p) for p in sys.argv[1:]];print(json.dumps(results,indent=2));sys.exit(any(r['verdict']=='FAIL' for r in results))
