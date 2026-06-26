#!/usr/bin/env bash
# Package OpenNext output for Cloudflare Pages (putige.pages.dev).
set -euo pipefail

OUT=".open-next/pages-deploy"
rm -rf "$OUT"
mkdir -p "$OUT"

cp -r .open-next/assets/. "$OUT/"
cp .open-next/worker.js "$OUT/_worker.js"

echo "Pages bundle ready at $OUT ($(find "$OUT" -type f | wc -l) files)"
