from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from datetime import datetime

# Import routers
from routers import speech_to_text, ocr, nlp, medical_terms

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Rakshaayan AI Service",
    description="AI-powered medical device adverse event reporting platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    speech_to_text.router, prefix="/api/v1/speech", tags=["Speech-to-Text"]
)
app.include_router(ocr.router, prefix="/api/v1/ocr", tags=["OCR"])
app.include_router(nlp.router, prefix="/api/v1/nlp", tags=["NLP"])
app.include_router(
    medical_terms.router, prefix="/api/v1/medical", tags=["Medical Terms"]
)


@app.get("/")
async def root():
    """Root endpoint with service information."""
    return {
        "service": "Rakshaayan AI Service",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "speech_to_text": "/api/v1/speech",
            "ocr": "/api/v1/ocr",
            "nlp": "/api/v1/nlp",
            "medical_terms": "/api/v1/medical",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Add health checks for ML models here
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "models": {"speech_to_text": "loaded", "ocr": "loaded", "nlp": "loaded"},
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unhealthy")


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
