#!/usr/bin/env python3
"""
Her - Full Stack Launcher
Launches both React frontend and FastAPI backend
"""

import subprocess
import webbrowser
import time
import os
import sys
import threading

def launch_backend():
    """Launch the FastAPI backend"""
    try:
        print("🚀 Starting FastAPI backend...")
        process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "backend:app", "--reload", "--port", "8000"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        time.sleep(3)  # Wait for backend to start
        return process
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return None

def launch_frontend():
    """Launch the React frontend"""
    try:
        react_dir = os.path.join(os.getcwd(), "Feature Implementation Suggestions")

        if not os.path.exists(os.path.join(react_dir, "package.json")):
            print("❌ React app not found")
            return None

        print("🌐 Starting React frontend...")
        process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=react_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0,
            shell=True
        )
        time.sleep(5)  # Wait for frontend to start
        return process
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    """Main function to launch both services"""
    print("🌸 Her - Full Stack Launcher 🌸")
    print("=" * 50)

    # Launch backend
    backend_process = launch_backend()
    if not backend_process:
        sys.exit(1)

    # Launch frontend
    frontend_process = launch_frontend()
    if not frontend_process:
        backend_process.terminate()
        sys.exit(1)

    print("✅ Both services started successfully!")
    print("🌐 Opening browser to http://localhost:5173")

    # Open browser
    webbrowser.open("http://localhost:5173")

    print("\n" + "=" * 50)
    print("🎨 Figma Design + AI Backend Running!")
    print("📱 Frontend: http://localhost:5173")
    print("🔧 Backend API: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop both services")
    print("=" * 50)

    # Keep both processes running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
        if frontend_process:
            frontend_process.terminate()
        if backend_process:
            backend_process.terminate()
        print("✅ Services stopped")

if __name__ == "__main__":
    main()
