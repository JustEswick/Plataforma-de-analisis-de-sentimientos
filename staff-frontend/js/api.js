// api.js
// Staff Service Adapter Layer (Capa de Servicios de Red para Frontend Staff)
// Conexión con FastAPI (:8000) y Mock Resiliente para Demos Offline

const STAFF_API_CONFIG = {
    baseUrl: 'http://localhost:8000',
    timeoutMs: 2500,
    useMockFallback: true
};

// Catálogo base compartido con Frontend Usuario (Single Source of Truth en local)
let staffCatalogState = [
    {
        id: 1,
        sku: 'MON-3201',
        name: 'Aura Studio Master II 32" Display',
        category: 'Monitores',
        desc: 'Panel IPS Black 6K con calibración Delta-E < 1, 99% DCI-P3 y base de aluminio mecanizado.',
        price: '$1,490.00',
        active: true,
        sentiment: 'positive',
        score: 96,
        reviewsCount: 248,
        sentimentBreakdown: { pos: 96, neu: 3, neg: 1 },
        topIssue: 'Claridad cromática óptima y fidelidad 6K impecable.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        sku: 'FUR-8202',
        name: 'Strata ErgoMotion Dual Desk Frame',
        category: 'Mobiliario',
        desc: 'Estructura de escritorio motorizada con doble motor ultra silencioso (<45dB) y panel táctil.',
        price: '$820.00',
        active: true,
        sentiment: 'positive',
        score: 88,
        reviewsCount: 142,
        sentimentBreakdown: { pos: 88, neu: 8, neg: 4 },
        topIssue: 'Excelente estabilidad en elevación máxima.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        sku: 'FUR-3104',
        name: 'Vessel Task Precision Ergonomic Chair',
        category: 'Mobiliario',
        desc: 'Silla ergonómica de ingeniería con respaldo en malla transpirable 3D y soporte lumbar 4D.',
        price: '$650.00',
        active: true,
        sentiment: 'neutral',
        score: 74,
        reviewsCount: 96,
        sentimentBreakdown: { pos: 74, neu: 18, neg: 8 },
        topIssue: 'Tensión de reclinación algo rígida en primeras semanas.',
        riskTier: 'Tier 2 / Observación',
        imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 4,
        sku: 'PER-2354',
        name: 'NovaCraft Pro Wireless Keyboard',
        category: 'Periféricos',
        desc: 'Teclado mecánico custom inalámbrico 75% con chasis CNC e insonorización multicapa.',
        price: '$235.00',
        active: true,
        sentiment: 'positive',
        score: 93,
        reviewsCount: 312,
        sentimentBreakdown: { pos: 93, neu: 5, neg: 2 },
        topIssue: 'Tacto acústico de switches muy elogiado.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 5,
        sku: 'AUD-9021',
        name: 'Apex Studio Condenser Mic & DSP',
        category: 'Audio',
        desc: 'Micrófono de estudio profesional híbrido XLR/USB-C con procesamiento DSP integrado.',
        price: '$189.00',
        active: true,
        sentiment: 'negative',
        score: 42,
        reviewsCount: 64,
        sentimentBreakdown: { pos: 42, neu: 16, neg: 42 },
        topIssue: 'Distorsión armónica y saturación en frecuencias superiores a 4kHz.',
        riskTier: 'Tier 1 / Alerta Crítica',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 6,
        sku: 'AUD-3490',
        name: 'Synapse Noise-Cancelling ANC Pro',
        category: 'Audio',
        desc: 'Auriculares circumaurales inalámbricos con cancelación de ruido activa híbrida.',
        price: '$349.00',
        active: true,
        sentiment: 'positive',
        score: 86,
        reviewsCount: 194,
        sentimentBreakdown: { pos: 86, neu: 9, neg: 5 },
        topIssue: 'Aislamiento acústico sobresaliente en oficinas.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 7,
        sku: 'MON-4420',
        name: 'Horizon UltraWide 49" Curved Display',
        category: 'Monitores',
        desc: 'Monitor curvo 1000R Dual QHD 144Hz con panel Quantum Dot y USB-C 90W PD.',
        price: '$1,299.00',
        active: true,
        sentiment: 'positive',
        score: 95,
        reviewsCount: 188,
        sentimentBreakdown: { pos: 95, neu: 4, neg: 1 },
        topIssue: 'Campo visual masivo sin distorsión en bordes.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 8,
        sku: 'ACC-1190',
        name: 'Lumina Bar Pro Smart ScreenBar',
        category: 'Accesorios',
        desc: 'Lámpara de monitor asimétrica sin reflejos en pantalla con sensor de luz ambiental.',
        price: '$119.00',
        active: true,
        sentiment: 'positive',
        score: 91,
        reviewsCount: 206,
        sentimentBreakdown: { pos: 91, neu: 7, neg: 2 },
        topIssue: 'Iluminación confortable sin deslumbramientos.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80'
    },
    {
        id: 9,
        sku: 'ACC-0450',
        name: 'OmniPad Precision Desk Mat',
        category: 'Accesorios',
        desc: 'Tapete de escritorio de cuero vegano impermeable con base de corcho natural antideslizante.',
        price: '$45.00',
        active: true,
        sentiment: 'positive',
        score: 98,
        reviewsCount: 140,
        sentimentBreakdown: { pos: 98, neu: 2, neg: 0 },
        topIssue: 'Textura suave y alta resistencia a derrames.',
        riskTier: 'Low / Safe',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80'
    }
];

// Feed inicial de reseñas analizadas por IA (Simulación del Feature Store / PostgreSQL)
let staffReviewsLiveFeed = [
    {
        id: 'REV-9021-1',
        productId: 5,
        productName: 'Apex Studio Condenser Mic & DSP',
        customerMasked: 'J*** M. (Corporativo Verificado)',
        rating: 1,
        sentiment: 'negative',
        confidence: 94,
        text: 'El micrófono presenta cortes continuos y distorsión armónica grave cuando se usa por USB-C. Inutilizable para locución profesional.',
        topics: ['#DistorsionAudio', '#FalloHardware', '#Saturacion'],
        date: 'Hace 12 minutos',
        escalated: true
    },
    {
        id: 'REV-3104-1',
        productId: 3,
        productName: 'Vessel Task Precision Ergonomic Chair',
        customerMasked: 'C*** R. (Ticket Soporte #49102)',
        rating: 3,
        sentiment: 'neutral',
        confidence: 76,
        text: 'El soporte lumbar es ergonómicamente excelente para jornadas de 8 horas, pero la palanca de reclinación viene excesivamente rígida.',
        topics: ['#Ergonomia', '#TensionReclinacion', '#Mecanismo'],
        date: 'Hace 45 minutos',
        escalated: false
    },
    {
        id: 'REV-3201-1',
        productId: 1,
        productName: 'Aura Studio Master II 32" Display',
        customerMasked: 'M*** K. (Adquisiciones B2B)',
        rating: 5,
        sentiment: 'positive',
        confidence: 98,
        text: 'Instalamos 40 unidades en nuestro estudio de postproducción. La fidelidad de color Delta-E y la nitidez 6K superaron expectativas.',
        topics: ['#Calidad6K', '#ColorCalibrado', '#FidelidadVisual'],
        date: 'Hace 1 hora',
        escalated: false
    },
    {
        id: 'REV-9021-2',
        productId: 5,
        productName: 'Apex Studio Condenser Mic & DSP',
        customerMasked: 'D*** S. (Cliente Verificado)',
        rating: 2,
        sentiment: 'negative',
        confidence: 91,
        text: 'El soporte de brazo es sólido pero el procesamiento DSP interno genera un ruido estático de fondo molesto.',
        topics: ['#RuidoFondo', '#DSP', '#Audio'],
        date: 'Hace 2 horas',
        escalated: true
    },
    {
        id: 'REV-2354-1',
        productId: 4,
        productName: 'NovaCraft Pro Wireless Keyboard',
        customerMasked: 'A*** P. (Cliente Verificado)',
        rating: 5,
        sentiment: 'positive',
        confidence: 96,
        text: 'El chasis de aluminio y los switches lubricados dan una experiencia de escritura premium y silenciosa.',
        topics: ['#MecanicoCustom', '#Ergonomia', '#Teclado'],
        date: 'Hace 3 horas',
        escalated: false
    }
];

const StaffApiService = {
    // Helper para peticiones HTTP con Timeout
    async _fetchWithTimeout(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), STAFF_API_CONFIG.timeoutMs);

        try {
            const response = await fetch(`${STAFF_API_CONFIG.baseUrl}${endpoint}`, {
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

    // 1. Obtener Visión General de Métricas y KPIs (RF-03)
    async getMetricsOverview(timeRange = '24h') {
        try {
            const res = await this._fetchWithTimeout(`/api/admin/metrics/overview?range=${timeRange}`, { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Backend en modo Fallback Local.');
        }

        // Cálculo dinámico de métricas con base en el catálogo actual
        const totalReviews = staffCatalogState.reduce((acc, p) => acc + p.reviewsCount, 0);
        const avgScore = Math.round(staffCatalogState.reduce((acc, p) => acc + p.score, 0) / staffCatalogState.length);
        const criticalIssues = staffReviewsLiveFeed.filter(r => r.sentiment === 'negative').length;
        
        return {
            success: true,
            data: {
                satisfactionScore: avgScore,
                satisfactionDelta: '+2.3%',
                totalReviewsProcessed: totalReviews,
                aiAutomatedRate: '98.4%',
                criticalComplaintsCount: criticalIssues,
                slaRemaining: '< 2 hrs',
                nlpEngineStatus: 'Azure OpenAI GPT-4o (Active)',
                avgLatencyMs: 142,
                sentimentDistribution: {
                    positive: 76,
                    neutral: 16,
                    negative: 8
                },
                departmentBreakdown: [
                    { name: 'Monitores', score: 96, sentiment: 'positive', status: 'Optimal' },
                    { name: 'Mobiliario', score: 81, sentiment: 'positive', status: 'Healthy' },
                    { name: 'Audio', score: 54, sentiment: 'negative', status: 'Flagged / Alert' },
                    { name: 'Periféricos & Accesorios', score: 92, sentiment: 'positive', status: 'Optimal' }
                ]
            },
            source: 'mock'
        };
    },

    // 2. Obtener Matriz de Riesgo y Clasificación de Productos (RF-03)
    async getProductSentimentMatrix(categoryFilter = 'all') {
        try {
            const res = await this._fetchWithTimeout(`/api/admin/products/sentiment-matrix?cat=${categoryFilter}`, { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Matriz de sentimiento calculada localmente.');
        }

        let filtered = staffCatalogState;
        if (categoryFilter !== 'all') {
            filtered = staffCatalogState.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
        }

        return {
            success: true,
            data: filtered,
            source: 'mock'
        };
    },

    // 3. Obtener Live Stream de Reseñas Analizadas (RF-03)
    async getReviewsLiveFeed(filter = {}) {
        try {
            const res = await this._fetchWithTimeout('/api/admin/reviews/live-feed', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Live Feed suministrado desde memoria local.');
        }

        let feed = [...staffReviewsLiveFeed];
        if (filter.sentiment && filter.sentiment !== 'all') {
            feed = feed.filter(r => r.sentiment === filter.sentiment);
        }
        if (filter.search) {
            const q = filter.search.toLowerCase();
            feed = feed.filter(r => r.text.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q));
        }

        return {
            success: true,
            data: feed,
            source: 'mock'
        };
    },

    // 4. Gestión CRUD: Listar Productos (RF-05)
    async getProductsList() {
        try {
            const res = await this._fetchWithTimeout('/products', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Catálogo CRUD servido desde memoria.');
        }

        return {
            success: true,
            data: staffCatalogState,
            source: 'mock'
        };
    },

    // 5. Gestión CRUD: Crear Nuevo Producto (RF-05)
    async createProduct(productData) {
        try {
            const res = await this._fetchWithTimeout('/api/admin/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Producto creado en catálogo local.');
        }

        const newId = staffCatalogState.length > 0 ? Math.max(...staffCatalogState.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            sku: productData.sku || `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
            name: productData.name,
            category: productData.category,
            desc: productData.desc,
            price: productData.price.startsWith('$') ? productData.price : `$${productData.price}`,
            active: true,
            sentiment: 'positive',
            score: 100,
            reviewsCount: 0,
            sentimentBreakdown: { pos: 100, neu: 0, neg: 0 },
            topIssue: 'Producto recién ingresado al catálogo.',
            riskTier: 'Nuevo / Sin Reseñas',
            imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80'
        };

        staffCatalogState.unshift(newProduct);
        return { success: true, data: newProduct, source: 'mock' };
    },

    // 6. Gestión CRUD: Actualizar Producto Existente (RF-05)
    async updateProduct(id, productData) {
        try {
            const res = await this._fetchWithTimeout(`/api/admin/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Producto actualizado localmente.');
        }

        const index = staffCatalogState.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Producto no encontrado' };
        }

        staffCatalogState[index] = {
            ...staffCatalogState[index],
            name: productData.name || staffCatalogState[index].name,
            category: productData.category || staffCatalogState[index].category,
            price: productData.price || staffCatalogState[index].price,
            desc: productData.desc || staffCatalogState[index].desc,
            imageUrl: productData.imageUrl || staffCatalogState[index].imageUrl
        };

        return { success: true, data: staffCatalogState[index], source: 'mock' };
    },

    // 7. Gestión CRUD: Activar / Desactivar Lógicamente (RF-05)
    async toggleProductStatus(id) {
        try {
            const res = await this._fetchWithTimeout(`/api/admin/products/${id}/toggle-status`, { method: 'PATCH' });
            if (res.ok) {
                const data = await res.json();
                return { success: true, data: data, source: 'remote' };
            }
        } catch (err) {
            console.info('[StaffApiService] Estado del producto modificado localmente.');
        }

        const product = staffCatalogState.find(p => p.id === parseInt(id));
        if (!product) {
            return { success: false, error: 'Producto no encontrado' };
        }

        product.active = !product.active;
        return { success: true, data: product, source: 'mock' };
    },

    // 8. Escalar Alerta de Calidad / Moderación
    async escalateProductIssue(productId, note = '') {
        const product = staffCatalogState.find(p => p.id === parseInt(productId));
        if (product) {
            product.riskTier = 'Escalado a QA Lead';
        }
        return { success: true, message: `Alerta escalada para ${product ? product.name : 'producto'}` };
    }
};
