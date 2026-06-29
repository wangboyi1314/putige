#!/usr/bin/env bash
# 本地手动部署到 Cloudflare Pages（需先 wrangler login 或设置 CLOUDFLARE_API_TOKEN）
set -euo pipefail
cd "$(dirname "$0")/.."

export PAYMENT_MODE=xunhu
export NEXT_PUBLIC_BASE_URL=https://putige-eh2.pages.dev

npm run build
bash scripts/build-pages-static.sh
echo "${GITHUB_SHA:-manual}" > out/build-id.txt
npx wrangler pages functions build out --compatibility-flag nodejs_compat

if [ -n "${XUNHU_APP_SECRET:-}" ]; then
  echo "$XUNHU_APP_SECRET" | npx wrangler pages secret put XUNHU_APP_SECRET --project-name putige
fi

npx wrangler pages deploy out --project-name=putige --branch=main
echo "部署完成: https://putige-eh2.pages.dev"
echo "验证: curl -X POST https://putige-eh2.pages.dev/api/payment/create -H 'Content-Type: application/json' -d '{\"productId\":\"qian_premium\"}'"
