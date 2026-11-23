#!/usr/bin/env bash
# Install FaceFusion in a project-local virtual environment on Linux + NVIDIA CUDA.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="${PYTHON_BIN:-python3}"
FACEFUSION_DIR="${FACEFUSION_DIR:-$SCRIPT_DIR/facefusion}"
VENV_DIR="${FACEFUSION_VENV_DIR:-$FACEFUSION_DIR/.venv}"
FACEFUSION_REPO="https://github.com/facefusion/facefusion.git"

say() { printf '\n==> %s\n' "$*"; }
die() { printf 'Error: %s\n' "$*" >&2; exit 1; }

command -v "$PYTHON_BIN" >/dev/null 2>&1 || die "Python not found: $PYTHON_BIN"
command -v git >/dev/null 2>&1 || die "git is required to clone FaceFusion."

say "Inspecting the GPU host"
ENV_REPORT="$($PYTHON_BIN "$SCRIPT_DIR/check-env.py")"
printf '%s\n' "$ENV_REPORT"
GPU_TOTAL_MIB="$(printf '%s' "$ENV_REPORT" | "$PYTHON_BIN" -c '
import json, sys
try:
    gpus = json.load(sys.stdin).get("gpus") or []
    print(max((gpu.get("memory_total_mib") or 0 for gpu in gpus), default=0))
except Exception:
    print(0)
')"
if [[ "$GPU_TOTAL_MIB" =~ ^[0-9]+$ ]] && (( GPU_TOTAL_MIB > 0 && GPU_TOTAL_MIB < 4096 )); then
  printf 'WARNING: the largest detected GPU has %s MiB total memory (< 4 GiB). Continue only if you accept that the run may fail.\n' "$GPU_TOTAL_MIB" >&2
elif (( GPU_TOTAL_MIB == 0 )); then
  printf 'WARNING: GPU memory could not be determined. Continue only after checking the JSON report above.\n' >&2
fi

say "Preparing FaceFusion source at $FACEFUSION_DIR"
if [[ -d "$FACEFUSION_DIR/.git" ]]; then
  printf 'Existing FaceFusion clone found; leaving its checked-out revision unchanged.\n'
elif [[ -e "$FACEFUSION_DIR" ]]; then
  die "$FACEFUSION_DIR exists but is not a FaceFusion git clone. Set FACEFUSION_DIR to another empty path."
else
  git clone "$FACEFUSION_REPO" "$FACEFUSION_DIR"
fi
[[ -f "$FACEFUSION_DIR/install.py" && -f "$FACEFUSION_DIR/facefusion.py" ]] || die "FaceFusion checkout is incomplete."

say "Creating or reusing an isolated Python environment"
if [[ ! -x "$VENV_DIR/bin/python" ]]; then
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi
# FaceFusion's installer calls `pip` by name. Activating this local venv ensures
# it cannot modify the system Python.
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip

CUDA_VERSION="$(printf '%s' "$ENV_REPORT" | "$PYTHON_BIN" -c '
import json, sys
try:
    print((json.load(sys.stdin).get("cuda_version") or ""))
except Exception:
    print("")
')"
ONNXRUNTIME_VARIANT="${FACEFUSION_ONNXRUNTIME:-}"
if [[ -z "$ONNXRUNTIME_VARIANT" ]]; then
  case "$CUDA_VERSION" in
    13.*) ONNXRUNTIME_VARIANT="cuda@13" ;;
    *) ONNXRUNTIME_VARIANT="cuda@12" ;;
  esac
fi
case "$ONNXRUNTIME_VARIANT" in
  cuda@12|cuda@13) ;;
  *) die "FACEFUSION_ONNXRUNTIME must be cuda@12 or cuda@13 (got: $ONNXRUNTIME_VARIANT)" ;;
esac

say "Installing FaceFusion dependencies with its official installer ($ONNXRUNTIME_VARIANT)"
(
  cd "$FACEFUSION_DIR"
  # Official command: python install.py cuda@12|cuda@13. --skip-conda is needed
  # because this script uses the isolated venv created above instead of conda.
  python install.py "$ONNXRUNTIME_VARIANT" --skip-conda
)

say "Verifying the FaceFusion command"
(
  cd "$FACEFUSION_DIR"
  python facefusion.py --version
)
printf '\nDone. Next: %s/run.sh --source face.jpg --target clip.mp4 --output result.mp4\n' "$SCRIPT_DIR"
