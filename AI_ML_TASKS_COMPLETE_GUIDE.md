# AI/ML Development Tasks - Complete Guide for Medical Device Adverse Event Reporting System

## 📋 PROJECT OVERVIEW

This document provides a **COMPLETE** guide for the AI/ML development tasks for the Medical Device Adverse Event Reporting System (MvPI) project. The system leverages artificial intelligence and large language models to enhance adverse event monitoring, prediction, and analysis for medical devices in India.

---

## 🏗️ CURRENT PROJECT ARCHITECTURE

### ✅ COMPLETED COMPONENTS

#### 1. **Adverse Event Predictor** (`presentML/adverse_event_predictor.py`)
- Complete ML pipeline with Random Forest, Gradient Boosting, Logistic Regression
- Data preprocessing, model training, evaluation, and prediction capabilities
- Feature importance analysis and visualization

#### 2. **Gemini QA Chatbot** (`presentML/gemini_qa_chatbot.py`)
- Standalone chatbot with conversation management
- API integration with Google Gemini
- Message history and export functionality

#### 3. **OCR Module** (`presentML/ocr_module.py`)
- Text extraction from medical documents and images
- Multiple preprocessing techniques
- Confidence scoring and batch processing

#### 4. **Medical Device Monitor** (`presentML/medical_device_monitor.py`)
- Social media monitoring and sentiment analysis
- Real-time alert generation
- FDA report generation capabilities

#### 5. **Global Recalls Monitor** (`presentML/global_recalls_monitor.py`)
- Multi-country recall monitoring
- Text categorization and summarization
- Regulatory authority integration

#### 6. **Streamlit Applications** (`presentML/multi_app_project/`)
- Predictive Analysis Dashboard
- Social Media Monitoring Dashboard
- Image-to-Text OCR Interface
- Global Recalls Interface
- Gemini QA Chatbot Interface

#### 7. **FastAPI AI Service** (`services/ai_service/`) - **MAIN BACKEND**
- FastAPI-based microservice architecture
- Speech-to-Text router (placeholder implementation)
- OCR router (placeholder implementation)
- NLP router (placeholder implementation)
- Medical Terms router (placeholder implementation)

#### 8. **Database Models** (`services/ai_service/models.py`) - **COMPLETE** ✅
- 9 comprehensive database models with proper constraints, relations, and normalization
- User management with role-based access control
- Adverse event reporting with file attachments
- AI processing jobs with status tracking
- Social media alerts with sentiment analysis
- Medical terminology with multi-language support
- Analytics and performance tracking
- API logging for monitoring

### 🔄 PARTIALLY IMPLEMENTED FEATURES
1. **FastAPI Routers** - Basic structure exists but needs implementation
2. **Speech-to-Text** - Router exists but needs Whisper integration
3. **OCR Service** - Router exists but needs PaddleOCR integration
4. **NLP Service** - Router exists but needs model integration
5. **Medical Terms** - Router exists but needs medical knowledge base

### ❌ MISSING COMPONENTS (Based on Project Scope)
1. **Speech-to-Text Implementation** - Router exists but not functional
2. **Multi-language NLP Support** - For Indian languages
3. **Role-Based Access Control** - Admin, Healthcare, Manufacturers, Patients
4. **Social Media Data Mining** - Real-time integration
5. **LLM Development** - Custom models for MvPI data
6. **Comprehensive Dashboard** - Multi-dimensional views
7. **Production Deployment** - Ready for deployment

---

## 🛠️ DEVELOPMENT SETUP

### Quick Start Commands
```bash
# Navigate to AI service directory
cd services/ai_service

# Install FastAPI requirements (already configured)
pip install -r requirements.txt

# Run FastAPI service
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Access API documentation
# Open browser: http://localhost:8000/docs
# Open browser: http://localhost:8000/redoc
```

### FastAPI Service Structure
```
services/ai_service/
├── main.py                 # FastAPI application
├── models.py               # Database models (COMPLETE) ✅
├── requirements.txt        # All dependencies (updated with SQLAlchemy)
├── routers/
│   ├── speech_to_text.py   # Speech recognition API
│   ├── ocr.py             # OCR API
│   ├── nlp.py             # NLP API
│   ├── medical_terms.py   # Medical terms API
│   ├── auth.py            # Authentication API (new)
│   ├── events.py          # Adverse events API (new)
│   ├── social_media.py    # Social media API (new)
│   ├── llm.py             # LLM chatbot API (new)
│   └── analytics.py       # Analytics API (new)
└── tests/                 # Test files
```

### Key API Endpoints
- `POST /api/v1/speech/transcribe` - Speech-to-text
- `POST /api/v1/ocr/extract` - Text extraction
- `POST /api/v1/nlp/analyze` - Text analysis
- `GET /api/v1/medical/terms` - Medical terms
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/events` - Create adverse event
- `POST /api/v1/llm/chat` - LLM chatbot
- `GET /api/v1/analytics/overview` - Analytics data

---

## 📁 KEY FILES TO WORK WITH

### FastAPI Backend (MAIN FOCUS - API-FIRST APPROACH)
- `services/ai_service/main.py` - FastAPI application
- `services/ai_service/models.py` - Database models and schemas ✅
- `services/ai_service/routers/speech_to_text.py` - Speech recognition API
- `services/ai_service/routers/ocr.py` - OCR API
- `services/ai_service/routers/nlp.py` - NLP API
- `services/ai_service/routers/medical_terms.py` - Medical terms API
- `services/ai_service/routers/auth.py` - Authentication API (new)
- `services/ai_service/routers/events.py` - Adverse events API (new)
- `services/ai_service/routers/social_media.py` - Social media API (new)
- `services/ai_service/routers/llm.py` - LLM chatbot API (new)
- `services/ai_service/routers/analytics.py` - Analytics API (new)

### Database & Configuration
- `services/ai_service/requirements.txt` - Dependencies (updated with SQLAlchemy)
- Database models with proper constraints, relations, and normalization ✅

### Existing ML Modules (INTEGRATE INTO API)
- `presentML/adverse_event_predictor.py` - Main ML pipeline ✅
- `presentML/gemini_qa_chatbot.py` - AI chatbot ✅
- `presentML/medical_device_monitor.py` - Social media monitoring ✅
- `presentML/ocr_module.py` - OCR processing ✅
- `presentML/global_recalls_monitor.py` - Recall monitoring ✅

---

## TASKS (No Time Constraints)

### Phase 1: Critical Enhancements (Days 1-4, 12 hours)

#### Task 1.1: Speech-to-Text API Implementation
**Priority:** Critical | **Deadline:** Day 2 | **Estimated Hours:** 4

**Description:** Implement functional speech-to-text API service using OpenAI Whisper.

**Requirements:**
- Implement Whisper model integration in FastAPI router
- Add support for Indian English and major Indian languages
- Create audio processing pipeline with database storage
- Add language detection and translation
- Implement job tracking and status monitoring

**Technical Specifications:**
```python
# Already in requirements.txt:
- openai-whisper==20231117
- soundfile==0.12.1
- pydub==0.25.1
- librosa==0.10.1
- sqlalchemy==2.0.23
```

**API Endpoints to Implement:**
- `POST /api/v1/speech/transcribe` - Upload and transcribe audio
- `GET /api/v1/speech/jobs/{job_id}` - Get processing status
- `GET /api/v1/speech/history` - Get user's transcription history
- `DELETE /api/v1/speech/jobs/{job_id}` - Cancel processing job

**Changes to Existing Files:**
- Implement `services/ai_service/routers/speech_to_text.py` (replace placeholder)
- Add database models for AudioFile and ProcessingJob
- Create audio preprocessing utilities
- Add job tracking and status monitoring

**Deliverables:**
- Functional speech-to-text API endpoints
- Database storage for audio files and transcriptions
- Job tracking and status monitoring
- Multi-language transcription capability

**Acceptance Criteria:**
- Speech recognition working for English and Hindi
- Audio processing time < 30 seconds
- API endpoints responding correctly
- Database storage and retrieval working
- Job status tracking functional

---

#### Speech-to-Text API Implementation (Comprehensive)

**Use Case:**  
*A healthcare worker uploads a patient’s audio report in Hindi or English. The system transcribes it and displays the text for review and further action. Handles noisy audio, unsupported formats, and long files gracefully.*

**Frontend Flow:**  
- User clicks “Upload Audio” and selects a `.wav` or `.mp3` file.
- Frontend calls `POST /api/v1/speech/transcribe`.
- Shows “Processing…” until job is done.
- Displays transcribed text or error.

**API Endpoints:**
- `POST /api/v1/speech/transcribe` — Upload and transcribe audio
- `GET /api/v1/speech/jobs/{job_id}` — Get processing status/result
- `GET /api/v1/speech/history` — Get user’s transcription history
- `DELETE /api/v1/speech/jobs/{job_id}` — Cancel processing job

**Sample Input (Frontend):**
```js
const formData = new FormData();
formData.append('audio_file', file);
await fetch('/api/v1/speech/transcribe', { method: 'POST', body: formData });
```

**Sample API Request (curl):**
```bash
curl -X POST "http://localhost:8000/api/v1/speech/transcribe" \
  -H "Content-Type: multipart/form-data" \
  -F "audio_file=@patient_report_hindi.wav"
```

**Expected Output (Success):**
```json
{
  "job_id": "abc123",
  "status": "processing",
  "message": "Transcription started. Check status at /api/v1/speech/jobs/abc123"
}
```

**Expected Output (Invalid File):**
```json
{
  "detail": "Invalid file type. Please upload a .wav or .mp3 file."
}
```

**Expected Output (Audio Too Long):**
```json
{
  "detail": "Audio file too large or too long. Max 2 minutes allowed."
}
```

**Sample Code (FastAPI, with robust error handling and multiple algorithms):**
```python
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from typing import Optional
import os
import magic  # python-magic for MIME type checking
# import whisper  # OpenAI Whisper
# import speech_recognition as sr  # Alternative: SpeechRecognition + Google API

router = APIRouter(prefix="/api/v1/speech", tags=["Speech-to-Text"])

ALLOWED_EXTENSIONS = {'.wav', '.mp3'}
MAX_FILE_SIZE_MB = 10
MAX_DURATION_SEC = 120

@router.post("/transcribe")
async def transcribe_audio(audio_file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    # Validate file extension
    ext = os.path.splitext(audio_file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .wav or .mp3 file.")
    # Validate file size
    contents = await audio_file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio file too large or too long. Max 2 minutes allowed.")
    # Optionally check duration (requires decoding audio header)
    # ... (code to check duration, raise 413 if too long)
    # Save file
    file_location = f"uploads/{audio_file.filename}"
    with open(file_location, "wb") as f:
        f.write(contents)
    # Create a processing job in DB (pseudo-code)
    job_id = create_processing_job(file_location)
    # Start background transcription
    background_tasks.add_task(process_audio, file_location, job_id)
    return {"job_id": job_id, "status": "processing", "message": f"Transcription started. Check status at /api/v1/speech/jobs/{job_id}"}

# --- Algorithm/model call (multiple options) ---
def process_audio(file_location, job_id):
    try:
        # Option 1: OpenAI Whisper (best for multi-language, noisy audio)
        # model = whisper.load_model("base")
        # result = model.transcribe(file_location)
        # transcription = result["text"]

        # Option 2: SpeechRecognition + Google API (fallback)
        # r = sr.Recognizer()
        # with sr.AudioFile(file_location) as source:
        #     audio = r.record(source)
        # transcription = r.recognize_google(audio, language="en-IN")

        # Save result to DB (pseudo-code)
        save_transcription(job_id, transcription)
    except Exception as e:
        save_transcription_error(job_id, str(e))
# --- End algorithm/model call ---

@router.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    job = get_processing_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    if job.status == "error":
        return {"job_id": job_id, "status": "error", "error": job.error}
    return {"job_id": job_id, "status": job.status, "result": job.result}
```

**Edge Cases & Error Handling:**
- Invalid file type/extension
- File too large or too long
- Corrupted or unreadable audio
- Model/algorithm error (e.g., Whisper or Google API fails)
- Job not found
- User cancels job

**Extensibility:**
- Add more models (e.g., Azure, AWS Transcribe) as needed
- Add language detection and auto-switching
- Store audio/transcription in cloud for scalability

---

#### OCR API Service Implementation (Comprehensive)

**Use Case:**  
*A hospital staff member uploads a scanned prescription or medical report image. The system extracts the text for digital record-keeping and further analysis. Handles blurry images, unsupported formats, and large files gracefully.*

**Frontend Flow:**  
- User clicks “Upload Document” and selects a `.jpg`, `.png`, or `.pdf` file.
- Frontend calls `POST /api/v1/ocr/extract`.
- Shows “Processing…” until job is done.
- Displays extracted text or error.

**API Endpoints:**
- `POST /api/v1/ocr/extract` — Upload and extract text from images
- `GET /api/v1/ocr/jobs/{job_id}` — Get processing status/result
- `GET /api/v1/ocr/history` — Get user’s OCR history
- `DELETE /api/v1/ocr/jobs/{job_id}` — Cancel processing job

**Sample Input (Frontend):**
```js
const formData = new FormData();
formData.append('image_file', file);
await fetch('/api/v1/ocr/extract', { method: 'POST', body: formData });
```

**Sample API Request (curl):**
```bash
curl -X POST "http://localhost:8000/api/v1/ocr/extract" \
  -H "Content-Type: multipart/form-data" \
  -F "image_file=@prescription.jpg"
```

**Expected Output (Success):**
```json
{
  "job_id": "ocr456",
  "status": "processing",
  "message": "OCR started. Check status at /api/v1/ocr/jobs/ocr456"
}
```

**Expected Output (Invalid File):**
```json
{
  "detail": "Invalid file type. Please upload a .jpg, .png, or .pdf file."
}
```

**Expected Output (Image Too Large):**
```json
{
  "detail": "Image file too large. Max 5MB allowed."
}
```

**Sample Code (FastAPI, with robust error handling and multiple algorithms):**
```python
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
import os
import magic
# from paddleocr import PaddleOCR  # PaddleOCR
# import pytesseract  # Tesseract OCR (alternative)

router = APIRouter(prefix="/api/v1/ocr", tags=["OCR"])

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf'}
MAX_FILE_SIZE_MB = 5

@router.post("/extract")
async def extract_text(image_file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    ext = os.path.splitext(image_file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .jpg, .png, or .pdf file.")
    contents = await image_file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image file too large. Max 5MB allowed.")
    # Optionally check image quality (blur, resolution)
    # ... (code to check quality, raise 422 if too blurry)
    file_location = f"uploads/{image_file.filename}"
    with open(file_location, "wb") as f:
        f.write(contents)
    job_id = create_ocr_job(file_location)
    background_tasks.add_task(process_ocr, file_location, job_id)
    return {"job_id": job_id, "status": "processing", "message": f"OCR started. Check status at /api/v1/ocr/jobs/{job_id}"}

# --- Algorithm/model call (multiple options) ---
def process_ocr(file_location, job_id):
    try:
        # Option 1: PaddleOCR (best for multi-language, medical docs)
        # ocr_model = PaddleOCR()
        # result = ocr_model.ocr(file_location)
        # extracted_text = result[0][1][0] if result else ""

        # Option 2: Tesseract (fallback, open-source)
        # extracted_text = pytesseract.image_to_string(file_location)

        save_ocr_result(job_id, extracted_text)
    except Exception as e:
        save_ocr_error(job_id, str(e))
# --- End algorithm/model call ---

@router.get("/jobs/{job_id}")
async def get_ocr_job_status(job_id: str):
    job = get_ocr_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    if job.status == "error":
        return {"job_id": job_id, "status": "error", "error": job.error}
    return {"job_id": job_id, "status": job.status, "result": job.result}
```

**Edge Cases & Error Handling:**
- Invalid file type/extension
- File too large
- Blurry or low-quality image
- Model/algorithm error (PaddleOCR/Tesseract fails)
- Job not found
- User cancels job

**Extensibility:**
- Add more OCR engines (Google Vision, AWS Textract)
- Add pre-processing (deskew, denoise, contrast enhance)
- Store images/results in cloud for scalability

---

#### NLP API Service Implementation (Comprehensive)

**Use Case:**  
*A regulatory reviewer pastes a medical device incident description. The system classifies the event, extracts medical entities, and analyzes sentiment for risk assessment. Handles empty, unsupported, or ambiguous text gracefully.*

**Frontend Flow:**  
- User enters or pastes text into a form (e.g., "Describe the adverse event").
- Frontend calls `POST /api/v1/nlp/analyze` (or `/classify`, `/entities`, `/sentiment` as needed).
- Shows “Analyzing…” until job is done.
- Displays classification, entities, and sentiment results or error.

**API Endpoints:**
- `POST /api/v1/nlp/analyze` — Analyze medical text (all-in-one)
- `POST /api/v1/nlp/classify` — Classify adverse events
- `POST /api/v1/nlp/entities` — Extract medical entities
- `POST /api/v1/nlp/sentiment` — Analyze sentiment
- `GET /api/v1/nlp/jobs/{job_id}` — Get processing status/result
- `GET /api/v1/nlp/history` — Get analysis history

**Sample Input (Frontend):**
```js
const response = await fetch('/api/v1/nlp/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Patient experienced device malfunction and fever.' })
});
```

**Sample API Request (curl):**
```bash
curl -X POST "http://localhost:8000/api/v1/nlp/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "Patient experienced device malfunction and fever."}'
```

**Expected Output (Success):**
```json
{
  "job_id": "nlp789",
  "status": "processing",
  "message": "NLP analysis started. Check status at /api/v1/nlp/jobs/nlp789"
}
```

**Expected Output (Empty Text):**
```json
{
  "detail": "Please enter a valid description."
}
```

**Expected Output (Unsupported Language):**
```json
{
  "detail": "Language not supported for analysis."
}
```

**Sample Code (FastAPI, with robust error handling and multiple algorithms):**
```python
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
# from transformers import pipeline  # HuggingFace Transformers
# import spacy  # spaCy for NER
# import nltk  # NLTK for sentiment

router = APIRouter(prefix="/api/v1/nlp", tags=["NLP"])

SUPPORTED_LANGUAGES = {"en", "hi"}

class TextInput(BaseModel):
    text: str
    language: Optional[str] = "en"

@router.post("/analyze")
async def analyze_text(input: TextInput, background_tasks: BackgroundTasks = None):
    if not input.text or len(input.text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Please enter a valid description.")
    if input.language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=422, detail="Language not supported for analysis.")
    job_id = create_nlp_job(input.text, input.language)
    background_tasks.add_task(process_nlp, input.text, input.language, job_id)
    return {"job_id": job_id, "status": "processing", "message": f"NLP analysis started. Check status at /api/v1/nlp/jobs/{job_id}"}

# --- Algorithm/model call (multiple options) ---
def process_nlp(text, language, job_id):
    try:
        # Option 1: Transformers for classification
        # classifier = pipeline('text-classification', model='distilbert-base-uncased')
        # classification = classifier(text)[0]['label']

        # Option 2: spaCy for NER
        # nlp = spacy.load('en_core_web_sm')
        # doc = nlp(text)
        # entities = [ent.text for ent in doc.ents]

        # Option 3: NLTK for sentiment
        # from nltk.sentiment import SentimentIntensityAnalyzer
        # sia = SentimentIntensityAnalyzer()
        # sentiment = sia.polarity_scores(text)['compound']

        # Save result to DB (pseudo-code)
        save_nlp_result(job_id, {
            "classification": classification,
            "entities": entities,
            "sentiment": sentiment
        })
    except Exception as e:
        save_nlp_error(job_id, str(e))
# --- End algorithm/model call ---

@router.get("/jobs/{job_id}")
async def get_nlp_job_status(job_id: str):
    job = get_nlp_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    if job.status == "error":
        return {"job_id": job_id, "status": "error", "error": job.error}
    return {"job_id": job_id, "status": job.status, "result": job.result}
```

**Edge Cases & Error Handling:**
- Empty or too short text
- Unsupported language
- Model/algorithm error (Transformers, spaCy, NLTK fails)
- Job not found
- User cancels job

**Extensibility:**
- Add more models (custom medical NER, multilingual support)
- Add advanced pre-processing (spellcheck, translation)
- Store results in cloud for analytics

---

### Phase 2: Core Features (Days 5-7, 9 hours)

#### Task 2.1: Medical Terms API Service Implementation
**Priority:** High | **Deadline:** Day 5 | **Estimated Hours:** 3

**Description:** Implement medical terms API service with MvPI-specific knowledge base.

**Requirements:**
- Create medical device terminology database
- Implement medical term extraction and validation
- Add MvPI-specific medical knowledge
- Create medical term classification
- Implement database storage and retrieval

**API Endpoints to Implement:**
- `GET /api/v1/medical/terms` - Get medical terms
- `POST /api/v1/medical/terms/search` - Search medical terms
- `POST /api/v1/medical/terms/classify` - Classify medical terms
- `GET /api/v1/medical/devices` - Get device categories
- `POST /api/v1/medical/devices/classify` - Classify medical devices

**Changes to Existing Files:**
- Implement `services/ai_service/routers/medical_terms.py` (replace placeholder)
- Add database models for MedicalTerm
- Create medical terms database with MvPI data
- Add medical device classification logic

**Deliverables:**
- Medical terms API endpoints
- Database storage for medical terminology
- MvPI medical knowledge base integration
- Medical device classification system

**Acceptance Criteria:**
- Medical terms extraction working
- MvPI knowledge base integrated
- Classification accuracy > 90%
- Database storage and retrieval working

---

#### Medical Terms API Service Implementation (Comprehensive)

**Use Case:**  
*A user searches for medical device terms, validates terminology, or classifies a device. The system supports typo-tolerance, synonyms, and MvPI-specific knowledge. Handles invalid queries, ambiguous terms, and unsupported categories.*

**Frontend Flow:**  
- User enters a term or selects a device category.
- Frontend calls `GET /api/v1/medical/terms` or `POST /api/v1/medical/terms/search`.
- Shows results, suggestions, or error messages.

**API Endpoints:**
- `GET /api/v1/medical/terms` — List all medical terms
- `POST /api/v1/medical/terms/search` — Search for a term (fuzzy, typo-tolerant)
- `POST /api/v1/medical/terms/classify` — Classify a term
- `GET /api/v1/medical/devices` — List device categories
- `POST /api/v1/medical/devices/classify` — Classify a device

**Sample Input (Frontend):**
```js
const response = await fetch('/api/v1/medical/terms/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'pacemakr' }) // typo intended
});
```

**Sample API Request (curl):**
```bash
curl -X POST "http://localhost:8000/api/v1/medical/terms/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "pacemakr"}'
```

**Expected Output (Success, Fuzzy Match):**
```json
{
  "matches": [
    { "term": "pacemaker", "synonyms": ["cardiac pacemaker"], "category": "device" }
  ],
  "suggestions": ["pacemaker"]
}
```

**Expected Output (No Match):**
```json
{
  "matches": [],
  "suggestions": ["Did you mean: pacemaker?"]
}
```

**Sample Code (FastAPI, robust error handling, multiple algorithms):**
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
# from fuzzywuzzy import process as fuzzy_process  # Fuzzy matching
# import difflib  # Alternative for close matches

router = APIRouter(prefix="/api/v1/medical", tags=["Medical Terms"])

class SearchRequest(BaseModel):
    query: str

class ClassifyRequest(BaseModel):
    term: str

@router.get("/terms")
async def get_terms():
    # Fetch all terms from DB (pseudo-code)
    terms = get_all_medical_terms()
    return {"terms": terms}

@router.post("/terms/search")
async def search_terms(request: SearchRequest):
    if not request.query or len(request.query.strip()) < 2:
        raise HTTPException(status_code=400, detail="Please enter a valid search term.")
    # Option 1: FuzzyWuzzy for typo-tolerance
    # matches = fuzzy_process.extract(request.query, get_all_term_names(), limit=5)
    # Option 2: difflib for close matches
    # matches = difflib.get_close_matches(request.query, get_all_term_names(), n=5)
    # Option 3: Exact match fallback
    # matches = [t for t in get_all_term_names() if t == request.query]
    if not matches:
        return {"matches": [], "suggestions": [f"Did you mean: {suggested_term}?"]}
    # Fetch full term info for matches
    results = [get_term_info(m) for m in matches]
    return {"matches": results, "suggestions": [m for m in matches]}

@router.post("/terms/classify")
async def classify_term(request: ClassifyRequest):
    if not request.term or len(request.term.strip()) < 2:
        raise HTTPException(status_code=400, detail="Please enter a valid term to classify.")
    # Option 1: Rule-based classification
    # category = classify_by_rules(request.term)
    # Option 2: ML model (if available)
    # category = ml_model.predict(request.term)
    if not category:
        raise HTTPException(status_code=404, detail="Term could not be classified.")
    return {"term": request.term, "category": category}

@router.get("/devices")
async def get_devices():
    # Fetch all device categories from DB
    categories = get_all_device_categories()
    return {"categories": categories}

@router.post("/devices/classify")
async def classify_device(request: ClassifyRequest):
    # Similar logic as classify_term
    # ...
    return {"device": request.term, "category": "device_category_here"}
```

**Edge Cases & Error Handling:**
- Empty or too short query/term
- No matches found (suggest alternatives)
- Ambiguous term (return all possible matches)
- Term not in knowledge base
- DB or model error

**Extensibility:**
- Add synonym/ontology expansion (UMLS, SNOMED)
- Integrate with external medical term APIs
- Add ML-based classification for new device types

---

#### Task 2.2: Authentication & Authorization API
**Priority:** High | **Deadline:** Day 6 | **Estimated Hours:** 3

**Description:** Implement authentication and authorization API for FastAPI services.

**Requirements:**
- Create user authentication system with database storage
- Implement role-based permissions
- Add JWT token authentication
- Create user management endpoints
- Implement user registration and profile management

**Technical Specifications:**
```python
# Already in requirements.txt:
- python-jose[cryptography]==3.3.0
- passlib[bcrypt]==1.7.4
- sqlalchemy==2.0.23
```

**API Endpoints to Implement:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `GET /api/v1/auth/users` - List users (admin only)
- `PUT /api/v1/auth/users/{user_id}/roles` - Update user roles (admin only)

**Changes to Existing Files:**
- Add authentication middleware to `services/ai_service/main.py`
- Create `services/ai_service/routers/auth.py` (new file)
- Add database models for User and Role
- Add role-based permission decorators

**Deliverables:**
- User authentication API endpoints
- Database storage for users and roles
- Role-based API access control
- User management endpoints

**Acceptance Criteria:**
- 4 user roles implemented (Admin, Healthcare, Manufacturer, Patient)
- JWT authentication working
- Role-based endpoint access
- Database storage and retrieval working

---

#### Task 2.3: Adverse Event Reporting API
**Priority:** High | **Deadline:** Day 7 | **Estimated Hours:** 3

**Description:** Implement comprehensive adverse event reporting API.

**Requirements:**
- Create adverse event reporting endpoints
- Implement file upload and processing
- Add AI-powered event classification
- Create event status tracking
- Implement search and filtering

**API Endpoints to Implement:**
- `POST /api/v1/events` - Create adverse event report
- `GET /api/v1/events` - List adverse events (with filtering)
- `GET /api/v1/events/{event_id}` - Get event details
- `PUT /api/v1/events/{event_id}` - Update event
- `POST /api/v1/events/{event_id}/files` - Upload files to event
- `GET /api/v1/events/{event_id}/files` - Get event files
- `POST /api/v1/events/{event_id}/classify` - AI classification
- `GET /api/v1/events/analytics` - Get event analytics

**Changes to Existing Files:**
- Create `services/ai_service/routers/events.py` (new file)
- Add database models for AdverseEvent
- Integrate with existing AI services
- Add file upload and processing logic

**Deliverables:**
- Adverse event reporting API endpoints
- Database storage for events and files
- AI-powered event classification
- File upload and processing system

**Acceptance Criteria:**
- Event reporting working
- File upload and processing functional
- AI classification integrated
- Database storage and retrieval working

---

### Phase 3: Integration & Deployment (Days 8-11, 12 hours)

#### Task 3.1: Social Media Monitoring API
**Priority:** Critical | **Deadline:** Day 9 | **Estimated Hours:** 4

**Description:** Implement social media monitoring API with real-time processing.

**Requirements:**
- Create social media monitoring endpoints
- Add real-time data processing
- Implement automated alert generation
- Create sentiment analysis and entity extraction
- Implement database storage for alerts

**API Endpoints to Implement:**
- `GET /api/v1/social/alerts` - Get social media alerts
- `POST /api/v1/social/monitor` - Start monitoring keywords
- `GET /api/v1/social/analytics` - Get social media analytics
- `POST /api/v1/social/process` - Process social media content
- `GET /api/v1/social/sentiment` - Get sentiment analysis
- `PUT /api/v1/social/alerts/{alert_id}/process` - Mark alert as processed

**Changes to Existing Files:**
- Create `services/ai_service/routers/social_media.py` (new file)
- Add database models for SocialMediaAlert
- Integrate with existing social media monitoring
- Add real-time data processing logic

**Deliverables:**
- Social media monitoring API endpoints
- Database storage for alerts and analytics
- Real-time data processing
- Automated alert system

**Acceptance Criteria:**
- Real-time social media data collection
- Automated adverse event detection
- Database storage and retrieval working
- Alert processing system functional

---

#### Task 3.2: LLM Chatbot API
**Priority:** Critical | **Deadline:** Day 10 | **Estimated Hours:** 4

**Description:** Implement LLM chatbot API with MvPI-specific knowledge.

**Requirements:**
- Create LLM chatbot endpoints
- Add MvPI-specific knowledge base
- Implement conversation management
- Create medical device expertise system
- Add database storage for conversations

**API Endpoints to Implement:**
- `POST /api/v1/llm/chat` - Send message to chatbot
- `GET /api/v1/llm/conversations` - Get user conversations
- `GET /api/v1/llm/conversations/{conversation_id}` - Get conversation history
- `DELETE /api/v1/llm/conversations/{conversation_id}` - Delete conversation
- `POST /api/v1/llm/export` - Export conversation
- `GET /api/v1/llm/knowledge` - Get medical knowledge base

**Changes to Existing Files:**
- Create `services/ai_service/routers/llm.py` (new file)
- Add database models for conversations
- Integrate with existing Gemini chatbot
- Add MvPI knowledge base integration

**Deliverables:**
- LLM chatbot API endpoints
- Database storage for conversations
- MvPI knowledge integration
- Medical device expertise system

**Acceptance Criteria:**
- LLM endpoints working
- Medical device knowledge integrated
- Response accuracy > 90%
- Database storage and retrieval working

---

#### Task 3.3: Analytics & Dashboard API
**Priority:** High | **Deadline:** Day 11 | **Estimated Hours:** 4

**Description:** Implement analytics and dashboard API for comprehensive reporting.

**Requirements:**
- Create analytics endpoints for data visualization
- Implement dashboard data aggregation
- Add performance monitoring
- Create reporting endpoints
- Implement caching for performance

**API Endpoints to Implement:**
- `GET /api/v1/analytics/overview` - Get system overview
- `GET /api/v1/analytics/events` - Get event analytics
- `GET /api/v1/analytics/devices` - Get device analytics
- `GET /api/v1/analytics/social` - Get social media analytics
- `GET /api/v1/analytics/performance` - Get model performance
- `GET /api/v1/analytics/trends` - Get trend analysis
- `GET /api/v1/dashboard/data` - Get dashboard data
- `POST /api/v1/reports/generate` - Generate reports

**Changes to Existing Files:**
- Create `services/ai_service/routers/analytics.py` (new file)
- Add database models for analytics
- Implement data aggregation logic
- Add caching and performance optimization

**Deliverables:**
- Analytics API endpoints
- Dashboard data endpoints
- Performance monitoring
- Reporting system

**Acceptance Criteria:**
- Analytics endpoints working
- Dashboard data aggregation functional
- Performance monitoring active
- Reporting system operational

---

## 🎯 DAILY MILESTONES CHECKLIST

### Day 1-2: Speech-to-Text Foundation
- [ ] Whisper model integration in FastAPI
- [ ] Audio file upload and processing
- [ ] Multi-language transcription
- [ ] API endpoint testing
- [ ] Database storage implementation

### Day 3: OCR Service
- [ ] PaddleOCR integration in FastAPI
- [ ] Medical document processing
- [ ] Text extraction validation
- [ ] API endpoint testing
- [ ] Database storage implementation

### Day 4: NLP Service
- [ ] Medical text classification
- [ ] Entity recognition pipeline
- [ ] Multi-language support
- [ ] API endpoint testing
- [ ] Database storage implementation

### Day 5: Medical Terms Service
- [ ] Medical terms database creation
- [ ] MvPI knowledge base integration
- [ ] Medical device classification
- [ ] API endpoint testing
- [ ] Database storage implementation

### Day 6: Authentication & Roles
- [ ] JWT authentication implementation
- [ ] Role-based permissions
- [ ] User management endpoints
- [ ] 4 user roles (Admin, Healthcare, Manufacturer, Patient)
- [ ] Database storage implementation

### Day 7: Adverse Event Reporting
- [ ] Event reporting API implementation
- [ ] File upload and processing
- [ ] AI classification integration
- [ ] Database storage implementation
- [ ] End-to-end testing

### Day 8-9: Social Media Integration
- [ ] Social media router in FastAPI
- [ ] Real-time data processing
- [ ] Automated alert generation
- [ ] API endpoints for social data
- [ ] Database storage implementation

### Day 10: LLM Enhancement
- [ ] LLM router in FastAPI
- [ ] Gemini chatbot integration
- [ ] Medical device knowledge
- [ ] Response accuracy improvement
- [ ] Database storage implementation

### Day 11: Analytics & Documentation
- [ ] Analytics API implementation
- [ ] Dashboard data aggregation
- [ ] Performance monitoring
- [ ] API documentation generation
- [ ] Demo presentation preparation

---

## 🔧 QUICK COMMANDS & TESTING

### Running FastAPI Services
```bash
# Start FastAPI service
cd services/ai_service
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Access API documentation
# Open browser: http://localhost:8000/docs
# Open browser: http://localhost:8000/redoc
```

### Testing FastAPI Endpoints
```bash
# Test speech-to-text
curl -X POST "http://localhost:8000/api/v1/speech/transcribe" \
  -H "Content-Type: multipart/form-data" \
  -F "audio_file=@test_audio.wav"

# Test OCR
curl -X POST "http://localhost:8000/api/v1/ocr/extract" \
  -H "Content-Type: multipart/form-data" \
  -F "image_file=@test_image.jpg"

# Test NLP
curl -X POST "http://localhost:8000/api/v1/nlp/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "Medical device malfunction"}'

# Test authentication
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "test123"}'

# Test adverse event creation
curl -X POST "http://localhost:8000/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Device malfunction", "description": "Test event", "severity": "moderate"}'

# Test LLM chatbot
curl -X POST "http://localhost:8000/api/v1/llm/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "What are the symptoms of device malfunction?"}'

# Test analytics
curl -X GET "http://localhost:8000/api/v1/analytics/overview" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📞 SUPPORT RESOURCES

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- [MvPI Official Documentation](https://cdsco.gov.in/opencms/opencms/en/consumer/Product-Recall/)

### Key Contacts
- **Project Manager:** [Contact for daily progress updates]
- **Technical Lead:** [Contact for technical guidance]

---

## ⚠️ IMPORTANT NOTES

1. **Focus on FastAPI:** All backend work should be in `services/ai_service/`
2. **Use Existing Dependencies:** All ML libraries are already in requirements.txt
3. **API-First Approach:** Implement FastAPI endpoints first, then integrate frontend
4. **Database Integration:** Use the complete models.py for all data storage
5. **Daily Progress:** Test each service daily
6. **Demo Ready:** Ensure FastAPI services work for presentation

---

## 🎉 FINAL SUCCESS CHECKLIST (Day 11)

- [ ] All 9 FastAPI routers functional:
  - [ ] Speech-to-Text API (`/api/v1/speech/*`)
  - [ ] OCR API (`/api/v1/ocr/*`)
  - [ ] NLP API (`/api/v1/nlp/*`)
  - [ ] Medical Terms API (`/api/v1/medical/*`)
  - [ ] Authentication API (`/api/v1/auth/*`)
  - [ ] Adverse Events API (`/api/v1/events/*`)
  - [ ] Social Media API (`/api/v1/social/*`)
  - [ ] LLM Chatbot API (`/api/v1/llm/*`)
  - [ ] Analytics API (`/api/v1/analytics/*`)

- [ ] Database models implemented with proper constraints and relations
- [ ] Speech recognition working for English and Hindi
- [ ] OCR working for medical documents
- [ ] NLP classification and entity recognition working
- [ ] Medical terms service with MvPI knowledge base
- [ ] 4 user roles with JWT authentication
- [ ] Adverse event reporting system functional
- [ ] Social media monitoring integrated
- [ ] LLM chatbot with medical expertise
- [ ] Analytics and dashboard data endpoints
- [ ] All API endpoints documented and tested
- [ ] Database storage and retrieval working
- [ ] Job tracking and status monitoring functional
- [ ] Demo presentation prepared with API testing

---

## 🚨 CRITICAL SUCCESS FACTORS

1. **Start with FastAPI:** Begin Task 1.1 in `services/ai_service/`
2. **Daily Testing:** Test each FastAPI endpoint daily
3. **API Documentation:** Use FastAPI's auto-generated docs
4. **Database Integration:** Use the complete models.py for all data storage
5. **Demo Preparation:** Ready for presentation on Day 11

---

## 📊 TIMELINE SUMMARY

| Phase | Days | Key Deliverables | Hours |
|-------|------|------------------|-------|
| Phase 1 | Days 1-4 | FastAPI service implementation | 12 |
| Phase 2 | Days 5-7 | Core features and integration | 9 |
| Phase 3 | Days 8-11 | Advanced features and deployment | 12 |

**Total Duration:** 11 days
**Total Hours:** 33 hours
**Developer:** 1 person, 3 hours/day

---

## 🎯 NEXT STEPS

1. **Immediate Start:** Begin with Task 1.1 (Speech-to-Text API Implementation)
2. **Daily Progress Review:** Check completion of daily tasks
3. **Focus on FastAPI:** Ensure all services are properly implemented
4. **Database Integration:** Use the complete models.py for all data storage
5. **Prepare for Demo:** Ready for presentation on Day 11

---

## 🔍 DATABASE ARCHITECTURE OVERVIEW

### Complete Database Models (models.py) ✅
- **User Management:** User, Role, UserRole (RBAC)
- **Adverse Events:** AdverseEvent, AudioFile, ImageFile
- **AI Processing:** ProcessingJob, ModelPerformance
- **Medical Knowledge:** MedicalTerm
- **Social Media:** SocialMediaAlert
- **Analytics:** APILog

### Key Features:
- **Proper Normalization:** 3NF database design
- **Foreign Key Relationships:** Data integrity
- **Indexes:** Performance optimization
- **JSON Fields:** Flexible data storage
- **Enum Constraints:** Data validation
- **Audit Trails:** Timestamps and tracking

---

*This comprehensive guide focuses on implementing the existing FastAPI service structure with complete database integration for the Medical Device Adverse Event Reporting System.* 