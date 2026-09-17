from fastapi import FastAPI
from app.api.reviews import router as reviews_router

app = FastAPI(
    title="SIDTRA - Module 3: Business Logic and Event Publishing",
    description=(
        "Backend Reception and Validation API (RF-06, RF-07, NFR-01, NFR-02). "
        "Recibe reseñas, aplica Fail-Fast, enmascara PII, extrae features "
        "y publica el evento Review_Ready hacia el Event Broker."
    ),
    version="0.1.0",
)

app.include_router(reviews_router)

@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}