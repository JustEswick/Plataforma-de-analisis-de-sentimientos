// api.js
// Service Layer (Capa de Servicios de Red y Adaptador de API)
// Implementa el patrón Service Adapter con soporte Híbrido (Backend Real + Fallback Resiliente)

const API_CONFIG = {
    baseUrl: 'http://localhost:8000/api', // URL base configurable para FastAPI / Node / Python
    timeoutMs: 2500,                      // Timeout rápido para conmutar a mock si el servidor está apagado
    useMockFallback: true                 // Garantiza funcionamiento 100% resiliente en demos locales
};

// Mock Catalog Data (Fallback para pruebas locales o cuando el backend está inactivo)
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Aura Studio Master II 32" Display',
        category: 'Monitores',
        desc: 'Panel IPS Black 6K con calibración Delta-E < 1, 99% DCI-P3 y base ergonómica de aluminio mecanizado.',
        sentiment: 'positive',
        score: 96,
        rating: 4.9,
        reviewsCount: 248,
        sentimentBreakdown: { pos: 96, neu: 3, neg: 1 },
        price: '$1,490.00',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        name: 'Strata ErgoMotion Dual Desk Frame',
        category: 'Mobiliario',
        desc: 'Estructura de escritorio motorizada con doble motor ultra silencioso (<45dB), sensor anti-colisión y panel táctil.',
        sentiment: 'positive',
        score: 88,
        rating: 4.7,
        reviewsCount: 142,
        sentimentBreakdown: { pos: 88, neu: 8, neg: 4 },
        price: '$820.00',
        imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        name: 'Vessel Task Precision Ergonomic Chair',
        category: 'Mobiliario',
        desc: 'Silla ergonómica de ingeniería con respaldo en malla transpirable 3D, ajuste dinámico postural y soporte lumbar 4D.',
        sentiment: 'neutral',
        score: 74,
        rating: 4.1,
        reviewsCount: 96,
        sentimentBreakdown: { pos: 74, neu: 18, neg: 8 },
        price: '$650.00',
        imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 4,
        name: 'NovaCraft Pro Wireless Keyboard',
        category: 'Periféricos',
        desc: 'Teclado mecánico custom inalámbrico 75% con chasis de aluminio CNC, switches lineales lubricados e insonorización.',
        sentiment: 'positive',
        score: 93,
        rating: 4.8,
        reviewsCount: 312,
        sentimentBreakdown: { pos: 93, neu: 5, neg: 2 },
        price: '$235.00',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 5,
        name: 'Apex Studio Condenser Mic & DSP',
        category: 'Audio',
        desc: 'Micrófono de estudio profesional híbrido XLR/USB-C con procesamiento DSP integrado y reducción acústica.',
        sentiment: 'negative',
        score: 42,
        rating: 2.8,
        reviewsCount: 64,
        sentimentBreakdown: { pos: 42, neu: 16, neg: 42 },
        price: '$189.00',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 6,
        name: 'Synapse Noise-Cancelling ANC Pro',
        category: 'Audio',
        desc: 'Auriculares circumaurales inalámbricos con cancelación activa de ruido adaptable híbrida y transductores de 40mm.',
        sentiment: 'positive',
        score: 86,
        rating: 4.6,
        reviewsCount: 194,
        sentimentBreakdown: { pos: 86, neu: 9, neg: 5 },
        price: '$349.00',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 7,
        name: 'Horizon UltraWide 49" Curved Display',
        category: 'Monitores',
        desc: 'Monitor curvo 1000R Dual QHD 144Hz con panel Quantum Dot y conectividad USB-C 90W Power Delivery.',
        sentiment: 'positive',
        score: 95,
        rating: 4.9,
        reviewsCount: 188,
        sentimentBreakdown: { pos: 95, neu: 4, neg: 1 },
        price: '$1,850.00',
        imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 8,
        name: 'Lumina Bar Pro Smart ScreenBar',
        category: 'Iluminación',
        desc: 'Lámpara de monitor asimétrica sin reflejos en pantalla con sensor de luz ambiental y dial inalámbrico táctil.',
        sentiment: 'positive',
        score: 91,
        rating: 4.7,
        reviewsCount: 130,
        sentimentBreakdown: { pos: 91, neu: 7, neg: 2 },
        price: '$119.00',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 9,
        name: 'Nexus Thunderbolt 4 Quad-Dock',
        category: 'Conectividad',
        desc: 'Estación de acoplamiento corporativa con 4 puertos Thunderbolt 4, lectura SD UHS-II y carga de 100W.',
        sentiment: 'neutral',
        score: 79,
        rating: 4.3,
        reviewsCount: 45,
        sentimentBreakdown: { pos: 79, neu: 14, neg: 7 },
        price: '$299.00',
        imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=700&auto=format&fit=crop&q=80'
    }
];

// In-Memory Database for Mock Users
let mockRegisteredUsers = [];
let localProductsState = JSON.parse(JSON.stringify(MOCK_PRODUCTS));

// ApiService Singleton
window.ApiService = {
    // Configuración dinámica
    setBaseUrl(url) {
        API_CONFIG.baseUrl = url;
    },

    // Helper genérico para peticiones HTTP con Timeout
    async _fetchWithTimeout(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);
        
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
            clearTimeout(timeoutId);
            return response;
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    },

    // 1. Obtener Catálogo de Productos (RF-01)
    async getProducts() {
        try {
            const res = await this._fetchWithTimeout('/products', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[ApiService] Backend no disponible en ' + API_CONFIG.baseUrl + '. Utilizando capa mock local.');
        }

        // Fallback local
        return { success: true, data: localProductsState, source: 'mock' };
    },

    // 2. Iniciar Sesión
    async login(email, password) {
        try {
            const res = await this._fetchWithTimeout('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, user: data.user, token: data.token, source: 'remote' };
            } else {
                const errorData = await res.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Credenciales inválidas', source: 'remote' };
            }
        } catch (err) {
            console.info('[ApiService] Autenticación procesada en modo local.');
        }

        // Fallback Mock Auth
        const user = mockRegisteredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return { success: false, error: 'Usuario no encontrado. Por favor regístrate o verifica tu correo.', source: 'mock' };
        }
        if (user.password !== password) {
            return { success: false, error: 'Contraseña incorrecta. Por favor verifica tus credenciales.', source: 'mock' };
        }

        return { success: true, user: user, token: 'mock-jwt-token', source: 'mock' };
    },

    // 3. Registrar Cuenta Corporativa
    async register(userData) {
        const { name, email, company, password } = userData;

        try {
            const res = await this._fetchWithTimeout('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, company, password })
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, user: data.user, token: data.token, source: 'remote' };
            } else {
                const errorData = await res.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Error al registrar cuenta', source: 'remote' };
            }
        } catch (err) {
            console.info('[ApiService] Registro procesado en modo local.');
        }

        // Fallback Mock Register
        const existing = mockRegisteredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return { success: false, error: `Ya existe una cuenta con el correo ${email}.`, source: 'mock' };
        }

        const newUser = {
            id: 'USR-' + (mockRegisteredUsers.length + 1),
            name: name,
            email: email,
            company: company,
            password: password,
            role: 'Cliente Corporativo',
            orders: [
                { id: 'NX-' + Math.floor(1000 + Math.random() * 9000), product: 'Lumina Bar Pro Smart ScreenBar', date: 'Hoy', total: '$119.00', status: 'En Proceso' }
            ],
            reviews: []
        };

        mockRegisteredUsers.push(newUser);
        return { success: true, user: newUser, token: 'mock-jwt-token', source: 'mock' };
    },

    // 4. Enviar Evaluación y Calificación de Producto (RF-02 / Disparador del Pipeline de PLN)
    async submitReview(reviewData) {
        const { productId, productName, rating, comment, userEmail } = reviewData;

        try {
            const res = await this._fetchWithTimeout('/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                    userEmail
                })
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, review: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[ApiService] Evaluación registrada localmente (Pipeline simulado).');
        }

        // Fallback Mock Review update
        const product = localProductsState.find(p => p.id === productId);
        if (product) {
            product.reviewsCount += 1;
            if (rating >= 4) {
                product.sentimentBreakdown.pos = Math.min(99, product.sentimentBreakdown.pos + 1);
            } else if (rating <= 2) {
                product.sentimentBreakdown.neg = Math.min(99, product.sentimentBreakdown.neg + 2);
            }
        }

        const newReview = {
            id: 'REV-' + Date.now(),
            productId: productId,
            productName: productName,
            rating: rating,
            comment: comment,
            date: 'Justo ahora'
        };

        return { success: true, review: newReview, source: 'mock' };
    }
};
