# preview.ps1 — Live preview loop for Poor Adam's Almanack
# =========================================================
# Run from the project root:   .\preview.ps1
#
# What this does:
#   1. Opens build/almanack.pdf in SumatraPDF (auto-reloads on change).
#   2. Starts `typst watch` in this terminal — every save of manuscript.typ
#      recompiles the PDF in <1 second.
#
# Stop it with Ctrl-C. Sumatra will keep running; close it manually.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# Refresh PATH so typst is reachable even on a fresh terminal.
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
            [System.Environment]::GetEnvironmentVariable("Path","User")

$Sumatra = "$env:LOCALAPPDATA\SumatraPDF\SumatraPDF.exe"
$Pdf     = Join-Path $Root "build\almanack.pdf"

if (-not (Test-Path $Pdf)) {
    Write-Host "First build (no PDF yet)..." -ForegroundColor Yellow
    typst compile manuscript.typ build/almanack.pdf --font-path fonts
}

# Open Sumatra (-reuse-instance ensures we don't stack windows on each run).
if (Test-Path $Sumatra) {
    & $Sumatra -reuse-instance $Pdf
    Write-Host "Opened build/almanack.pdf in SumatraPDF." -ForegroundColor Green
} else {
    Write-Host "SumatraPDF not found at $Sumatra. Open build/almanack.pdf manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Watching manuscript.typ -> build/almanack.pdf" -ForegroundColor Cyan
Write-Host "Edit manuscript.typ in your editor, save, watch the PDF reload." -ForegroundColor Cyan
Write-Host "Ctrl-C to stop." -ForegroundColor Cyan
Write-Host ""

typst watch manuscript.typ build/almanack.pdf --font-path fonts
