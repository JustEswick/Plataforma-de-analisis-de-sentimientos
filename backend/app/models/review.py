from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime, timezone
import uuid

from app.core.database import Base

class RawReview(Base):
    __tablename__ = "raw_reviews"

    review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(Integer, index=True)
    customer_id = Column(UUID(as_uuid=True), nullable=True)
    rating = Column(Integer)
    raw_text = Column(String)
    masked_text = Column(String, nullable=True)
    validation_status = Column(String, default="accepted")
    sentiment_label = Column(String, nullable=True)
    submission_timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class SentimentFeature(Base):
    __tablename__ = "sentiment_features"

    feature_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_id = Column(UUID(as_uuid=True), ForeignKey("raw_reviews.review_id"))
    product_id = Column(Integer, index=True)
    sentiment_label = Column(String)
    sentiment_score = Column(Numeric(5, 4))
    language = Column(String, default="es")
    text_length = Column(Integer, default=0)
    extracted_topics = Column(JSONB, default=list)
    model_version = Column(String, default="azure-openai-gpt-4o")
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    processed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

