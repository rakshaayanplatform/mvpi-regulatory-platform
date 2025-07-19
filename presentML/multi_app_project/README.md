# Django + Streamlit Integration

This project demonstrates how to integrate a Django backend with a Streamlit frontend, keeping them decoupled and communicating via REST API.

## Project Structure

```
project_root/
├── backend/               # Django backend
│   ├── core/             # Django project settings
│   ├── api/              # Django app with API endpoints
│   ├── manage.py
│   └── requirements.txt
├── frontend/             # Your existing Streamlit app
├── api_utils.py          # Helper functions for API calls
├── django_integration.py # Example Streamlit component
└── requirements.txt
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser (admin):
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

### 2. Frontend Setup

1. Install the required Python packages:
   ```bash
   pip install streamlit requests python-dotenv
   ```

2. Run the example Streamlit app:
   ```bash
   streamlit run django_integration.py
   ```

## API Endpoints

- `POST /api/users/register/` - Register a new user
- `POST /api/auth/token/` - Get JWT token (login)
- `GET /api/analyses/` - List all analyses (requires authentication)
- `POST /api/analyses/` - Create a new analysis (requires authentication)
- `POST /api/analyses/{id}/run_analysis/` - Run a specific analysis (requires authentication)

## How It Works

1. **Authentication**:
   - Users can register and login using JWT tokens
   - The Streamlit app stores the JWT token in the session state
   - All authenticated API calls include the token in the Authorization header

2. **Data Flow**:
   - Streamlit makes HTTP requests to the Django REST API
   - Django handles authentication, data validation, and database operations
   - The frontend and backend are completely decoupled

3. **Development Workflow**:
   - Run the Django backend on port 8000
   - Run the Streamlit frontend on a different port (default: 8501)
   - The frontend makes API calls to the backend

## Best Practices

1. **Environment Variables**:
   - Store sensitive information (secret keys, database URLs) in environment variables
   - Use `python-dotenv` to load environment variables from a `.env` file

2. **Error Handling**:
   - Implement proper error handling in both frontend and backend
   - Return meaningful error messages from the API

3. **Security**:
   - Use HTTPS in production
   - Set appropriate CORS policies
   - Implement rate limiting
   - Keep dependencies updated

4. **Deployment**:
   - Deploy Django using Gunicorn or uWSGI with Nginx
   - Use a production database (PostgreSQL recommended)
   - Consider using Docker for containerization
   - Use environment variables for configuration

## Next Steps

1. Add more API endpoints for your specific use case
2. Implement proper user roles and permissions
3. Add API documentation using Swagger/OpenAPI
4. Set up CI/CD pipelines
5. Add tests for both frontend and backend
