"""
URL configuration for auth_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='auth-register'),
    path('login/', views.login_view, name='auth-login'),
    path('logout/', views.logout_view, name='auth-logout'),
    path('profile/', views.profile, name='auth-profile'),
    path('profile/update/', views.update_profile, name='auth-profile-update'),
    path('change-password/', views.change_password, name='auth-change-password'),
    path('request-otp/', views.request_otp, name='auth-request-otp'),
    path('verify-otp/', views.verify_otp, name='auth-verify-otp'),
    path('reset-password/', views.reset_password, name='auth-reset-password'),
    path('user-roles/', views.user_roles, name='auth-user-roles'),
    path('assign-role/', views.assign_role, name='auth-assign-role'),
    path('audit-logs/', views.audit_logs, name='auth-audit-logs'),
]
