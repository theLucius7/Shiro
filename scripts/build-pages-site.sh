#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/.pages/site"

rm -rf "$ROOT_DIR/.pages"
mkdir -p "$OUT_DIR"

cp -R "$ROOT_DIR/docs/." "$OUT_DIR/"

mkdir -p "$OUT_DIR/storybook"
cp -R "$ROOT_DIR/storybook/dist/." "$OUT_DIR/storybook/"

touch "$OUT_DIR/.nojekyll"
