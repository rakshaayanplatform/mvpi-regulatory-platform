# AI Service Routers Package
# This package contains all the API routers for the AI service

from . import speech_to_text, ocr, nlp, medical_terms

__all__ = [
    'speech_to_text',
    'ocr', 
    'nlp',
    'medical_terms'
] 