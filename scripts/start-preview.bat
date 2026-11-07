@echo off

REM 南桥夜市 · 常驻预览（构建 + 启动 + 崩溃自动重启）
REM 关掉这个黑窗口 = 停止预览；重新双击「启动预览.bat」即可再开

cd /d "%~dp0.."
set "ROOT=%CD%"
if not exist "%ROOT%\logs" mkdir "%ROOT%\logs"
set "LOG=%ROOT%\logs\preview.log"

echo. >> "%LOG%"
echo ===== %date% %time% 启动预览 ===== >> "%LOG%"

if not exist "%ROOT%\node_modules" (
  echo [1/3] 首次运行，安装依赖……
  call npm install >> "%LOG%" 2>&1
)

echo [2/3] 构建最新版本……
call npm run build >> "%LOG%" 2>&1
if errorlevel 1 (
  echo     构建失败，先沿用上一次的 dist，详见 logs\preview.log
)

:loop
echo [3/3] 启动服务  http://localhost:5173/nanqiao-night-market/
node "%ROOT%\scripts\preview-server.mjs" >> "%LOG%" 2>&1
echo [%date% %time%] 服务退出，3 秒后自动重启 >> "%LOG%"
timeout /t 3 /nobreak >nul
goto loop
