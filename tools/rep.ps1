# The daily rep. Prints the board so you never open an empty anything.
#
#   tools\rep.ps1             # name today's essay, list the rep
#
# This is the deterministic half of the routine: it decides WHAT to work on.
# The writing half (filling the essay stub, picking reply targets) is `/rep`,
# the slash command in .claude/commands/rep.md, which calls this first.
#
# Songs moved to strummer.fun-songs and mint there now: see
# ..\..\strummer.fun-songs\tools\rep.ps1 (or next-song.ps1 directly) for that half.
#
# Nothing here publishes. Every file it touches stays draft: true.

$ErrorActionPreference = 'Stop'
$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repo = Resolve-Path (Join-Path $here '..')
$postDir = Join-Path $repo 'src\content\posts'

$STUB = '[Stub. Open this in /studio'

function Write-Head($n, $text) {
  Write-Host ""
  Write-Host "  $n  " -ForegroundColor DarkGray -NoNewline
  Write-Host $text -ForegroundColor Cyan
}

Write-Host ""
Write-Host "  PANGAEA DAILY REP  $(Get-Date -Format 'yyyy-MM-dd')" -ForegroundColor Yellow

# --------------------------------------------------------------- 1. the essay
Write-Head '1' 'ESSAY'
$stubs = @()
Get-ChildItem $postDir -Filter *.md -ErrorAction SilentlyContinue | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  if (-not $c.Contains($STUB)) { return }
  $num = if ($c -match '(?m)^number:\s*(\d+)') { [int]$Matches[1] } else { 999999 }
  $title = if ($c -match "(?m)^title:\s*'?(.+?)'?\s*$") { $Matches[1] -replace "''", "'" } else { $_.BaseName }
  $stubs += [pscustomobject]@{ Num = $num; Title = $title; Path = $_.FullName }
}

if (-not $stubs) {
  Write-Host "     No stubs left. Every essay is written." -ForegroundColor Green
}
else {
  $next = $stubs | Sort-Object Num | Select-Object -First 1
  $rel = $next.Path.Replace("$repo\", '')
  Write-Host ""
  Write-Host "  No. $($next.Num)  $($next.Title)" -ForegroundColor White
  Write-Host ""
  Write-Host "     Write it out in place. 150 to 400 words, aim 300." -ForegroundColor Green
  Write-Host ""
  Write-Host "     $rel"
  Write-Host "     $($stubs.Count) stubs left. No em dashes. Title is the claim." -ForegroundColor DarkGray
}

# --------------------------------------------------------------- 2. the reply
Write-Head '2' 'REPLY'
Write-Host ""
Write-Host "  3 replies, Farcaster" -ForegroundColor White
Write-Host ""
Write-Host "     Generous and specific. Never self-promotional." -ForegroundColor Green
Write-Host ""
Write-Host "     Seeds: SEEDS-FARCASTER.md, SEEDS-OBSIDIAN.md"
Write-Host "     Replying is lower stakes than posting. That is the whole point." -ForegroundColor DarkGray
Write-Host ""
