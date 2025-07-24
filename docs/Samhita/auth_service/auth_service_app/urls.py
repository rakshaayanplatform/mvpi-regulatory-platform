from django.urls import path
from . import views
from .views import user_list


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
    path('request-password-reset-otp/', views.request_password_reset_otp, name='auth-request-password-reset-otp'),
    path('user-roles/', views.user_roles, name='auth-user-roles'),
    path('assign-role/', views.assign_role, name='auth-assign-role'),
    path('audit-logs/', views.audit_logs, name='auth-audit-logs'),
    path('users/', user_list, name='user-list'),
    path('verify-token/', views.verify_token),
]
