import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.api.reviews import get_event_publisher
from app.services.pii_masking import mask_pii
from app.services.feature_engineering import extract_features
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_cp01_fail_fast_validation_rating_out_of_bounds():
    """CP-01: Validar que la API rechace ratings fuera de rango (1-5) con HTTP 422."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/reviews", json={
            "product_id": "PROD-100",
            "customer_id": "CUST-001",
            "rating": 6,  # Inválido (> 5)
            "raw_text": "Excelente producto"
        })
        assert response.status_code == 422

@pytest.mark.asyncio
async def test_cp01_fail_fast_validation_empty_text():
    """CP-01: Validar que la API rechace texto vacío con HTTP 422."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/reviews", json={
            "product_id": "PROD-100",
            "customer_id": "CUST-001",
            "rating": 5,
            "raw_text": ""  # Inválido (min_length=1)
        })
        assert response.status_code == 422

@pytest.mark.asyncio
async def test_cp02_pii_masking_unit():
    """CP-02: Validar enmascaramiento unitario de PII (email, tarjetas, teléfonos)."""
    text_with_pii = "Contactarme a soporte@empresa.com o al 5512345678 con mi tarjeta 4152-3134-5678-9012"
    masked = mask_pii(text_with_pii)
    assert "[EMAIL_REDACTED]" in masked
    assert "soporte@empresa.com" not in masked
    assert "[CARD_REDACTED]" in masked
    assert "4152-3134-5678-9012" not in masked
    assert "[PHONE_REDACTED]" in masked

@pytest.mark.asyncio
async def test_cp02_and_cp03_pipeline_and_broker_event():
    """CP-02 & CP-03: Validar que el endpoint /reviews enmascare y despache el evento Review_Ready."""
    mock_publisher = AsyncMock()
    mock_publisher.publish = AsyncMock()
    
    app.dependency_overrides[get_event_publisher] = lambda: mock_publisher
    
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            payload = {
                "product_id": "PROD-100",
                "customer_id": "CUST-001",
                "rating": 5,
                "raw_text": "Increible calidad, mi email es cliente@gmail.com"
            }
            response = await ac.post("/reviews", json=payload)
            assert response.status_code == 202
            data = response.json()
            assert data["status"] == "accepted"
            assert "review_id" in data
            
            # Validar que el evento emitido al broker contenga el texto enmascarado
            assert mock_publisher.publish.called
            call_args = mock_publisher.publish.call_args
            assert call_args.kwargs["event_name"] == "Review_Ready"
            event_payload = call_args.kwargs["payload"]
            assert "[EMAIL_REDACTED]" in event_payload["masked_text"]
            assert "cliente@gmail.com" not in event_payload["masked_text"]
            assert event_payload["rating"] == 5
            assert event_payload["language"] == "es"
    finally:
        app.dependency_overrides.pop(get_event_publisher, None)

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.database import get_db, Base
from app.models.review import SentimentFeature

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

async def override_get_db():
    async with TestSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

import pytest_asyncio

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_cp05_and_cp07_analyzed_reviews_callback_and_persistence():
    """CP-05 & CP-07: Validar que el endpoint /reviews/analyzed almacene resultados en la base de datos."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        analysis_result = {
            "review_id": "rev-test-123",
            "producto_id": "PROD-100",
            "sentimiento": "Positive",
            "puntaje": 0.95,
            "confianza": "alta",
            "temas": ["calidad", "atención"],
            "rating": 5,
            "status": "success"
        }
        res_post = await ac.post("/reviews/analyzed", json=analysis_result)
        assert res_post.status_code == 200
        
        # CP-07 Validamos que el get arroje lo persistido
        res_get = await ac.get("/reviews/analyzed")
        assert res_get.status_code == 200
        data = res_get.json()
        assert any(r["review_id"] == "rev-test-123" for r in data)
        assert any(r["sentimiento"] == "Positive" for r in data)
