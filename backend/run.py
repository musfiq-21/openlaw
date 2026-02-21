#!/usr/bin/env python3
"""
ConstitutionBD Backend Server
Run this script to start the FastAPI server
"""

import uvicorn
from config import config

if __name__ == "__main__":
    print("Starting ConstitutionBD Backend Server...")
    print(f"Server will be available at: http://{config.HOST}:{config.PORT}")
    print(f"API Documentation: http://{config.HOST}:{config.PORT}/docs")
    print(f"Alternative Docs: http://{config.HOST}:{config.PORT}/redoc")
    print(f"LLM Provider: {config.LLM_PROVIDER}")
    print(f"Embedding Model: {config.EMBEDDING_MODEL}")
    print("-" * 50)
    
    uvicorn.run(
        "app:app",
        host=config.HOST,
        port=config.PORT,
        reload=True,
        log_level="info"
    )
