from abc import ABC, abstractmethod
from typing import Any
import httpx
import os
import logging

logger = logging.getLogger(__name__)

class IEventPublisher(ABC):
    """
    DIP (Sección 3.4): abstracción de la que depende la lógica de negocio.
    """
    @abstractmethod
    async def publish(self, event_name: str, payload: dict[str, Any]) -> None:
        """Publica un evento de forma asíncrona hacia el Event Broker."""
        raise NotImplementedError

class MockEventPublisher(IEventPublisher):
    """
    Implementación de prueba para desarrollo aislado (imprime en consola).
    """
    async def publish(self, event_name: str, payload: dict[str, Any]) -> None:
        print(f"[MOCK EVENT PUBLISHED] event='{event_name}' payload={payload}")

class HttpWebhookPublisher(IEventPublisher):
    """
    Despachador HTTP para emitir eventos a un webhook de n8n.
    """
    def __init__(self):
        # URL por defecto al Webhook de prueba del flujo de n8n
        self.webhook_url = os.getenv(
            "N8N_WEBHOOK_URL",
            "http://localhost:5678/webhook-test/ab5e4982-53ca-44fc-9304-ffca7a875506"
        )
    
    async def publish(self, event_name: str, payload: dict[str, Any]) -> None:
        async with httpx.AsyncClient() as client:
            try:
                # Se envuelve el payload en el formato que espera n8n (opcional) o crudo
                response = await client.post(self.webhook_url, json=payload, timeout=5.0)
                response.raise_for_status()
                logger.info(f"[{event_name}] publicado exitosamente en n8n.")
            except Exception as e:
                logger.error(f"Error publicando [{event_name}] en n8n: {e}")