from pydantic import BaseModel

class ReviewFeatures(BaseModel):
    masked_text: str
    text_length: int
    language: str

def extract_features(masked_text: str) -> ReviewFeatures:
    """Feature Engineering sobre el texto YA sanitizado."""
    text_length = len(masked_text)
    language = _detect_language_placeholder(masked_text)
    return ReviewFeatures(
        masked_text=masked_text,
        text_length=text_length,
        language=language,
    )

def _detect_language_placeholder(text: str) -> str:
    # Placeholder intencional
    return "es" if text else "unknown"