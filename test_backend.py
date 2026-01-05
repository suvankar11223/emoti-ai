import requests

try:
    response = requests.post("http://localhost:8000/chat", json={"message": "I miss her"})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
