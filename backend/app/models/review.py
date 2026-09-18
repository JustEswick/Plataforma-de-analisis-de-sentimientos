from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from app.core.database import Base

class RawReview(Base):
    __tablename__ = "raw_reviews"

    review_id = Column(String, primary_key=True, index=True)
    product_id = Column(String, index=True)
    customer_id = Column(String, nullable=True)
    raw_text = Column(String)
    rating = Column(Integer)
    received_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class SentimentFeature(Base):
    __tablename__ = "sentiment_features"

    feature_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id = Column(String, ForeignKey("raw_reviews.review_id"))
    product_id = Column(String, index=True)
    sentiment_label = Column(String)
    sentiment_score = Column(Float)
    confidence = Column(String)
    topics = Column(JSON)
    processed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
