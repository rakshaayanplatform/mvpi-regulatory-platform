"""
Database Models for Rakshaayan AI Service
Medical Device Adverse Event Reporting System
"""

from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, Float, 
    ForeignKey, Table, Enum, JSON, LargeBinary, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

# Enums
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    HEALTHCARE_PROFESSIONAL = "healthcare_professional"
    MANUFACTURER = "manufacturer"
    PATIENT = "patient"

class EventSeverity(str, enum.Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"

class EventStatus(str, enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    CLOSED = "closed"

class DeviceCategory(str, enum.Enum):
    CARDIOVASCULAR = "cardiovascular"
    NEUROLOGICAL = "neurological"
    ORTHOPEDIC = "orthopedic"
    RESPIRATORY = "respiratory"
    DIAGNOSTIC = "diagnostic"
    SURGICAL = "surgical"
    MONITORING = "monitoring"
    OTHER = "other"

class ProcessingStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# Association Tables
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True)
)

# Main Models
class User(Base):
    """User model with role-based access control"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    organization = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    adverse_events = relationship("AdverseEvent", back_populates="reported_by")
    processing_jobs = relationship("ProcessingJob", back_populates="user")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_username', 'username'),
        Index('idx_user_organization', 'organization'),
    )

class Role(Base):
    """Role model for RBAC"""
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    permissions = Column(JSON)  # Store permissions as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="roles")

class AdverseEvent(Base):
    """Adverse event reporting model"""
    __tablename__ = "adverse_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(Enum(EventSeverity), nullable=False)
    status = Column(Enum(EventStatus), default=EventStatus.PENDING)
    
    # Device Information
    device_name = Column(String(200), nullable=False)
    device_category = Column(Enum(DeviceCategory), nullable=False)
    manufacturer = Column(String(200), nullable=False)
    model_number = Column(String(100))
    serial_number = Column(String(100))
    
    # Location and Timing
    hospital_name = Column(String(200))
    location = Column(String(200))
    event_date = Column(DateTime(timezone=True), nullable=False)
    reported_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Patient Information (anonymized)
    patient_age_group = Column(String(20))  # e.g., "18-25", "26-35"
    patient_gender = Column(String(10))
    patient_outcome = Column(String(100))
    
    # AI Processing Results
    ai_confidence_score = Column(Float)
    ai_classification = Column(String(100))
    ai_entities = Column(JSON)  # Extracted entities
    ai_sentiment = Column(String(20))
    
    # Relationships
    reported_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reported_by = relationship("User", back_populates="adverse_events")
    
    # Related files and processing jobs
    audio_files = relationship("AudioFile", back_populates="adverse_event")
    image_files = relationship("ImageFile", back_populates="adverse_event")
    processing_jobs = relationship("ProcessingJob", back_populates="adverse_event")
    
    # Indexes
    __table_args__ = (
        Index('idx_event_id', 'event_id'),
        Index('idx_event_date', 'event_date'),
        Index('idx_device_category', 'device_category'),
        Index('idx_severity', 'severity'),
        Index('idx_status', 'status'),
        Index('idx_manufacturer', 'manufacturer'),
    )

class AudioFile(Base):
    """Audio file storage and processing model"""
    __tablename__ = "audio_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    duration = Column(Float)  # Duration in seconds
    format = Column(String(20))  # wav, mp3, etc.
    
    # Processing Results
    transcription = Column(Text)
    language_detected = Column(String(10))
    confidence_score = Column(Float)
    processing_status = Column(Enum(ProcessingStatus), default=ProcessingStatus.PENDING)
    processing_metadata = Column(JSON)  # Store processing details
    
    # Timestamps
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    adverse_event_id = Column(Integer, ForeignKey("adverse_events.id"), nullable=False)
    adverse_event = relationship("AdverseEvent", back_populates="audio_files")
    
    # Indexes
    __table_args__ = (
        Index('idx_audio_filename', 'filename'),
        Index('idx_audio_status', 'processing_status'),
        Index('idx_audio_language', 'language_detected'),
    )

class ImageFile(Base):
    """Image file storage and OCR processing model"""
    __tablename__ = "image_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    width = Column(Integer)
    height = Column(Integer)
    format = Column(String(20))  # jpg, png, pdf, etc.
    
    # OCR Processing Results
    extracted_text = Column(Text)
    ocr_confidence = Column(Float)
    language_detected = Column(String(10))
    processing_status = Column(Enum(ProcessingStatus), default=ProcessingStatus.PENDING)
    processing_metadata = Column(JSON)  # Store OCR details
    
    # Timestamps
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    adverse_event_id = Column(Integer, ForeignKey("adverse_events.id"), nullable=False)
    adverse_event = relationship("AdverseEvent", back_populates="image_files")
    
    # Indexes
    __table_args__ = (
        Index('idx_image_filename', 'filename'),
        Index('idx_image_status', 'processing_status'),
        Index('idx_image_format', 'format'),
    )

class ProcessingJob(Base):
    """AI processing job tracking model"""
    __tablename__ = "processing_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(100), unique=True, index=True, nullable=False)
    job_type = Column(String(50), nullable=False)  # speech_to_text, ocr, nlp, medical_terms
    status = Column(Enum(ProcessingStatus), default=ProcessingStatus.PENDING)
    
    # Job Details
    input_data = Column(JSON)  # Input parameters
    output_data = Column(JSON)  # Processing results
    error_message = Column(Text)
    
    # Performance Metrics
    processing_time = Column(Float)  # Time in seconds
    model_used = Column(String(100))
    model_version = Column(String(50))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="processing_jobs")
    
    adverse_event_id = Column(Integer, ForeignKey("adverse_events.id"))
    adverse_event = relationship("AdverseEvent", back_populates="processing_jobs")
    
    # Indexes
    __table_args__ = (
        Index('idx_job_id', 'job_id'),
        Index('idx_job_type', 'job_type'),
        Index('idx_job_status', 'status'),
        Index('idx_job_created', 'created_at'),
    )

class MedicalTerm(Base):
    """Medical terminology and device classification model"""
    __tablename__ = "medical_terms"
    
    id = Column(Integer, primary_key=True, index=True)
    term = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)  # device, symptom, procedure, etc.
    subcategory = Column(String(100))
    description = Column(Text)
    
    # Classification
    device_category = Column(Enum(DeviceCategory))
    severity_level = Column(Enum(EventSeverity))
    
    # Language Support
    hindi_translation = Column(String(200))
    tamil_translation = Column(String(200))
    telugu_translation = Column(String(200))
    
    # Metadata
    source = Column(String(100))  # MvPI, FDA, WHO, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Indexes
    __table_args__ = (
        Index('idx_term', 'term'),
        Index('idx_category', 'category'),
        Index('idx_device_category', 'device_category'),
        Index('idx_source', 'source'),
    )

class SocialMediaAlert(Base):
    """Social media monitoring and alert model"""
    __tablename__ = "social_media_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(100), unique=True, index=True, nullable=False)
    
    # Source Information
    platform = Column(String(50), nullable=False)  # twitter, reddit, facebook, etc.
    post_id = Column(String(100), nullable=False)
    author = Column(String(100))
    content = Column(Text, nullable=False)
    
    # Analysis Results
    sentiment_score = Column(Float)
    sentiment_label = Column(String(20))  # positive, negative, neutral
    relevance_score = Column(Float)
    device_mentions = Column(JSON)  # List of mentioned devices
    entities_extracted = Column(JSON)  # Extracted medical entities
    
    # Alert Information
    alert_level = Column(Enum(EventSeverity))
    is_processed = Column(Boolean, default=False)
    processed_by_id = Column(Integer, ForeignKey("users.id"))
    
    # Timestamps
    posted_at = Column(DateTime(timezone=True))
    detected_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    processed_by = relationship("User")
    
    # Indexes
    __table_args__ = (
        Index('idx_alert_id', 'alert_id'),
        Index('idx_platform', 'platform'),
        Index('idx_sentiment', 'sentiment_label'),
        Index('idx_alert_level', 'alert_level'),
        Index('idx_detected_at', 'detected_at'),
    )

class ModelPerformance(Base):
    """ML model performance tracking model"""
    __tablename__ = "model_performance"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=False)
    task_type = Column(String(50), nullable=False)  # speech_to_text, ocr, nlp, classification
    
    # Performance Metrics
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    processing_time_avg = Column(Float)
    
    # Usage Statistics
    total_requests = Column(Integer, default=0)
    successful_requests = Column(Integer, default=0)
    failed_requests = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Indexes
    __table_args__ = (
        Index('idx_model_name', 'model_name'),
        Index('idx_task_type', 'task_type'),
        Index('idx_model_version', 'model_version'),
    )

class APILog(Base):
    """API request/response logging model"""
    __tablename__ = "api_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String(100), unique=True, index=True, nullable=False)
    
    # Request Information
    endpoint = Column(String(200), nullable=False)
    method = Column(String(10), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    
    # Request/Response Details
    request_data = Column(JSON)
    response_data = Column(JSON)
    status_code = Column(Integer, nullable=False)
    
    # Performance
    response_time = Column(Float)  # Time in seconds
    request_size = Column(Integer)
    response_size = Column(Integer)
    
    # Timestamps
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    
    # Indexes
    __table_args__ = (
        Index('idx_request_id', 'request_id'),
        Index('idx_endpoint', 'endpoint'),
        Index('idx_status_code', 'status_code'),
        Index('idx_timestamp', 'timestamp'),
        Index('idx_user_id', 'user_id'),
    )

# Database initialization function
def init_db(engine):
    """Initialize database with all tables"""
    Base.metadata.create_all(bind=engine)

# Model validation functions
def validate_user_data(data):
    """Validate user data before creation"""
    if not data.get('username') or len(data['username']) < 3:
        raise ValueError("Username must be at least 3 characters long")
    if not data.get('email') or '@' not in data['email']:
        raise ValueError("Valid email is required")
    if not data.get('full_name'):
        raise ValueError("Full name is required")
    return True

def validate_adverse_event_data(data):
    """Validate adverse event data before creation"""
    required_fields = ['title', 'description', 'severity', 'device_name', 'device_category', 'manufacturer', 'event_date']
    for field in required_fields:
        if not data.get(field):
            raise ValueError(f"{field} is required")
    return True 