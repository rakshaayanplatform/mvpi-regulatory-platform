import requests

# Base URL for the Django backend API
BASE_URL = "http://127.0.0.1:8000/api"

def check_backend_health():
    """Check if the Django backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/health/")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": f"Failed to connect to backend: {str(e)}"
        }

def get_analysis_data():
    """Get analysis data from the Django backend"""
    try:
        response = requests.get(f"{BASE_URL}/analysis/")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": f"Failed to fetch analysis data: {str(e)}"
        }
