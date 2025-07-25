from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Analysis

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class AnalysisSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Analysis
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
