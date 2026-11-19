@echo off
setlocal

echo ========================================================
echo Starting Air Quality Index (AQI) Predictor with Docker
echo ========================================================

REM Add common Docker Desktop binary directories to PATH in case environment hasn't reloaded
set "PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin;%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin;%LOCALAPPDATA%\Docker\resources\bin"

REM Check if docker command is available
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Docker command was not found in PATH.
    echo Please make sure Docker Desktop is launched and running.
    echo You may need to restart your terminal or log out and log back in.
    echo.
    pause
    exit /b 1
)

echo Checking Docker daemon connection...
docker info >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo [WARNING] Docker Desktop is installed, but the Docker engine is not running yet!
    echo Please open Docker Desktop from your Start Menu and wait until the whale icon is green.
    echo.
    echo Press any key to retry once Docker Desktop is running...
    pause >nul
)

echo Building and starting backend and frontend containers...
docker compose up --build

pause
