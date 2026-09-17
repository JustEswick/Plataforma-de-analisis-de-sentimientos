import re

# Patrones básicos de PII mencionados explícitamente en el PDF
_EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
_CREDIT_CARD_PATTERN = re.compile(r"\b(?:\d[ -]*?){13,16}\b")
_PHONE_PATTERN = re.compile(r"\b\d{10}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b")

def mask_pii(raw_text: str) -> str:
    """Aplica un filtrado básico para anonimizar PII."""
    masked = _EMAIL_PATTERN.sub("[EMAIL_REDACTED]", raw_text)
    masked = _CREDIT_CARD_PATTERN.sub("[CARD_REDACTED]", masked)
    masked = _PHONE_PATTERN.sub("[PHONE_REDACTED]", masked)
    return masked