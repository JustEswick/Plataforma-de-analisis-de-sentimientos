-- ====================================================================
-- SIDTRA Database Schema - Sentiment Analysis Platform
-- PostgreSQL 16 Script
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TIPOS ENUMERADOS
CREATE TYPE review_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'processed');
CREATE TYPE sentiment_label_enum AS ENUM ('Positive', 'Neutral', 'Negative');
CREATE TYPE staff_role_enum AS ENUM ('admin', 'moderator', 'analyst');

-- 2. TABLA: CATEGORÍAS DE PRODUCTOS
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: CATÁLOGO DE PRODUCTOS (RF-01, RF-05)
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    sku VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    active_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA: CLIENTES CORPORATIVOS (E-COMMERCE)
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    company VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: RESEÑAS TRANSACCIONALES (RF-02, RF-06)
CREATE TABLE IF NOT EXISTS raw_reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    raw_text TEXT NOT NULL,
    masked_text TEXT,
    validation_status review_status_enum DEFAULT 'accepted',
    submission_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA: FEATURE STORE & MÉTRICAS PLN (RF-07, RF-08, RF-09 - Tablas 2, 3 y 4)
CREATE TABLE IF NOT EXISTS sentiment_features (
    feature_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL UNIQUE REFERENCES raw_reviews(review_id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    sentiment_label sentiment_label_enum NOT NULL,
    sentiment_score DECIMAL(5, 4) NOT NULL CHECK (sentiment_score >= 0 AND sentiment_score <= 1),
    language VARCHAR(8) DEFAULT 'es',
    text_length INT NOT NULL,
    extracted_topics JSONB DEFAULT '[]'::jsonb,
    model_version VARCHAR(64) DEFAULT 'azure-openai-gpt-4o',
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLAS DE ADMINISTRACIÓN Y AUDITORÍA (RF-03, RF-04, RF-05)
CREATE TABLE IF NOT EXISTS staff_users (
    staff_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) NOT NULL UNIQUE,
    role staff_role_enum DEFAULT 'analyst',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_audit_log (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff_users(staff_id) ON DELETE SET NULL,
    action_type VARCHAR(64) NOT NULL,
    target_record_id VARCHAR(64) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    audit_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- ÍNDICES DE RENDIMIENTO (Optimización para Consultas del Dashboard)
-- ====================================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_raw_reviews_product ON raw_reviews(product_id);
CREATE INDEX idx_raw_reviews_timestamp ON raw_reviews(submission_timestamp DESC);
CREATE INDEX idx_sentiment_features_label ON sentiment_features(sentiment_label);
CREATE INDEX idx_sentiment_features_product ON sentiment_features(product_id);
CREATE INDEX idx_sentiment_features_processed ON sentiment_features(processed_at DESC);

-- ====================================================================
-- SEED DATA: PRODUCTOS BASE DE NEXWORK SYSTEMS (Catálogo Inicial)
-- ====================================================================
INSERT INTO categories (category_id, name, description) VALUES
(1, 'Monitores', 'Monitores de alta definición, 6K Retina y UltraWide para estaciones de trabajo'),
(2, 'Mobiliario', 'Escritorios motorizados y sillería ergonómica certificada'),
(3, 'Periféricos', 'Teclados mecánicos custom y dispositivos de entrada'),
(4, 'Audio', 'Micrófonos de estudio y auriculares con cancelación de ruido'),
(5, 'Iluminación', 'Lámparas de monitor asimétricas y control lumínico'),
(6, 'Conectividad', 'Docks Thunderbolt 4 y hubs de alto rendimiento')
ON CONFLICT (category_id) DO NOTHING;

INSERT INTO products (product_id, category_id, sku, name, description, price, image_url, active_status) VALUES
(1, 1, 'NW-DSP-6K32', 'Aura Studio Master II 32" Display', 'Panel IPS Black 6K con calibración Delta-E < 1, 99% DCI-P3 y base ergonómica de aluminio mecanizado.', 1490.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80', true),
(2, 2, 'NW-DSK-DUAL', 'Strata ErgoMotion Dual Desk Frame', 'Estructura de escritorio motorizada con doble motor ultra silencioso (<45dB), sensor anti-colisión y panel táctil.', 820.00, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=700&auto=format&fit=crop&q=80', true),
(3, 2, 'NW-CHR-VESSEL', 'Vessel Task Precision Ergonomic Chair', 'Silla ergonómica de ingeniería con respaldo en malla transpirable 3D, ajuste dinámico postural y soporte lumbar 4D.', 650.00, 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=700&auto=format&fit=crop&q=80', true),
(4, 3, 'NW-KBD-PRO75', 'NovaCraft Pro Wireless Keyboard', 'Teclado mecánico custom inalámbrico 75% con chasis de aluminio CNC, switches lineales lubricados e insonorización.', 235.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80', true),
(5, 4, 'NW-MIC-APEX', 'Apex Studio Condenser Mic & DSP', 'Micrófono de estudio profesional híbrido XLR/USB-C con procesamiento DSP integrado y reducción acústica.', 189.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80', true),
(6, 4, 'NW-AUD-SYNAPSE', 'Synapse Noise-Cancelling ANC Pro', 'Auriculares circumaurales inalámbricos con cancelación activa de ruido adaptable híbrida y transductores de 40mm.', 349.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80', true),
(7, 1, 'NW-DSP-49CURV', 'Horizon UltraWide 49" Curved Display', 'Monitor curvo 1000R Dual QHD 144Hz con panel Quantum Dot y conectividad USB-C 90W Power Delivery.', 1850.00, 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=700&auto=format&fit=crop&q=80', true),
(8, 5, 'NW-LGT-LUMINA', 'Lumina Bar Pro Smart ScreenBar', 'Lámpara de monitor asimétrica sin reflejos en pantalla con sensor de luz ambiental y dial inalámbrico táctil.', 119.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80', true),
(9, 6, 'NW-DCK-TB4', 'Nexus Thunderbolt 4 Quad-Dock', 'Estación de acoplamiento corporativa con 4 puertos Thunderbolt 4, lectura SD UHS-II y carga de 100W.', 299.00, 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=700&auto=format&fit=crop&q=80', true)
ON CONFLICT (product_id) DO NOTHING;
