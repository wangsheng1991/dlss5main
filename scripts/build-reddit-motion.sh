#!/usr/bin/env bash
set -euo pipefail

# Build discussion assets from real Studio comparison boards.
# This script never invokes the image model: it crops the existing ORIGINAL/AFTER
# panels and adds timing labels, so the result cannot be mistaken for a new render.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/marketing/reddit-motion/20261008"
FONT="/System/Library/Fonts/Supplemental/Arial.ttf"
mkdir -p "$OUT"

if [[ ! -f "$FONT" ]]; then
  echo "Missing font: $FONT" >&2
  exit 1
fi

make_clip() {
  local id="$1" input="$2" label="$3"
  local mp4="$OUT/${id}-before-after-7s.mp4"
  local gif="$OUT/${id}-before-after-7s.gif"

  ffmpeg -y -hide_banner -loglevel error -loop 1 -i "$input" \
    -filter_complex "[0:v]crop=iw:ih/2:0:0,scale=1080:612:flags=lanczos,setsar=1,drawtext=fontfile=$FONT:text='ORIGINAL':x=28:y=26:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=12,trim=duration=2.5,setpts=PTS-STARTPTS[b];[0:v]crop=iw:ih/2:0:ih/2,scale=1080:612:flags=lanczos,setsar=1,drawtext=fontfile=$FONT:text='DLSS5 STUDIO':x=28:y=26:fontsize=32:fontcolor=white:box=1:boxcolor=0x2376d9@0.85:boxborderw=12,trim=duration=2.5,setpts=PTS-STARTPTS[a];[0:v]scale=1080:612:flags=lanczos,setsar=1,drawtext=fontfile=$FONT:text='$label':x=28:y=26:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=12,trim=duration=2.5,setpts=PTS-STARTPTS[c];[b][a][c]concat=n=3:v=1:a=0,format=yuv420p[out]" \
    -map '[out]' -r 24 -t 7.5 -an -c:v libx264 -crf 22 -preset medium -movflags +faststart "$mp4"

  ffmpeg -y -hide_banner -loglevel error -i "$mp4" \
    -vf "fps=10,scale=480:-2:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=sierra2_4a" \
    -loop 0 "$gif"
}

make_clip night "$ROOT/public/marketing/reddit/dlss5-studio-kit/03-night-compare.jpg" "BEFORE / AFTER REVIEW"
make_clip wool "$ROOT/public/marketing/reddit/dlss5-studio-kit/01-wool-macro-compare.jpg" "TEXTURE CHECK"
make_clip ukiyoe "$ROOT/public/marketing/reddit/dlss5-studio-kit/05-ukiyoe-compare.jpg" "ILLUSTRATION CHECK"
make_clip newspaper "$ROOT/public/marketing/reddit/dlss5-studio-kit/06-newspaper-1880-compare.jpg" "READABILITY CHECK"
make_clip lavender "$ROOT/public/marketing/reddit/dlss5-studio-kit/07-lavender-compare.jpg" "TEXTURE CHECK"

printf 'Built assets in %s\n' "$OUT"
du -h "$OUT"/*
