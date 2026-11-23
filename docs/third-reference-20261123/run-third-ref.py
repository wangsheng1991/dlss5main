#!/usr/bin/env python3
"""Does the third reference actually steer the setting?

Two runs on the same model, the same prompt, the same seed:
  A: two references (you + character), no third       -> the baseline backdrop
  B: the same two references plus a skyscraper scene  -> does the setting change?

The prompt strings come from the repo's own togetherPrompt(), so what is tested is exactly
what the tool now sends. Nothing here writes to the site: it talks to the provider directly.
"""
import json, os, sys, time, uuid, mimetypes, urllib.request, urllib.error

BASE = 'https://dashboard.alphanetplus.com'
PROXY = 'http://127.0.0.1:1082'
KEY = os.environ.get('ALPHANET_API_KEY')
REPO = '/Users/wangsheng/code/shou/dlss5main'
OUT = os.path.dirname(os.path.abspath(__file__))

if not KEY:
    sys.exit('ALPHANET_API_KEY missing from the environment')

UA = 'curl/8.7.1'
opener = urllib.request.build_opener(
    urllib.request.ProxyHandler({'http': PROXY, 'https': PROXY})
)

def call(path, body=None, key=None, timeout=60):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(BASE + path, data=data, method='GET' if body is None else 'POST')
    req.add_header('Authorization', 'Bearer ' + KEY)
    req.add_header('User-Agent', UA)
    req.add_header('Content-Type', 'application/json')
    if key:
        req.add_header('Idempotency-Key', key)
    try:
        with opener.open(req, timeout=timeout) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'_error': e.code, '_body': e.read().decode()[:400]}

def upload(path):
    size = os.path.getsize(path)
    ctype = mimetypes.guess_type(path)[0] or 'image/jpeg'
    ticket = call('/v1/flux/uploads', {
        'model': 'flux-klein',
        'file_name': os.path.basename(path),
        'content_type': ctype,
        'size': size,
    })
    if '_error' in ticket:
        sys.exit(f'upload ticket failed for {path}: {ticket}')
    with open(path, 'rb') as f:
        body = f.read()
    req = urllib.request.Request(ticket['upload_url'], data=body, method='PUT')
    req.add_header('User-Agent', UA)
    for k, v in (ticket.get('headers') or {}).items():
        req.add_header(k, v)
    with opener.open(req, timeout=120) as r:
        r.read()
    print(f'  uploaded {os.path.basename(path)} -> {ticket["file_id"]} ({size} bytes)')
    return ticket['file_id']

def run(label, prompt, files, seed=42, steps=4, size=1024):
    ids = [upload(p) for p in files]
    task = call('/v1/tasks/alphanet-flux', {
        'model': 'flux-klein',
        'prompt': prompt,
        'image_ids': ids,
        'width': size, 'height': size,
        'seed': seed,
        'num_inference_steps': steps,
        'output_format': 'webp',
    }, key=str(uuid.uuid4()))
    if '_error' in task:
        sys.exit(f'submit failed for {label}: {task}')
    tid = task.get('task_id') or task.get('id')
    print(f'  {label}: submitted {tid}')
    started = time.time()
    while time.time() - started < 900:
        time.sleep(4)
        st = call(f'/v1/tasks/{tid}?include_result=true')
        if '_error' in st:
            print('   status error', st)
            continue
        status = (st.get('status') or '').upper()
        if status in ('SUCCEEDED', 'SUCCESS', 'DONE', 'COMPLETED'):
            url = st.get('result_url') or (st.get('result') or {}).get('url') or st.get('output_url')
            if not url:
                print('   succeeded without a url:', json.dumps(st)[:300])
                return tid, None, round(time.time() - started, 1)
            with opener.open(url, timeout=180) as r:
                payload = r.read()
            dest = os.path.join(OUT, f'{label}.webp')
            open(dest, 'wb').write(payload)
            print(f'  {label}: done in {round(time.time()-started,1)}s -> {dest} ({len(payload)} bytes)')
            return tid, dest, round(time.time() - started, 1)
        if status in ('FAILED', 'ERROR', 'CANCELLED'):
            print(f'  {label}: {status} {json.dumps(st)[:300]}')
            return tid, None, round(time.time() - started, 1)
    print(f'  {label}: timed out')
    return tid, None, None

def main():
    prompts = json.load(open(os.path.join(OUT, 'prompts.json')))
    files2 = [f'{REPO}/public/examples/together/you.jpg', f'{REPO}/public/examples/together/character.jpg']
    scene = f'{REPO}/public/examples/case-architecture.jpg'
    log = {'two': None, 'three': None}

    print('A · two references, no camera')
    tid, path, secs = run('a-two-refs', prompts['two'], files2)
    log['two'] = {'task': tid, 'file': path, 'seconds': secs}
    time.sleep(2)

    print('B · same two references plus a skyscraper scene')
    tid, path, secs = run('b-three-refs', prompts['three'], files2 + [scene])
    log['three'] = {'task': tid, 'file': path, 'seconds': secs}

    json.dump(log, open(os.path.join(OUT, 'run-log.json'), 'w'), indent=2)
    print(json.dumps(log, indent=2))

main()
