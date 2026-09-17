from datetime import datetime, timezone
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, field_validator

class ReviewCreate(BaseModel):
    """
    Payload de entrada (RF-02): lo que el User Frontend envía cuando
    un cliente somete una reseña. Este es el primer punto de Fail-Fast.
    """
    product_id: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Identificador del producto reseñado (product_id del catálogo).",
    )
    customer_id: str | None = Field(
        default=None,
        max_length=64,
        description="Identificador del cliente. Opcional si la reseña es anónima.",
    )
    raw_text: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="Texto plano de la reseña, tal como lo escribió el cliente.",
    )
    rating: int = Field(
        ...,
        ge=1,
        le=5,
        description="Calificación numérica de 1 a 5 estrellas.",
    )

    @field_validator("raw_text")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        """
        Fail-Fast adicional: Pydantic ya exige min_length=3, pero un texto
        como '   ' pasaría. Lo rechazamos aquí explícitamente.
        """
        if not value.strip():
            raise ValueError("raw_text no puede estar vacío o contener solo espacios.")
        return value.strip()

    @field_validator("product_id", "customer_id")
    @classmethod
    def reject_blank_ids(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("El identificador no puede ser una cadena vacía.")
        return value

class ReviewAccepted(BaseModel):
    """
    Respuesta de salida (NFR-02): confirma que la reseña fue validada y
    aceptada para procesamiento asíncrono.
    """
    review_id: UUID = Field(default_factory=uuid4)
    status: str = Field(default="accepted")
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))