@echo off
REM ConstitutionBD - Startup Script for Windows
REM This script starts both backend and frontend simultaneously

setlocal enabledelayedexpansion
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                   ConstitutionBD Startup                    ║
echo ║         🏛️  Bangladesh Constitution Query System            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Check backend requirements
echo 📦 Checking backend dependencies...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies OK
cd ..

REM Check if .env exists
if not exist backend\.env (
    echo ⚠️  WARNING: backend\.env not found!
    echo Please create it from backend\.env.example with your API key
    echo.
)

REM Create startup menu
:menu
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                     Startup Menu                            ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║ 1. Start Everything (Backend + Frontend)                   ║
echo ║ 2. Start Backend Only                                      ║
echo ║ 3. Start Frontend Only                                     ║
echo ║ 4. Ingest Constitution Data                                ║
echo ║ 5. View API Docs (opens browser)                           ║
echo ║ 6. Check System Health                                     ║
echo ║ 7. Exit                                                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto ingest
if "%choice%"=="5" goto docs
if "%choice%"=="6" goto health
if "%choice%"=="7" goto exit
goto menu

:start_all
cls
echo.
echo 🚀 Starting ConstitutionBD (Backend + Frontend)...
echo.
start cmd /k python main.py
timeout /t 3
start cmd /k "cd frontend && python serve.py"
timeout /t 2
echo.
echo ✅ Both servers started!
echo.
echo 🌐 Frontend:  http://localhost:3000
echo 🔧 Backend:   http://localhost:8000
echo 📚 API Docs:  http://localhost:8000/docs
echo.
echo Press any key to return to menu...
pause >nul
goto menu

:start_backend
cls
echo.
echo 🚀 Starting Backend Server...
echo.
call backend\venv\Scripts\activate.bat
python main.py
goto menu

:start_frontend
cls
echo.
echo 🚀 Starting Frontend Server...
echo.
cd frontend
python serve.py
goto menu

:ingest
cls
echo.
echo 📥 Ingesting Constitution Data...
echo Make sure backend is running!
echo.
call backend\venv\Scripts\activate.bat
python backend\ingest_chroma.py
echo.
echo ✅ Ingestion complete!
echo.
pause
goto menu

:docs
cls
echo.
echo 📖 Opening API Documentation...
echo (This will open in your default browser)
echo.
timeout /t 2
start http://localhost:8000/docs
echo.
echo ✅ Browser should open. Press any key to continue...
pause >nul
goto menu

:health
cls
echo.
echo 🏥 Checking System Health...
echo.
for /f "tokens=*" %%a in ('python -c "import requests; r = requests.get('http://localhost:8000/health'); print(r.json() if r.status_code == 200 else {\"error\": \"Connection failed\"})" 2^>nul') do (
    echo %%a
)
echo.
pause
goto menu

:exit
cls
echo.
echo 👋 Goodbye!
echo For manual startup, use:
echo   - Backend: python main.py
echo   - Frontend: cd frontend && python serve.py
echo.
timeout /t 2
exit /b 0
