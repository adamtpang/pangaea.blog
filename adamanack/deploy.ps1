# deploy.ps1 — Build the book, sync the PDF into the site, deploy to Vercel.
# ============================================================================
# What it does, in order:
#   1. Recompiles manuscript.typ -> build/almanack.pdf
#   2. Copies the fresh PDF into site/public/almanack.pdf
#   3. Pushes to Vercel production (adamanack.com)
#
# First run will walk you through the project-link wizard. Every run after is
# just edit -> .\deploy.ps1 -> live.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Refresh PATH so typst + vercel are reachable
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
            [System.Environment]::GetEnvironmentVariable("Path","User")

# --- Step 1: rebuild the PDF ---
Write-Host "[1/3] Compiling manuscript.typ -> build/almanack.pdf" -ForegroundColor Cyan
typst compile manuscript.typ build/almanack.pdf --font-path fonts
if ($LASTEXITCODE -ne 0) {
    Write-Host "Typst compile failed. Aborting." -ForegroundColor Red
    exit 1
}
$pdfSize = [math]::Round((Get-Item build/almanack.pdf).Length / 1KB, 1)
Write-Host "      build/almanack.pdf ($pdfSize KB)" -ForegroundColor DarkGray

# --- Step 2: sync the PDF into the site's public assets ---
Write-Host "[2/3] Syncing PDF into site/public/almanack.pdf" -ForegroundColor Cyan
Copy-Item "build/almanack.pdf" "site/public/almanack.pdf" -Force

# --- Step 3: deploy to Vercel ---
Write-Host "[3/3] Deploying to Vercel production" -ForegroundColor Cyan
$whoami = & vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "      Not logged in — running 'vercel login' first." -ForegroundColor Yellow
    & vercel login
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Live: https://adamanack.com" -ForegroundColor Green
}
