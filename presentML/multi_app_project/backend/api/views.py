from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Simple API endpoint for testing the connection

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'status': 'success',
        'message': 'Django backend is running',
        'data': None
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_analysis_data(request):
    """Example endpoint to get analysis data"""
    return Response({
        'status': 'success',
        'data': {
            'total_analyses': 0,
            'last_updated': None
        }
    }, status=status.HTTP_200_OK)

# Create your views here.
