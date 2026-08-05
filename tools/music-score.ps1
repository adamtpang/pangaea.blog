# The scoreboard. Reads src/content/songs/, prints XP, level, and streak.
#
#   tools\music-score.ps1
#
# XP table lives in MUSIC-GAME.md; this script and the /songs player card must
# agree on it, since they both compute from the same source data and neither
# reads from the other.

$ErrorActionPreference = 'Stop'
$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repo = Resolve-Path (Join-Path $here '..')
$songDir = Join-Path $repo 'src\content\songs'

$LEVELS = [ordered]@{
  'Demo Tape'      = 0
  'Gold'           = 50
  'Platinum'       = 150
  'Multi-Platinum' = 400
  'Diamond'        = 1000
  'Catalog Artist' = 2500
}

function Checked([string]$body, [string]$item) {
  return [bool]([regex]::Match($body, "(?im)^-\s*\[x\]\s*$([regex]::Escape($item))")).Success
}

$files = Get-ChildItem $songDir -Filter *.md -File -ErrorAction SilentlyContinue
$xp = 0
$counts = [ordered]@{ sketch = 0; melody = 0; lyrics = 0; demo = 0; produced = 0; released = 0; study = 0 }

foreach ($f in $files) {
  $raw = Get-Content $f.FullName -Raw
  $fm = if ($raw -match '(?s)^---\r?\n(.*?)\r?\n---') { $Matches[1] } else { '' }
  $body = $raw.Substring([Math]::Min($raw.Length, ($raw.IndexOf('---', 3) + 3)))

  $hasKey = $fm -match "(?m)^key:\s*\S"
  $hasTempo = $fm -match "(?m)^tempo:\s*\d"
  $hasChords = $fm -match "(?m)^chords:\s*\S"
  $isDraft = -not ($fm -match "(?m)^draft:\s*false")
  $stage = if ($fm -match "(?m)^stage:\s*'?([a-z]+)") { $Matches[1] } else { 'sketch' }
  $isStudy = $fm -match "(?m)^tags:.*\bstudy\b"

  if ($hasKey -and $hasTempo -and $hasChords) { $xp += 1; $counts.sketch++ }
  if (Checked $body 'melody') { $xp += 2; $counts.melody++ }
  if (Checked $body 'lyrics') { $xp += 2; $counts.lyrics++ }
  if ((Checked $body 'recording') -or ($stage -in 'demo', 'produced', 'released')) { $xp += 5; $counts.demo++ }
  if ($stage -eq 'produced') { $xp += 8; $counts.produced++ }
  if (-not $isDraft) { $xp += 20; $counts.released++ }
  if ($isStudy) { $xp += 3; $counts.study++ }
}

$level = 'Demo Tape'; $next = $null; $nextAt = $null
$keys = @($LEVELS.Keys)
for ($i = 0; $i -lt $keys.Count; $i++) {
  if ($xp -ge $LEVELS[$keys[$i]]) { $level = $keys[$i] }
  if ($xp -lt $LEVELS[$keys[$i]] -and -not $next) { $next = $keys[$i]; $nextAt = $LEVELS[$keys[$i]] }
}

# --- Streak, from git history on the songs folder, not a save file ---------
$days = @()
try {
  $days = git -C "$repo" log --follow --format='%ad' --date=short -- src/content/songs/ 2>$null |
    Sort-Object -Unique -Descending
} catch { $days = @() }

$streak = 0; $streakNote = 'no history yet'
if ($days.Count -gt 0) {
  $today = Get-Date -Format 'yyyy-MM-dd'
  $cursor = [datetime]::Parse($days[0])
  foreach ($d in $days) {
    $dt = [datetime]::Parse($d)
    if ($dt -eq $cursor) { $streak++; $cursor = $cursor.AddDays(-1) }
    elseif ($dt -eq $cursor.AddDays(0)) { continue }
    else { break }
  }
  $gap = ([datetime]::Parse($today) - [datetime]::Parse($days[0])).Days
  $streakNote = if ($gap -eq 0) { 'active today' }
                elseif ($gap -eq 1) { 'do something today to keep it' }
                else { "BROKEN. Last rep $gap days ago ($($days[0]))" }
}

# --- This week vs best week -------------------------------------------------
$weekOf = { param($d) [datetime]::Parse($d).AddDays(-[int][datetime]::Parse($d).DayOfWeek).ToString('yyyy-MM-dd') }
$byWeek = $days | ForEach-Object { & $weekOf $_ } | Group-Object | Sort-Object Count -Descending
$thisWeekKey = & $weekOf (Get-Date -Format 'yyyy-MM-dd')
$thisWeek = ($byWeek | Where-Object { $_.Name -eq $thisWeekKey }).Count
$bestWeek = if ($byWeek) { $byWeek[0].Count } else { 0 }

# --- Print -------------------------------------------------------------------
Write-Host ""
Write-Host "  THE MUSIC GAME" -ForegroundColor Yellow
Write-Host "  --------------" -ForegroundColor DarkGray
Write-Host ("  {0} XP   x   {1}" -f $xp, $level) -ForegroundColor Cyan
if ($next) {
  $need = $nextAt - $xp
  Write-Host ("  {0} XP to {1}" -f $need, $next) -ForegroundColor DarkGray
} else {
  Write-Host "  Top level. Catalog Artist. Keep going anyway." -ForegroundColor DarkGray
}
Write-Host ""
Write-Host ("  streak: {0} days ({1})" -f $streak, $streakNote)
Write-Host ("  this week: {0} rep days   x   best week: {1}" -f $thisWeek, $bestWeek)
Write-Host ""
Write-Host "  the stack" -ForegroundColor DarkGray
Write-Host ("    sketches   {0,3}   melody {1,3}   lyrics {2,3}" -f $counts.sketch, $counts.melody, $counts.lyrics)
Write-Host ("    demo       {0,3}   produced {1,3}   released {2,3}" -f $counts.demo, $counts.produced, $counts.released)
if ($counts.study -gt 0) { Write-Host ("    studies    {0,3}" -f $counts.study) }
Write-Host ""
