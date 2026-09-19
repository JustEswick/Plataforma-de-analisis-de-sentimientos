from datetime import datetime, timezone
from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from app.core.event_publisher import RabbitMQEventPublisher, IEventPublisher
from app.schemas.review import ReviewAccepted, ReviewCreate
from app.services.feature_engineering import extract_features
from app.services.pii_masking import mask_pii

router = APIRouter(prefix="/reviews", tags=["Reviews"])

def get_event_publisher() -> IEventPublisher:
    """Punto único de inyección de dependencias."""
    return RabbitMQEventPublisher()

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

from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.review import SentimentFeature, RawReview

ANALYZED_REVIEWS: list[dict] = []

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
    db: AsyncSession = Depends(get_db),
) -> ReviewAccepted:
    accepted = ReviewAccepted()
    masked_text = mask_pii(review.raw_text)
    features = extract_features(masked_text)
    
    # Persistir reseña en base de datos PostgreSQL (raw_reviews)
    try:
        try:
            prod_id = int(review.product_id)
        except (ValueError, TypeError):
            prod_id = 1

        raw_review = RawReview(
            review_id=str(accepted.review_id),
            product_id=prod_id,
            customer_id=review.customer_id if (review.customer_id and len(review.customer_id) == 36) else None,
            raw_text=review.raw_text,
            rating=review.rating,
            sentiment_label=None,
        )
        db.add(raw_review)
        await db.commit()
    except Exception as e:
        await db.rollback()
    
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

@router.post(
    "/analyzed",
    status_code=status.HTTP_200_OK,
    summary="Recibe el resultado del análisis de sentimientos emitido por n8n (AI Interface Service)",
)
async def receive_analyzed_review(request: Request, db: AsyncSession = Depends(get_db)) -> dict:
    """
    Callback que recibe el resultado de n8n (nodo Backend Output)
    con campos: review_id, producto_id, sentimiento, puntaje, confianza, temas, rating, status.
    Guarda en la base de datos (PostgreSQL).
    """
    import json
    import uuid as uuid_pkg

    payload = await request.json()
    
    try:
        try:
            prod_id = int(payload.get("producto_id", 1))
        except (ValueError, TypeError):
            prod_id = 1

        rev_id_str = payload.get("review_id")
        try:
            rev_id_uuid = uuid_pkg.UUID(str(rev_id_str))
        except Exception:
            rev_id_uuid = uuid_pkg.uuid4()

        score = float(payload.get("puntaje", 0.5))
        score = max(0.0, min(1.0, score))

        topics = payload.get("temas", [])
        if isinstance(topics, str):
            try:
                topics = json.loads(topics)
            except Exception:
                topics = [topics]

        label = str(payload.get("sentimiento", "Neutral")).capitalize()
        if label not in ["Positive", "Negative", "Neutral"]:
            label = "Neutral"

        # Buscar reseña cruda para enriquecer texto
        try:
            rr_res = await db.execute(select(RawReview).where(RawReview.review_id == rev_id_uuid))
            rr = rr_res.scalar_one_or_none()
            if rr:
                payload["masked_text"] = rr.masked_text or rr.raw_text
                payload["rating"] = rr.rating
        except Exception:
            pass

        feature = SentimentFeature(
            review_id=rev_id_uuid,
            product_id=prod_id,
            sentiment_label=label,
            sentiment_score=score,
            extracted_topics=topics,
        )
        db.add(feature)
        await db.commit()
    except Exception as e:
        await db.rollback()
    
    ANALYZED_REVIEWS.append(payload)
    return payload

@router.get(
    "/analyzed",
    status_code=status.HTTP_200_OK,
    summary="Consulta las reseñas analizadas por la IA",
)
async def get_analyzed_reviews(db: AsyncSession = Depends(get_db)) -> list[dict]:
    """Retorna las reseñas analizadas consultando la base de datos con fallback en memoria."""
    try:
        stmt = select(SentimentFeature, RawReview).join(
            RawReview, SentimentFeature.review_id == RawReview.review_id, isouter=True
        )
        result = await db.execute(stmt)
        rows = result.all()
        if rows:
            return [
                {
                    "review_id": str(f.review_id),
                    "producto_id": f.product_id,
                    "sentimiento": f.sentiment_label,
                    "puntaje": float(f.sentiment_score),
                    "temas": f.extracted_topics,
                    "rating": r.rating if r else 3,
                    "masked_text": r.masked_text if (r and r.masked_text) else (r.raw_text if r else "Reseña procesada por IA"),
                    "customer_id": str(r.customer_id) if (r and r.customer_id) else None
                }
                for f, r in rows
            ]
    except Exception:
        pass
    return ANALYZED_REVIEWS
