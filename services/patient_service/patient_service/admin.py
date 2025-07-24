from django.contrib import admin
from .models import Patient, Appointment, MedicalRecord, HelpEntry

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'full_name', 'email', 'phone_number', 'status', 'created_at')
    search_fields = ('patient_id', 'full_name', 'email', 'phone_number')
    list_filter = ('status', 'gender', 'blood_type')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('appointment_id', 'patient', 'doctor_id', 'date', 'status')
    search_fields = ('appointment_id', 'patient__full_name', 'doctor_id')
    list_filter = ('status',)

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('record_id', 'patient', 'date', 'type', 'diagnosis')
    search_fields = ('record_id', 'patient__full_name', 'diagnosis')
    list_filter = ('type',)

@admin.register(HelpEntry)
class HelpEntryAdmin(admin.ModelAdmin):
    list_display = ('question',)
    search_fields = ('question',) 