"""
Simple HTTP server to serve the frontend
Run this from the frontend directory:
    python serve.py
Then visit: http://localhost:3000
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 3000
FRONTEND_DIR = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def translate_path(self, path):
        # Serve from frontend directory
        path = super().translate_path(path)
        relpath = os.path.relpath(path, os.getcwd())
        return os.path.join(FRONTEND_DIR, relpath)

if __name__ == '__main__':
    os.chdir(FRONTEND_DIR)
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"""Serving frontend at http://localhost:{PORT}
Press Ctrl+C to stop the server.
        """)
        httpd.serve_forever()
