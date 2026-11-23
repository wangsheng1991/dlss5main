#!/usr/bin/env bash
# Run one offline FaceFusion face swap on a Linux + CUDA machine.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FACEFUSION_DIR="${FACEFUSION_DIR:-$SCRIPT_DIR/facefusion}"
VENV_DIR="${FACEFUSION_VENV_DIR:-$FACEFUSION_DIR/.venv}"
FACEFUSION_PYTHON="${FACEFUSION_PYTHON:-$VENV_DIR/bin/python}"

usage() {
  cat <<'USAGE'
Usage:
  run.sh --source <face-image> --target <video> --output <output.mp4>

Optional environment overrides:
  FACEFUSION_DIR       FaceFusion checkout (default: ./facefusion beside this script)
  FACEFUSION_VENV_DIR  its virtual environment (default: $FACEFUSION_DIR/.venv)
  FACEFUSION_PYTHON    Python executable to use (default: $FACEFUSION_VENV_DIR/bin/python)
USAGE
}

source_path=""
target_path=""
output_path=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --source) [[ $# -ge 2 ]] || { usage >&2; exit 2; }; source_path="$2"; shift 2 ;;
    --target) [[ $# -ge 2 ]] || { usage >&2; exit 2; }; target_path="$2"; shift 2 ;;
    --output) [[ $# -ge 2 ]] || { usage >&2; exit 2; }; output_path="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "$source_path" || -z "$target_path" || -z "$output_path" ]]; then
  usage >&2
  exit 2
fi
[[ -f "$source_path" ]] || { printf 'Error: source image does not exist: %s\n' "$source_path" >&2; exit 1; }
[[ -f "$target_path" ]] || { printf 'Error: target video does not exist: %s\n' "$target_path" >&2; exit 1; }
[[ "$output_path" == *.mp4 ]] || { printf 'Error: output must have a .mp4 extension for H.264 output: %s\n' "$output_path" >&2; exit 2; }
output_dir="$(dirname "$output_path")"
[[ -d "$output_dir" ]] || { printf 'Error: output directory does not exist: %s\n' "$output_dir" >&2; exit 1; }
[[ -f "$FACEFUSION_DIR/facefusion.py" ]] || { printf 'Error: FaceFusion is not installed at %s. Run setup.sh first or set FACEFUSION_DIR.\n' "$FACEFUSION_DIR" >&2; exit 1; }
[[ -x "$FACEFUSION_PYTHON" ]] || { printf 'Error: FaceFusion Python is not available: %s. Run setup.sh first or set FACEFUSION_PYTHON.\n' "$FACEFUSION_PYTHON" >&2; exit 1; }

# FaceFusion is invoked from its checkout. Canonicalise caller-provided paths so
# relative paths continue to refer to the files the caller selected.
source_path="$(cd "$(dirname "$source_path")" && pwd)/$(basename "$source_path")"
target_path="$(cd "$(dirname "$target_path")" && pwd)/$(basename "$target_path")"
output_path="$(cd "$output_dir" && pwd)/$(basename "$output_path")"

printf 'Estimated processing time: pending measurement on this GPU, video, and settings.\n'
printf 'Starting FaceFusion with face_swapper and face_enhancer...\n'
started_at="$(date +%s)"
set +e
(
  cd "$FACEFUSION_DIR"
  "$FACEFUSION_PYTHON" facefusion.py headless-run \
    --source-paths "$source_path" \
    --target-path "$target_path" \
    --output-path "$output_path" \
    --processors face_swapper face_enhancer \
    --output-video-encoder libx264
)
status=$?
set -e
finished_at="$(date +%s)"
elapsed=$((finished_at - started_at))
printf 'Actual elapsed time: %sm %ss\n' "$((elapsed / 60))" "$((elapsed % 60))"
if (( status != 0 )); then
  printf 'FaceFusion failed with exit code %s.\n' "$status" >&2
  exit "$status"
fi
[[ -f "$output_path" ]] || { printf 'Error: FaceFusion exited successfully but did not create %s\n' "$output_path" >&2; exit 1; }
printf 'Completed: %s\n' "$output_path"
