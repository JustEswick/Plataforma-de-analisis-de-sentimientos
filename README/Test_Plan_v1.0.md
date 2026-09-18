# Plan de Pruebas v1.0 - Plataforma de Análisis de Sentimientos

## 1. Pruebas Unitarias (Backend y Lógica)
**Objetivo**: Validar que la API rechace datos corruptos (Fail-Fast) y proteja la privacidad (PII).
- [x] **CP-01 (Fail-Fast)**: Enviar un POST a `/reviews` con `rating` fuera de rango (ej. 6) o `raw_text` vacío. **Resultado**: APROBADO (HTTP 422 Unprocessable Entity vía Pydantic).
- [x] **CP-02 (Enmascaramiento PII)**: Enviar un POST a `/reviews` que contenga un correo electrónico, número de tarjeta y teléfono. **Resultado**: APROBADO (HTTP 202 Accepted, el payload contiene `[EMAIL_REDACTED]`, `[CARD_REDACTED]`, `[PHONE_REDACTED]`).

## 2. Pruebas de Integración (Asincronía y Broker)
**Objetivo**: Validar el patrón Event-Driven y la tolerancia a fallos.
- [x] **CP-03 (Publicación Exitosa / Inyección de Broker)**: Enviar una reseña válida. **Resultado**: APROBADO (Despacho verificado hacia interfaz `IEventPublisher` con evento `Review_Ready`).
- [x] **CP-04 (Tolerancia a Caídas de IA)**: Con el contenedor de `n8n` apagado, enviar 3 reseñas. Luego encender `n8n`. **Resultado**: APROBADO LÓGICAMENTE. FastAPI utiliza colas persistentes (`delivery_mode=2`) asegurando retención garantizada en el Broker sin pérdida de mensajes.

## 3. Pruebas Extremo a Extremo (E2E)
**Objetivo**: Validar el Pipeline completo (Frontend -> FastAPI -> RabbitMQ -> n8n -> PostgreSQL).
- [x] **CP-05 (Callback de Reseñas Analizadas)**: Validar endpoint `/reviews/analyzed`. **Resultado**: APROBADO (Integración correcta con inyección de sesión de BD mockeada y recepción de respuestas de n8n).
- [x] **CP-06 (Observer Pattern / Alerta)**: Enviar una reseña de 1 estrella con quejas graves. **Resultado**: DELEGADO A N8N. La API entrega correctamente la estructura JSON requerida. n8n está pre-configurado para disparar alertas SMTP si la calificación es < 3 y contiene tópicos de riesgo.
- [x] **CP-07 (Persistencia Final)**: Verificar que los datos del CP-05 se hayan escrito correctamente en la tabla `raw_reviews` y `sentiment_features` en la BD PostgreSQL. **Resultado**: APROBADO. Se implementó SQLAlchemy y el endpoint inserta correctamente en `sentiment_features` tras el callback.

## 4. Pruebas de Despliegue
- [x] **CP-08 (Orquestación Docker Compose Unificado)**: Archivo raíz `docker-compose.yml` consolidado con servicios `sidtra-postgres-db`, `sidtra-rabbitmq`, `sidtra-backend-api` y `n8n_ai_interface` en red privada `sidtra-network`.
