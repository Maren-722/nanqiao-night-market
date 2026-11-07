@echo off

REM 停止占用 5173 端口的预览服务
set found=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
  taskkill /f /pid %%a >nul 2>&1
  set found=1
)
if "%found%"=="1" (
  echo 预览服务已停止。
) else (
  echo 当前没有在跑预览服务。
)
timeout /t 2 /nobreak >nul
