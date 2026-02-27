#!/bin/bash
# ConstitutionBD - Startup Script for macOS/Linux
# This script helps you start the application

clear

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ConstitutionBD Startup                    ║"
echo "║         🏛️  Bangladesh Constitution Query System            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Check backend requirements
echo "📦 Checking backend dependencies..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies OK"
cd ..

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "⚠️  WARNING: backend/.env not found!"
    echo "Please create it from backend/.env.example with your API key"
    echo ""
fi

# Show menu
show_menu() {
    clear
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                     Startup Menu                            ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║ 1. Start Everything (Backend + Frontend)                   ║"
    echo "║ 2. Start Backend Only                                      ║"
    echo "║ 3. Start Frontend Only                                     ║"
    echo "║ 4. Ingest Constitution Data                                ║"
    echo "║ 5. View API Docs (opens browser)                           ║"
    echo "║ 6. Check System Health                                     ║"
    echo "║ 7. Exit                                                    ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            echo ""
            echo "🚀 Starting ConstitutionBD (Backend + Frontend)..."
            echo ""
            
            # Start backend in background
            python main.py &
            BACKEND_PID=$!
            sleep 3
            
            # Start frontend in background
            cd frontend
            python serve.py &
            FRONTEND_PID=$!
            cd ..
            
            sleep 2
            echo ""
            echo "✅ Both servers started!"
            echo ""
            echo "🌐 Frontend:  http://localhost:3000"
            echo "🔧 Backend:   http://localhost:8000"
            echo "📚 API Docs:  http://localhost:8000/docs"
            echo ""
            echo "Press Ctrl+C to stop servers"
            echo ""
            wait $BACKEND_PID $FRONTEND_PID
            ;;
        2)
            echo ""
            echo "🚀 Starting Backend Server..."
            echo ""
            source backend/venv/bin/activate
            python main.py
            ;;
        3)
            echo ""
            echo "🚀 Starting Frontend Server..."
            echo ""
            cd frontend
            python serve.py
            ;;
        4)
            echo ""
            echo "📥 Ingesting Constitution Data..."
            echo "Make sure backend is running!"
            echo ""
            source backend/venv/bin/activate
            python backend/ingest_chroma.py
            echo ""
            echo "✅ Ingestion complete!"
            echo ""
            read -p "Press Enter to continue..."
            ;;
        5)
            echo ""
            echo "📖 Opening API Documentation..."
            echo "(This will open in your default browser)"
            echo ""
            
            # Try to open in default browser
            if [[ "$OSTYPE" == "darwin"* ]]; then
                open http://localhost:8000/docs
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                xdg-open http://localhost:8000/docs
            else
                echo "Please open http://localhost:8000/docs in your browser"
            fi
            
            sleep 2
            ;;
        6)
            echo ""
            echo "🏥 Checking System Health..."
            echo ""
            
            python3 << 'EOF'
import requests
import json

try:
    response = requests.get('http://localhost:8000/health', timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
    else:
        print(f"❌ Server returned status {response.status_code}")
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend. Is it running?")
except Exception as e:
    print(f"❌ Error: {e}")
EOF
            
            echo ""
            read -p "Press Enter to continue..."
            ;;
        7)
            echo ""
            echo "👋 Goodbye!"
            echo ""
            echo "For manual startup, use:"
            echo "  - Backend: python main.py"
            echo "  - Frontend: cd frontend && python serve.py"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Invalid choice. Please try again."
            read -p "Press Enter to continue..."
            ;;
    esac
done
