from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import logging
from typing import Optional
import os
import tempfile

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...), language: Optional[str] = "auto"
):
    """
    Transcribe audio file to text using OpenAI Whisper.

    Args:
        audio_file: Audio file to transcribe
        language: Language code (auto for auto-detection)

    Returns:
        JSON with transcribed text and metadata
    """
    try:
        # Validate file type
        if not audio_file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be an audio file")

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            content = await audio_file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name

        # TODO: Implement Whisper transcription
        # For now, return placeholder response
        transcribed_text = (
            "This is a placeholder transcription. Implement Whisper model here."
        )

        # Clean up temporary file
        os.unlink(tmp_file_path)

        return JSONResponse(
            {
                "success": True,
                "transcribed_text": transcribed_text,
                "language": language,
                "file_name": audio_file.filename,
                "file_size": len(content),
            }
        )

    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail="Transcription failed")


@router.post("/transcribe-url")
async def transcribe_from_url(audio_url: str, language: Optional[str] = "auto"):
    """
    Transcribe audio from URL.

    Args:
        audio_url: URL of the audio file
        language: Language code (auto for auto-detection)

    Returns:
        JSON with transcribed text and metadata
    """
    try:
        # TODO: Download audio from URL and transcribe
        # For now, return placeholder
        transcribed_text = "This is a placeholder transcription from URL."

        return JSONResponse(
            {
                "success": True,
                "transcribed_text": transcribed_text,
                "language": language,
                "audio_url": audio_url,
            }
        )

    except Exception as e:
        logger.error(f"URL transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail="Transcription from URL failed")


@router.get("/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages for transcription.

    Returns:
        JSON with supported language codes and names
    """
    languages = [
        {"code": "en", "name": "English"},
        {"code": "hi", "name": "Hindi"},
        {"code": "ta", "name": "Tamil"},
        {"code": "te", "name": "Telugu"},
        {"code": "bn", "name": "Bengali"},
        {"code": "mr", "name": "Marathi"},
        {"code": "gu", "name": "Gujarati"},
        {"code": "kn", "name": "Kannada"},
        {"code": "ml", "name": "Malayalam"},
        {"code": "pa", "name": "Punjabi"},
        {"code": "ur", "name": "Urdu"},
        {"code": "auto", "name": "Auto-detect"},
    ]

    return JSONResponse({"success": True, "languages": languages})
