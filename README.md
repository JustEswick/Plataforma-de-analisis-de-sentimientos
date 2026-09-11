# Sentiment Analysis Platform

Proyecto escolar de Ingeniería de Software II para desarrollar una Plataforma de Análisis de Sentimientos.

## Flujo de Trabajo (Git)
- `main`: Rama principal para despliegues (Producción).
- `development`: Rama principal de integración.
- **Ramas de Área (Sub-principales):**
  - `area/frontend`: Trabajo exclusivo del equipo de Front.
  - `area/backend`: Trabajo exclusivo del equipo de Back (FastAPI).
  - `area/n8n`: Trabajo exclusivo del equipo de orquestación e IA.
  - `area/database`: Trabajo exclusivo del equipo de Base de Datos y Feature Store.
- Los miembros del equipo deben crear sus propias subramas a partir de su rama de área correspondiente (ej. `feature/front-login` derivado de `area/frontend`) y hacer los PR hacia esa misma rama de área. Posteriormente las áreas se integran en `development`.

## Documentación y Agentes
*Nota: La documentación principal y los diagramas se mantienen de forma local y no se publican en este repositorio remoto.*
- Actualización del Proyecto: `README/Sentiment_Analysis_Platform_Update1.md` (Local)
- Diagramas: `Diagramas/Imagenes/` (Local)
- Configuración de Agentes: `.agents/AGENTS.md` (Local)
