#!/usr/bin/env python3
"""
ConstitutionBD - RAG-powered Bangladesh Constitution Query System

This is the main entry point for the ConstitutionBD application.
"""

import os
import sys
import subprocess

def main():
    """Main entry point"""
    print("🏛️  Welcome to ConstitutionBD!")
    print("📖 RAG-powered Bangladesh Constitution Query System")
    print()
    print("Getting started:")
    print("1. Copy backend/.env.example to backend/.env")
    print("2. Add your Google Gemini API key to .env")
    print("3. Run: python main.py")
    print("4. Visit: http://localhost:8000/docs")
    print()
    
    # Check if .env exists
    env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
    if not os.path.exists(env_path):
        print("⚠️  Warning: .env file not found. Please create it from .env.example")
        print("   The system will work with basic functionality but LLM features require API keys.")
        print()
    
    # Start the server
    print("🚀 Starting ConstitutionBD Backend Server...")
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "backend.app:app", 
                       "--host", "0.0.0.0", "--port", "8000", "--reload"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    main()
