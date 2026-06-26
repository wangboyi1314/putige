#!/usr/bin/env bash
# Static Next.js export + Cloudflare Pages Functions (same model as putiyuan.pages.dev)
set -euo pipefail

if [ ! -d out ]; then
  echo "::error::缺少 out/ 目录，请先运行 npm run build"
  exit 1
fi

rm -rf out/functions
cp -r functions out/functions

echo "Pages static bundle ready in out/ ($(find out -type f | wc -l) files)"
