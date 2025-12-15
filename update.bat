@echo off
setlocal enabledelayedexpansion

if "%~1"=="" (
  echo Usage: update.bat -m "commit message"
  exit /b 1
)

set MSG=
if "%~1"=="-m" (
  set MSG=%~2
) else (
  echo Usage: update.bat -m "commit message"
  exit /b 1
)

if "%MSG%"=="" (
  echo Commit message is required.
  exit /b 1
)

git add .
git commit -m "%MSG%"
if errorlevel 1 (
  echo Commit failed.
  exit /b %errorlevel%
)

git push
if errorlevel 1 (
  echo Push failed.
  exit /b %errorlevel%
)

endlocal
