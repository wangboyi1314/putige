#!/usr/bin/env bash
# Package OpenNext output for Cloudflare Pages direct upload (putige.pages.dev).
# See: https://github.com/cloudflare/workers-sdk/issues/14389
set -euo pipefail

ASSETS=".open-next/assets"

cp -f .open-next/worker.js "$ASSETS/_worker.js"

for dir in cloudflare middleware server-functions .build dynamodb-provider cloudflare-templates; do
  if [ -d ".open-next/$dir" ]; then
    rm -rf "$ASSETS/$dir"
    cp -r ".open-next/$dir" "$ASSETS/"
  fi
done

cat > "$ASSETS/.assetsignore" << 'EOF'
_worker.js
cloudflare
middleware
server-functions
.build
dynamodb-provider
cloudflare-templates
_routes.json
.assetsignore
EOF

cat > "$ASSETS/_routes.json" << 'EOF'
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/_next/static/*",
    "/favicon.ico",
    "/favicon.svg",
    "/*.svg",
    "/images/*",
    "/meditation/*",
    "/_headers"
  ]
}
EOF

echo "Pages bundle ready in $ASSETS"
