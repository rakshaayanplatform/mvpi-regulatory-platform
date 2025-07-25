import requests
from typing import Optional, Dict, Any

# Update this to match your Django server URL
BASE_URL = "http://localhost:8000/api"

def get_auth_headers(token: str) -> Dict[str, str]:
    """Return headers with JWT token for authentication."""
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

def register_user(username: str, email: str, password: str) -> Dict[str, Any]:
    """Register a new user."""
    url = f"{BASE_URL}/users/register/"
    data = {
        "username": username,
        "email": email,
        "password": password
    }
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()

def login_user(username: str, password: str) -> str:
    """Login user and return JWT token."""
    url = f"{BASE_URL}/auth/token/"
    data = {
        "username": username,
        "password": password
    }
    response = requests.post(url, data=data)
    response.raise_for_status()
    return response.json()["access"]

def create_analysis(token: str, title: str, description: str = "", data: dict = None) -> Dict[str, Any]:
    """Create a new analysis."""
    url = f"{BASE_URL}/analyses/"
    payload = {
        "title": title,
        "description": description,
        "data": data or {}
    }
    response = requests.post(
        url, 
        json=payload, 
        headers=get_auth_headers(token)
    )
    response.raise_for_status()
    return response.json()

def get_analyses(token: str) -> Dict[str, Any]:
    """Get all analyses for the authenticated user."""
    url = f"{BASE_URL}/analyses/"
    response = requests.get(
        url, 
        headers=get_auth_headers(token)
    )
    response.raise_for_status()
    return response.json()

def run_analysis(token: str, analysis_id: int) -> Dict[str, Any]:
    """Run a specific analysis."""
    url = f"{BASE_URL}/analyses/{analysis_id}/run_analysis/"
    response = requests.post(
        url,
        headers=get_auth_headers(token)
    )
    response.raise_for_status()
    return response.json()
