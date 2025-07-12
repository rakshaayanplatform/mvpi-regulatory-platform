from django.db import models
from django.utils import timezone
import uuid


class PatientReport(models.Model):
    """Patient adverse event report model."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey('auth_service.User', on_delete=models.CASCADE)
    device_name = models.CharField(max_length=200)
    manufacturer = models.CharField(max_length=200)
    incident_date = models.DateField()
    location = models.CharField(max_length=500)
    
    # Patient details
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ])
    medical_history = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    
    # Incident details
    description = models.TextField()
    symptoms = models.TextField()
    severity = models.CharField(max_length=20, choices=[
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe')
    ])
    outcome = models.CharField(max_length=20, choices=[
        ('recovered', 'Recovered'),
        ('under_treatment', 'Under Treatment'),
        ('disability', 'Disability'),
        ('death', 'Death')
    ])
    
    # Device information
    device_type = models.CharField(max_length=100)
    model_number = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=100, blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    usage_duration = models.CharField(max_length=100, blank=True)
    
    # Status tracking
    status = models.CharField(max_length=20, default='submitted', choices=[
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('additional_info_required', 'Additional Info Required'),
        ('forwarded_to_manufacturer', 'Forwarded to Manufacturer'),
        ('closed', 'Closed')
    ])
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'patient_reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Report {self.id} - {self.device_name}"


class ReportAttachment(models.Model):
    """File attachments for patient reports."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(PatientReport, on_delete=models.CASCADE, related_name='attachments')
    file_type = models.CharField(max_length=20, choices=[
        ('image', 'Image'),
        ('document', 'Document'),
        ('audio', 'Audio'),
        ('video', 'Video')
    ])
    file = models.FileField(upload_to='patient_reports/')
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField()  # in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'patient_report_attachments'
    
    def __str__(self):
        return f"Attachment {self.id} - {self.file_name}" 