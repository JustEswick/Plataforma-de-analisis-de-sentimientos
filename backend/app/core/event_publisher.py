from abc import ABC, abstractmethod
from typing import Any

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