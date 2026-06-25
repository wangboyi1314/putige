# 菩提阁 → https://putige.vercel.app
# 首次请先在本机终端执行: npx vercel login

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "==> 构建项目..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> 部署到 Vercel (putige)..." -ForegroundColor Cyan
Write-Host "    域名: https://putige.vercel.app" -ForegroundColor Gray

# 链接到已有项目 putige（首次会提示选择账号/项目）
npx vercel link --project putige --yes 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "    若 link 失败，请手动: npx vercel link" -ForegroundColor Yellow
}

Write-Host "==> 写入生产环境变量（如已存在会提示覆盖）..." -ForegroundColor Cyan
@"
demo
"@ | npx vercel env add PAYMENT_MODE production --force 2>$null

@"
https://putige.vercel.app
"@ | npx vercel env add NEXT_PUBLIC_BASE_URL production --force 2>$null

# DEEPSEEK_API_KEY 请从 .env.local 读取后手动添加，勿提交到 Git
if (Test-Path .env.local) {
  $key = (Get-Content .env.local | Where-Object { $_ -match '^DEEPSEEK_API_KEY=' }) -replace '^DEEPSEEK_API_KEY=', ''
  if ($key -and $key -ne 'sk-your-deepseek-api-key') {
    $key | npx vercel env add DEEPSEEK_API_KEY production --force 2>$null
    Write-Host "    已同步 DEEPSEEK_API_KEY" -ForegroundColor Green
  }
}

npx vercel --prod --yes
Write-Host ""
Write-Host "完成! 访问 https://putige.vercel.app" -ForegroundColor Green
Write-Host "虎皮椒密钥就绪后执行:" -ForegroundColor Yellow
Write-Host '  npx vercel env add XUNHU_APP_ID production' -ForegroundColor Gray
Write-Host '  npx vercel env add XUNHU_APP_SECRET production' -ForegroundColor Gray
Write-Host '  npx vercel env add PAYMENT_MODE production  # 填 xunhu' -ForegroundColor Gray
Write-Host "  npx vercel --prod" -ForegroundColor Gray
