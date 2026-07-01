@echo off
REM ============================================================
REM  Marclie CMS - start the LOCAL dev web server (double-click)
REM  Local port: 8782  (changed from Next's default 3000)
REM  URL:   http://localhost:8782
REM  Admin: http://localhost:8782/admin
REM  Stop:  press Ctrl+C in this window
REM ============================================================
title Marclie CMS - Local Dev (http://localhost:8782)
cd /d "%~dp0"

echo(
echo   Starting Marclie CMS dev server...
echo   URL:   http://localhost:8782
echo   Admin: http://localhost:8782/admin
echo(

REM Open the browser after a short delay (the server needs a few seconds to boot)
start "" cmd /c "timeout /t 7 >nul & start http://localhost:8782"

REM Run the dev server (uses port 8782 from package.json "dev" script)
call pnpm dev

echo(
echo   Dev server stopped.
pause
