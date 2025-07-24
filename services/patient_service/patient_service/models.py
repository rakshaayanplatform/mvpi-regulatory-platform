from django.db import models

class Patient(models.Model):
    patient_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    dob = models.DateField()
    gender = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    blood_type = models.CharField(max_length=3, blank=True)
    allergies = models.CharField(max_length=255, blank=True)
    chronic_conditions = models.CharField(max_length=255, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient_id} - {self.full_name}"

class Appointment(models.Model):
    appointment_id = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor_id = models.CharField(max_length=20)
    date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[("pending", "Pending"), ("completed", "Completed"), ("cancelled", "Cancelled")], default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.appointment_id} - {self.patient.full_name}"

class MedicalRecord(models.Model):
    record_id = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="records")
    date = models.DateTimeField()
    type = models.CharField(max_length=50)
    notes = models.TextField()
    diagnosis = models.CharField(max_length=255)
    prescription = models.CharField(max_length=255)
    follow_up_date = models.DateTimeField(null=True, blank=True)
    attached_files = models.FileField(upload_to='medical_records/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.record_id} - {self.patient.full_name}"

class HelpEntry(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()

    def __str__(self):
        return self.question
