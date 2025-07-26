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
    path('request-password-reset-otp/', views.request_password_reset_otp, name='auth-request-password-reset-otp'),
    path('user-roles/', views.user_roles, name='auth-user-roles'),
    path('assign-role/', views.assign_role, name='auth-assign-role'),
    path('audit-logs/', views.audit_logs, name='auth-audit-logs'),
    path('email/send-verification/', views.send_verification_email, name='send-verification-email'),
    path('email/verify/', views.verify_email, name='verify-email'),
    
    # Admin API Endpoints (using 'api/admin/' to avoid conflict with Django admin)
    path('api/admin/users/', views.admin_list_users, name='admin-list-users'),
    path('api/admin/users/<int:user_id>/', views.admin_update_user, name='admin-update-user'),
    path('api/admin/users/<int:user_id>/deactivate/', views.admin_deactivate_user, name='admin-deactivate-user'),
    path('api/admin/users/create/', views.admin_create_user, name='admin-create-user'),
    path('api/admin/users/<int:user_id>/activate/', views.admin_activate_user, name='admin-activate-user'),
    path('api/admin/roles/', views.admin_list_roles, name='admin-list-roles'),
    path('api/admin/roles/create/', views.admin_create_role, name='admin-create-role'),
    path('api/admin/roles/<int:role_id>/', views.admin_update_role, name='admin-update-role'),
    path('api/admin/roles/<int:role_id>/delete/', views.admin_delete_role, name='admin-delete-role'),
    path('api/admin/audit-logs/', views.admin_audit_logs, name='admin-audit-logs'),
    path('api/admin/audit-logs/export/', views.admin_export_audit_logs, name='admin-export-audit-logs'),
    path('api/admin/system/config/', views.admin_system_config, name='admin-system-config'),
    path('api/admin/system/config/update/', views.admin_update_system_config, name='admin-update-system-config'),
    path('api/admin/system/health/', views.admin_system_health, name='admin-system-health'),
    path('api/admin/system/backup/', views.admin_system_backup, name='admin-system-backup'),
    path('api/admin/system/restart/', views.admin_system_restart, name='admin-system-restart'),
    path('api/admin/users/<int:user_id>/roles/', views.admin_user_roles, name='admin-user-roles'),
    path('api/admin/users/<int:user_id>/roles/assign/', views.admin_assign_user_role, name='admin-assign-user-role'),
    path('api/admin/users/<int:user_id>/roles/<int:role_id>/remove/', views.admin_remove_user_role, name='admin-remove-user-role'),
    
    # =============================================================================
    # FUTURE SERVICE INTEGRATION URL PATTERNS
    # =============================================================================
    # These URLs will be implemented when other microservices are ready
    
    # Patient Service Admin Endpoints (Future)
    path('admin/services/patient/overview/', views.admin_patient_service_overview, name='admin-patient-service-overview'),
    path('admin/services/patient/management/', views.admin_patient_service_management, name='admin-patient-service-management'),
    
    # Government Service Admin Endpoints (Future)
    path('admin/services/government/overview/', views.admin_government_service_overview, name='admin-government-service-overview'),
    path('admin/services/government/management/', views.admin_government_service_management, name='admin-government-service-management'),
    
    # Coordinator Service Admin Endpoints (Future)
    path('admin/services/coordinator/overview/', views.admin_coordinator_service_overview, name='admin-coordinator-service-overview'),
    path('admin/services/coordinator/management/', views.admin_coordinator_service_management, name='admin-coordinator-service-management'),
    
    # Hospital Service Admin Endpoints (Future)
    path('admin/services/hospital/overview/', views.admin_hospital_service_overview, name='admin-hospital-service-overview'),
    path('admin/services/hospital/management/', views.admin_hospital_service_management, name='admin-hospital-service-management'),
    
    # Manufacturer Service Admin Endpoints (Future)
    path('admin/services/manufacturer/overview/', views.admin_manufacturer_service_overview, name='admin-manufacturer-service-overview'),
    path('admin/services/manufacturer/management/', views.admin_manufacturer_service_management, name='admin-manufacturer-service-management'),
    
    # Media Service Admin Endpoints (Future)
    path('admin/services/media/overview/', views.admin_media_service_overview, name='admin-media-service-overview'),
    path('admin/services/media/management/', views.admin_media_service_management, name='admin-media-service-management'),
    
    # Cross-Service Admin Endpoints (Future)
    path('admin/services/overview/', views.admin_all_services_overview, name='admin-all-services-overview'),
    path('admin/services/communication-logs/', views.admin_service_communication_logs, name='admin-service-communication-logs'),
    path('admin/services/<str:service_name>/maintenance/', views.admin_service_maintenance_mode, name='admin-service-maintenance-mode'),
]