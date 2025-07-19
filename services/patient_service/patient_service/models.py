from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AdverseEvent(models.Model):
    """Model for storing adverse event reports."""

    SEVERITY_CHOICES = [
        ("mild", "Mild"),
        ("moderate", "Moderate"),
        ("severe", "Severe"),
        ("critical", "Critical"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    # Basic information
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    # Device information
    device_name = models.CharField(max_length=200)
    device_category = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=200)
    model_number = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=100, blank=True)

    # Event details
    event_date = models.DateField()
    event_location = models.CharField(max_length=200)
    symptoms = models.TextField()
    treatment_received = models.TextField(blank=True)
    outcome = models.TextField(blank=True)

    # Additional information
    witnesses = models.TextField(blank=True)
    additional_notes = models.TextField(blank=True)
    supporting_documents = models.JSONField(default=list)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_events",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "patient_adverse_events"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.patient.username}"


class EventAttachment(models.Model):
    """Model for storing attachments related to adverse events."""

    ATTACHMENT_TYPES = [
        ("image", "Image"),
        ("document", "Document"),
        ("video", "Video"),
        ("audio", "Audio"),
    ]

    event = models.ForeignKey(AdverseEvent, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20, choices=ATTACHMENT_TYPES)
    file_size = models.IntegerField()  # Size in bytes
    file_path = models.CharField(max_length=500)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "patient_event_attachments"

    def __str__(self):
        return f"{self.file_name} - {self.event.title}"
