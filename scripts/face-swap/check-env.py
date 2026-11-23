#!/usr/bin/env python3
"""Report the host capabilities needed by the FaceFusion runner as JSON.

This script deliberately imports no optional Python packages.  Torch is queried in
a child process so a missing or broken installation cannot prevent the report.
"""

import json
import os
import re
import shutil
import subprocess
import sys


def run(command):
    """Return command output, or an explanatory error, without raising."""
    try:
        completed = subprocess.run(
            command,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return completed.stdout, None
    except FileNotFoundError:
        return None, "command not found: " + command[0]
    except subprocess.CalledProcessError as error:
        detail = error.stderr.strip() or error.stdout.strip() or "no output"
        return None, "command failed (exit {}): {}".format(error.returncode, detail)
    except Exception as error:  # Keep this diagnostic script non-fatal.
        return None, "{}: {}".format(type(error).__name__, error)


def read_gpus(errors):
    output, error = run(
        [
            "nvidia-smi",
            "--query-gpu=name,memory.total,memory.free",
            "--format=csv,noheader,nounits",
        ]
    )
    if error:
        errors["nvidia_smi"] = error
        return None

    gpus = []
    for line in output.splitlines():
        parts = [part.strip() for part in line.split(",")]
        if len(parts) != 3:
            errors["nvidia_smi"] = "unexpected GPU query output: " + line
            return None
        try:
            gpus.append(
                {
                    "name": parts[0],
                    "memory_total_mib": int(parts[1]),
                    "memory_free_mib": int(parts[2]),
                }
            )
        except ValueError:
            errors["nvidia_smi"] = "could not parse GPU memory: " + line
            return None
    return gpus or None


def read_cuda_version(errors):
    output, error = run(["nvidia-smi"])
    if error:
        # The first call normally records the same failure; retain a clear field
        # when this is the only failed invocation.
        errors.setdefault("cuda_version", error)
        return None
    match = re.search(r"CUDA Version:\s*([^\s|]+)", output)
    if not match:
        errors["cuda_version"] = "CUDA version was not present in nvidia-smi output"
        return None
    return match.group(1)


def read_torch(errors):
    probe = (
        "import json\n"
        "try:\n"
        " import torch\n"
        " print(json.dumps({'installed': True, 'available': torch.cuda.is_available(), "
        "'version': torch.__version__, 'cuda_version': torch.version.cuda}))\n"
        "except Exception as exc:\n"
        " print(json.dumps({'installed': False, 'available': False, 'version': None, "
        "'cuda_version': None, 'error': type(exc).__name__ + ': ' + str(exc)}))\n"
    )
    output, error = run([sys.executable, "-c", probe])
    if error:
        errors["torch"] = error
        return {"installed": False, "available": False, "version": None, "cuda_version": None}
    try:
        result = json.loads(output)
    except json.JSONDecodeError as error:
        errors["torch"] = "could not parse torch probe: " + str(error)
        return {"installed": False, "available": False, "version": None, "cuda_version": None}
    if result.get("error"):
        errors["torch"] = result.pop("error")
    return result


def main():
    errors = {}
    try:
        disk_free_bytes = shutil.disk_usage(os.getcwd()).free
    except Exception as error:
        disk_free_bytes = None
        errors["disk"] = "{}: {}".format(type(error).__name__, error)

    try:
        cpu_cores = os.cpu_count()
        if cpu_cores is None:
            errors["cpu"] = "os.cpu_count() returned no value"
    except Exception as error:
        cpu_cores = None
        errors["cpu"] = "{}: {}".format(type(error).__name__, error)

    report = {
        "gpus": read_gpus(errors),
        "cuda_version": read_cuda_version(errors),
        "torch": read_torch(errors),
        "disk_free_bytes": disk_free_bytes,
        "cpu_cores": cpu_cores,
        "error": errors or None,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
