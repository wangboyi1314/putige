# 菩提阁 · Cloudflare Workers 一键配置（环境变量 + 重新部署）
# 用法（PowerShell）:
#   $env:CLOUDFLARE_API_TOKEN = "你的API_Token"
#   cd d:\Bodhi
#   .\scripts\setup-cloudflare-deploy.ps1
#
# Token 创建: https://dash.cloudflare.com/profile/api-tokens
# 权限: Workers Builds Configuration (Edit) + Workers Scripts (Edit)

param(
    [string]$WorkerName = "putige",
    [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"
$BaseUrl = "https://api.cloudflare.com/client/v4"

if (-not $env:CLOUDFLARE_API_TOKEN) {
    Write-Host "请先设置环境变量: `$env:CLOUDFLARE_API_TOKEN = `"你的Token`"" -ForegroundColor Red
    exit 1
}

$Headers = @{
    Authorization = "Bearer $env:CLOUDFLARE_API_TOKEN"
    "Content-Type" = "application/json"
}

function Invoke-CfApi {
    param([string]$Method, [string]$Path, [object]$Body = $null)
    $uri = "$BaseUrl$Path"
    if ($Body) {
        $json = $Body | ConvertTo-Json -Depth 10 -Compress
        return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers -Body $json
    }
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers
}

# 读取 .env.local
$envVars = @{}
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

$required = @("DEEPSEEK_API_KEY")
foreach ($key in $required) {
    if (-not $envVars[$key]) {
        Write-Host "缺少 $key，请检查 $EnvFile" -ForegroundColor Red
        exit 1
    }
}

if (-not $envVars["DEEPSEEK_BASE_URL"]) { $envVars["DEEPSEEK_BASE_URL"] = "https://api.deepseek.com" }
if (-not $envVars["DEEPSEEK_MODEL"]) { $envVars["DEEPSEEK_MODEL"] = "deepseek-chat" }
if (-not $envVars["PAYMENT_MODE"]) { $envVars["PAYMENT_MODE"] = "demo" }

Write-Host ">> 获取 Cloudflare 账号..." -ForegroundColor Cyan
$accounts = Invoke-CfApi GET "/accounts"
if (-not $accounts.success -or $accounts.result.Count -eq 0) {
    Write-Host "无法获取账号，请检查 API Token 权限" -ForegroundColor Red
    exit 1
}
$accountId = $accounts.result[0].id
Write-Host "   Account: $($accounts.result[0].name) ($accountId)"

Write-Host ">> 获取 workers.dev 子域..." -ForegroundColor Cyan
$subdomainResp = Invoke-CfApi GET "/accounts/$accountId/workers/subdomain"
$workersSubdomain = $subdomainResp.result.subdomain
$publicBaseUrl = "https://$WorkerName.$workersSubdomain.workers.dev"
if ($envVars["NEXT_PUBLIC_BASE_URL"] -match "vercel\.app") {
    $envVars["NEXT_PUBLIC_BASE_URL"] = $publicBaseUrl
}
Write-Host "   站点地址: $publicBaseUrl"

Write-Host ">> 查找 Worker: $WorkerName ..." -ForegroundColor Cyan
$scripts = Invoke-CfApi GET "/accounts/$accountId/workers/scripts"
$worker = $scripts.result | Where-Object { $_.id -eq $WorkerName } | Select-Object -First 1
if (-not $worker) {
    Write-Host "未找到 Worker '$WorkerName'，请先在 Cloudflare 连接 GitHub 并部署一次" -ForegroundColor Red
    exit 1
}
$workerTag = $worker.tag
Write-Host "   Worker tag: $workerTag"

Write-Host ">> 获取构建触发器..." -ForegroundColor Cyan
$triggers = Invoke-CfApi GET "/accounts/$accountId/builds/workers/$workerTag/triggers"
$prodTrigger = $triggers.result | Where-Object { $_.branch_includes -contains "main" } | Select-Object -First 1
if (-not $prodTrigger) {
    $prodTrigger = $triggers.result | Select-Object -First 1
}
if (-not $prodTrigger) {
    Write-Host "未找到构建触发器" -ForegroundColor Red
    exit 1
}
$triggerUuid = $prodTrigger.trigger_uuid
Write-Host "   Trigger: $($prodTrigger.trigger_name) ($triggerUuid)"

Write-Host ">> 更新构建命令 (OpenNext)..." -ForegroundColor Cyan
Invoke-CfApi PATCH "/accounts/$accountId/builds/triggers/$triggerUuid" @{
    build_command  = "npm run build"
    deploy_command = "npx wrangler deploy"
} | Out-Null

Write-Host ">> 设置构建环境变量..." -ForegroundColor Cyan
$buildEnvBody = @{
    DEEPSEEK_API_KEY       = @{ value = $envVars["DEEPSEEK_API_KEY"]; is_secret = $true }
    DEEPSEEK_BASE_URL      = @{ value = $envVars["DEEPSEEK_BASE_URL"]; is_secret = $false }
    DEEPSEEK_MODEL         = @{ value = $envVars["DEEPSEEK_MODEL"]; is_secret = $false }
    NEXT_PUBLIC_BASE_URL   = @{ value = $envVars["NEXT_PUBLIC_BASE_URL"]; is_secret = $false }
    PAYMENT_MODE           = @{ value = $envVars["PAYMENT_MODE"]; is_secret = $false }
}
Invoke-CfApi PATCH "/accounts/$accountId/builds/triggers/$triggerUuid/environment_variables" $buildEnvBody | Out-Null

Write-Host ">> 设置运行时 Secret (DEEPSEEK_API_KEY)..." -ForegroundColor Cyan
$secretBody = @{
    name = "DEEPSEEK_API_KEY"
    text = $envVars["DEEPSEEK_API_KEY"]
    type = "secret_text"
}
Invoke-CfApi PUT "/accounts/$accountId/workers/scripts/$WorkerName/secrets" $secretBody | Out-Null

Write-Host ">> 设置运行时普通变量..." -ForegroundColor Cyan
$settings = Invoke-CfApi GET "/accounts/$accountId/workers/scripts/$WorkerName/settings"
$plainVars = @{
    DEEPSEEK_BASE_URL    = $envVars["DEEPSEEK_BASE_URL"]
    DEEPSEEK_MODEL       = $envVars["DEEPSEEK_MODEL"]
    NEXT_PUBLIC_BASE_URL = $envVars["NEXT_PUBLIC_BASE_URL"]
    PAYMENT_MODE         = $envVars["PAYMENT_MODE"]
}
$patchSettings = @{
    bindings = @(
        foreach ($entry in $plainVars.GetEnumerator()) {
            @{ type = "plain_text"; name = $entry.Key; text = $entry.Value }
        }
    )
}
# 保留现有 bindings（secrets 等），只追加/更新 plain_text
if ($settings.result.bindings) {
    $existing = $settings.result.bindings | Where-Object { $_.type -ne "plain_text" -or $plainVars.Keys -notcontains $_.name }
    $patchSettings.bindings = @($existing) + @($patchSettings.bindings)
}
try {
    Invoke-CfApi PATCH "/accounts/$accountId/workers/scripts/$WorkerName/settings" $patchSettings | Out-Null
} catch {
    Write-Host "   (运行时变量可能需在控制台手动添加，构建变量已设置)" -ForegroundColor Yellow
}

Write-Host ">> 触发重新部署 (main)..." -ForegroundColor Cyan
$buildResp = Invoke-CfApi POST "/accounts/$accountId/builds/triggers/$triggerUuid/builds" @{ branch = "main" }
$buildUuid = $buildResp.result.build_uuid
Write-Host "   Build UUID: $buildUuid"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " 配置完成！正在云端重新构建..." -ForegroundColor Green
Write-Host " 访问地址: $publicBaseUrl" -ForegroundColor Green
Write-Host " 构建日志: Cloudflare 控制台 -> putige -> Deployments" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
