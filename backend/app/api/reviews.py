from datetime import datetime, timezone
from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from app.core.event_publisher import IEventPublisher, MockEventPublisher
from app.schemas.review import ReviewAccepted, ReviewCreate
from app.services.feature_engineering import extract_features
from app.services.pii_masking import mask_pii

router = APIRouter(prefix="/reviews", tags=["Reviews"])

def get_event_publisher() -> IEventPublisher:
    """Punto único de inyección de dependencias."""
    return MockEventPublisher()

async def _publish_review_ready(
    publisher: IEventPublisher,
    review_id: str,
    product_id: str,
    customer_id: str | None,
    rating: int,
    masked_text: str,
    text_length: int,
    language: str,
) -> None:
    """Tarea en background para armar y publicar el evento (NFR-02)."""
    payload = {
        "review_id": review_id,
        "product_id": product_id,
        "customer_id": customer_id,
        "rating": rating,
        "masked_text": masked_text,
        "text_length": text_length,
        "language": language,
        "event_timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await publisher.publish(event_name="Review_Ready", payload=payload)

@router.post(
    "",
    response_model=ReviewAccepted,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Recibe y valida una reseña (RF-06), publica evento Review_Ready (RF-07)",
)
async def submit_review(
    review: ReviewCreate,
    background_tasks: BackgroundTasks,
    publisher: IEventPublisher = Depends(get_event_publisher),
) -> ReviewAccepted:
    accepted = ReviewAccepted()
    masked_text = mask_pii(review.raw_text)
    features = extract_features(masked_text)
    
    background_tasks.add_task(
        _publish_review_ready,
        publisher,
        str(accepted.review_id),
        review.product_id,
        review.customer_id,
        review.rating,
        features.masked_text,
        features.text_length,
        features.language,
    )
    return accepted

# Almacenamiento en memoria para resultados procesados por n8n (Módulo de IA)
ANALYZED_REVIEWS: list[dict] = []
 
@router.post(
    "/analyzed",
    status_code=status.HTTP_200_OK,
    summary="Recibe el resultado del análisis de sentimientos emitido por n8n (AI Interface Service)",
)
async def receive_analyzed_review(request: Request) -> dict:
    """
    Callback que recibe el resultado de n8n (nodo Backend Output)
    con campos: review_id, producto_id, sentimiento, puntaje, confianza, temas, rating, status.
    """
    payload = await request.json()
    ANALYZED_REVIEWS.append(payload)
    return payload

@router.get(
    "/analyzed",
    status_code=status.HTTP_200_OK,
    summary="Consulta las reseñas analizadas por la IA",
)
async def get_analyzed_reviews() -> list[dict]:
    """Retorna las reseñas analizadas que han llegado desde n8n."""
    return ANALYZED_REVIEWS
