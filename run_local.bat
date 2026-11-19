@echo off
setlocal
echo ========================================================
echo Running Air Quality Index (AQI) Predictor Locally
echo ========================================================

REM Step 1: Check if model.pkl exists, train if not
if not exist "backend\model.pkl" (
    echo Model file not found. Training model now...
    python backend\train.py
)

REM Step 2: Start backend
echo Starting FastAPI backend server on http://localhost:8000 ...
start "AQI Backend API" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM Step 3: Check for npm to run Vite dev server
where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting React (Vite) frontend on http://localhost:3000 ...
    start "AQI React Frontend" cmd /k "cd frontend && npm install && npm run dev"
) else (
    echo Note: Node.js/npm was not found on your local system.
    echo To run the React frontend with Docker, simply run:
    echo   run_docker.bat   or   docker compose up --build
)

echo.
echo Backend API Docs: http://localhost:8000/docs
echo.
pause
