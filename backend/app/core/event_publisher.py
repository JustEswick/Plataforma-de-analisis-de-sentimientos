from abc import ABC, abstractmethod
from typing import Any
import httpx
import os
import logging
import json
import aio_pika

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

class RabbitMQEventPublisher(IEventPublisher):
    """
    Despachador AMQP para emitir eventos asíncronos a RabbitMQ (Broker).
    """
    def __init__(self):
        self.amqp_url = os.getenv("AMQP_URL", "amqp://guest:guest@localhost:5672/")
        
    async def publish(self, event_name: str, payload: dict[str, Any]) -> None:
        try:
            connection = await aio_pika.connect_robust(self.amqp_url)
            async with connection:
                channel = await connection.channel()
                
                # Declarar cola durable
                queue = await channel.declare_queue("reviews_queue", durable=True)
                
                message = aio_pika.Message(
                    body=json.dumps(payload).encode(),
                    delivery_mode=aio_pika.DeliveryMode.PERSISTENT
                )
                
                await channel.default_exchange.publish(
                    message,
                    routing_key="reviews_queue"
                )
                logger.info(f"[{event_name}] encolado exitosamente en RabbitMQ.")
        except Exception as e:
            logger.error(f"Error publicando [{event_name}] en RabbitMQ: {e}")