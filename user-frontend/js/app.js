// app.js
// E-commerce Mockup Application (Customer Frontend) for Sentiment Analysis Platform Validation

// In-memory catalog database
let products = [
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
        name: 'Vessel Task Precision Chair',
        category: 'Mobiliario',
        desc: 'Silla ergonómica de ingeniería con respaldo en malla transpirable 3D, ajuste dinámico postural y soporte lumbar 4D.',
        sentiment: 'neutral',
        score: 74,
        rating: 4.1,
        reviewsCount: 96,
        sentimentBreakdown: { pos: 74, neu: 18, neg: 8 },
        price: '$650.00',
        imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a8a37f714b?w=700&auto=format&fit=crop&q=80'
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
    }
];

// User session state
let currentUser = {
    name: 'Isaac E.',
    email: 'isaac.dev@enterprise.com',
    company: 'NovaTech Corp',
    role: 'Cliente Corporativo (E-commerce)',
    isLoggedIn: true,
    ordersCount: 4
};

// User submitted reviews state
let userReviewsHistory = [
    {
        productName: 'Aura Studio Master II 32" Display',
        rating: 5,
        comment: 'La nitidez y reproducción cromática son impecables para flujos de diseño y desarrollo continuo.',
        detectedSentiment: 'Positivo (98%)',
        date: 'Hace 2 horas'
    },
    {
        productName: 'NovaCraft Pro Wireless Keyboard',
        rating: 5,
        comment: 'El acabado en aluminio mecanizado y la respuesta acústica superaron mis expectativas.',
        detectedSentiment: 'Positivo (95%)',
        date: 'Ayer'
    }
];

// Simulated purchases
let userOrders = [
    { id: 'ORD-8941', product: 'Aura Studio Master II 32" Display', date: '14 Sep 2026', total: '$1,490.00', status: 'Entregado' },
    { id: 'ORD-8920', product: 'NovaCraft Pro Wireless Keyboard', date: '10 Sep 2026', total: '$235.00', status: 'Entregado' },
    { id: 'ORD-8874', product: 'Strata ErgoMotion Dual Desk Frame', date: '28 Ago 2026', total: '$820.00', status: 'Entregado' }
];

let currentFilter = 'all';
let currentSearch = '';
let currentView = 'catalog'; // 'catalog' | 'profile'

// Fallback SVGs cleanly handled in JS
const fallbackSvgs = {
    'Monitores': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    'Mobiliario': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="4" y="6" width="16" height="4" rx="1"/><line x1="6" y1="10" x2="6" y2="20"/><line x1="18" y1="10" x2="18" y2="20"/></svg>`,
    'Periféricos': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="7" y1="15" x2="17" y2="15"/></svg>`,
    'Audio': `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`
};

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Eswick - User Frontend App Ready');
    renderAuthArea();
    renderProducts();
});

// View switcher
window.switchView = function(view) {
    currentView = view;
    
    const catalogSection = document.getElementById('catalog-section');
    const profileSection = document.getElementById('profile-section');
    const metricsBar = document.getElementById('metrics-bar');
    const navCatalog = document.getElementById('nav-catalog');
    const navProfile = document.getElementById('nav-profile');

    if (view === 'catalog') {
        catalogSection.style.display = 'block';
        profileSection.style.display = 'none';
        metricsBar.style.display = 'grid';
        navCatalog.classList.add('active');
        navProfile.classList.remove('active');
        renderProducts();
    } else {
        catalogSection.style.display = 'none';
        profileSection.style.display = 'block';
        metricsBar.style.display = 'none';
        navCatalog.classList.remove('active');
        navProfile.classList.add('active');
        renderProfileView();
    }
};

// Auth Rendering
function renderAuthArea() {
    const authContainer = document.getElementById('auth-area');
    if (!authContainer) return;

    if (currentUser.isLoggedIn) {
        authContainer.innerHTML = `
            <div class="user-pill">
                <span class="user-avatar-mini">${currentUser.name.charAt(0)}</span>
                <span>${currentUser.name}</span>
                <button class="btn-logout-link" onclick="window.handleLogout()" title="Cerrar Sesión">(Salir)</button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button class="btn btn-primary btn-sm" onclick="window.openLoginModal()">Iniciar Sesión</button>
        `;
    }
}

window.handleLogout = function() {
    currentUser.isLoggedIn = false;
    renderAuthArea();
    if (currentView === 'profile') {
        renderProfileView();
    }
    window.showToast('ℹ️ Sesión cerrada.');
};

// Render Products Catalog (RF-01)
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = products.filter(p => {
        let matchesSentiment = true;
        if (currentFilter === 'positive') matchesSentiment = p.sentiment === 'positive';
        else if (currentFilter === 'neutral') matchesSentiment = p.sentiment === 'neutral';
        else if (currentFilter === 'negative') matchesSentiment = p.sentiment === 'negative';

        let matchesSearch = true;
        if (currentSearch.trim() !== '') {
            const query = currentSearch.toLowerCase();
            matchesSearch = p.name.toLowerCase().includes(query) || 
                            p.desc.toLowerCase().includes(query) || 
                            p.category.toLowerCase().includes(query);
        }

        return matchesSentiment && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl); background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">
                <p style="color: var(--color-text-muted); font-size: 1rem; margin-bottom: var(--space-sm);">No se encontraron productos con los criterios seleccionados.</p>
                <button class="btn btn-primary" onclick="window.resetFilters()">Restablecer Filtros</button>
            </div>
        `;
        return;
    }

    let html = '';
    filtered.forEach((product, index) => {
        let badgeClass = 'badge-sentiment-neutral';
        let sentimentText = 'Neutral';
        
        if (product.sentiment === 'positive') {
            badgeClass = 'badge-sentiment-positive';
            sentimentText = 'Positivo';
        } else if (product.sentiment === 'negative') {
            badgeClass = 'badge-sentiment-negative';
            sentimentText = 'Bajo Revisión';
        }
        
        const delayClass = `stagger-${(index % 5) + 1}`;

        html += `
            <article class="product-card slide-up ${delayClass}">
                <div class="product-image-container" id="img-container-${product.id}">
                    <span class="product-category-tag">${product.category}</span>
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="window.handleImageError(this, '${product.category}')" />
                </div>
                <div class="product-details">
                    <div class="product-meta-header">
                        <span class="badge ${badgeClass}">${product.score}% ${sentimentText}</span>
                        <div class="product-stars-summary">
                            <span class="star-icon">★</span>
                            <span>${product.rating}</span>
                            <span class="review-count">(${product.reviewsCount})</span>
                        </div>
                    </div>

                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.desc}</p>
                    
                    <!-- Sentiment Breakdown Meter -->
                    <div class="sentiment-breakdown">
                        <div class="sentiment-bar-label">
                            <span>Distribución de Sentimiento</span>
                            <span>${product.sentimentBreakdown.pos}% Pos | ${product.sentimentBreakdown.neg}% Neg</span>
                        </div>
                        <div class="sentiment-bar-track">
                            <div class="sentiment-bar-fill-pos" style="width: ${product.sentimentBreakdown.pos}%"></div>
                            <div class="sentiment-bar-fill-neu" style="width: ${product.sentimentBreakdown.neu}%"></div>
                            <div class="sentiment-bar-fill-neg" style="width: ${product.sentimentBreakdown.neg}%"></div>
                        </div>
                    </div>

                    <div class="product-footer">
                        <span class="product-price">${product.price}</span>
                        <button class="btn btn-primary" onclick="window.openReviewModal(${product.id}, '${escapeHtml(product.name)}')">Evaluar</button>
                    </div>
                </div>
            </article>
        `;
    });

    grid.innerHTML = html;
}

// Clean error handler for images
window.handleImageError = function(imgElement, category) {
    const parent = imgElement.parentElement;
    if (parent) {
        const fallback = fallbackSvgs[category] || fallbackSvgs['Monitores'];
        parent.innerHTML = `<span class="product-category-tag">${category}</span>${fallback}`;
    }
};

// Render Profile & Purchases View
function renderProfileView() {
    const container = document.getElementById('profile-section');
    if (!container) return;

    if (!currentUser.isLoggedIn) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem; max-width: 480px; margin: 0 auto;">
                <div style="font-size: 3rem; margin-bottom: var(--space-md);">🔒</div>
                <h3 style="font-size: 1.5rem; margin-bottom: var(--space-sm);">Inicia sesión en tu cuenta</h3>
                <p style="color: var(--color-text-muted); margin-bottom: var(--space-lg);">Debes ingresar como cliente para visualizar tus pedidos y opiniones registradas en el e-commerce.</p>
                <button class="btn btn-primary" onclick="window.openLoginModal()">Iniciar Sesión</button>
            </div>
        `;
        return;
    }

    let reviewsHtml = '';
    if (userReviewsHistory.length === 0) {
        reviewsHtml = '<p style="color: var(--color-text-muted);">No has emitido evaluaciones todavía.</p>';
    } else {
        userReviewsHistory.forEach(r => {
            reviewsHtml += `
                <div class="reviews-history-item">
                    <div class="reviews-history-header">
                        <span class="reviews-history-product">${r.productName}</span>
                        <span style="color: #f59e0b; font-weight: 600;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p class="reviews-history-text">"${r.comment}"</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.75rem; color: var(--color-text-muted);">
                        <span>Telemetría PLN detectada: <strong>${r.detectedSentiment}</strong></span>
                        <span>${r.date}</span>
                    </div>
                </div>
            `;
        });
    }

    let ordersHtml = '';
    userOrders.forEach(o => {
        ordersHtml += `
            <div class="order-item-card">
                <div>
                    <div class="order-item-title">${o.product}</div>
                    <div class="order-item-date">Pedido: ${o.id} • ${o.date}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; font-size: 0.9375rem;">${o.total}</div>
                    <span class="badge badge-sentiment-positive" style="font-size: 0.7rem; padding: 1px 6px;">${o.status}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <!-- Role clarification banner -->
        <div class="role-banner">
            <div class="role-banner-icon">ℹ️</div>
            <div>
                <div class="role-banner-title">Dominio de Usuario: Cliente del E-commerce</div>
                <div class="role-banner-desc">Esta interfaz representa la experiencia del comprador final en la tienda corporativa. Las opiniones que registres aquí alimentan los modelos de PLN de la <strong>Plataforma de Análisis de Sentimientos</strong> (cuya gestión corresponde al rol de Administrador/Analista).</div>
            </div>
        </div>

        <div class="profile-grid-layout">
            <!-- Columna Izquierda: Información de Perfil -->
            <div>
                <div class="profile-card-box">
                    <div class="profile-avatar-large">${currentUser.name.charAt(0)}</div>
                    <div class="profile-name">${currentUser.name}</div>
                    <div class="profile-email">${currentUser.email}</div>
                    <span class="profile-role-tag">${currentUser.role}</span>
                    
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Organización</span>
                        <span class="profile-meta-val">${currentUser.company}</span>
                    </div>
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Pedidos Registrados</span>
                        <span class="profile-meta-val">${userOrders.length}</span>
                    </div>
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Evaluaciones Emitidas</span>
                        <span class="profile-meta-val">${userReviewsHistory.length}</span>
                    </div>
                </div>
            </div>

            <!-- Columna Derecha: Pedidos y Evaluaciones -->
            <div>
                <div class="profile-card-box">
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md);">Historial de Compras Recientes</h3>
                    ${ordersHtml}
                </div>

                <div class="profile-card-box">
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md);">Mis Evaluaciones y Telemetría Emitida</h3>
                    ${reviewsHtml}
                </div>
            </div>
        </div>
    `;
}

// Global Filter Handlers
window.filterBySentiment = function(type) {
    currentFilter = type;
    
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => pill.classList.remove('active'));
    
    if (type === 'all' && pills[0]) pills[0].classList.add('active');
    if (type === 'positive' && pills[1]) pills[1].classList.add('active');
    if (type === 'neutral' && pills[2]) pills[2].classList.add('active');
    if (type === 'negative' && pills[3]) pills[3].classList.add('active');

    renderProducts();
};

window.handleSearch = function(val) {
    currentSearch = val;
    renderProducts();
};

window.resetFilters = function() {
    currentFilter = 'all';
    currentSearch = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    window.filterBySentiment('all');
};

// Login Modal View
window.openLoginModal = function() {
    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="login-modal" class="modal-overlay">
            <div class="modal-content" style="max-width: 440px;">
                <div class="modal-header">
                    <h3>Acceso a SentimentStore</h3>
                    <p>Inicia sesión como cliente para interactuar y enviar evaluaciones al motor de análisis.</p>
                </div>
                
                <div class="login-presets">
                    <div class="preset-login-btn" onclick="window.performPresetLogin('Isaac E.', 'isaac.dev@enterprise.com', 'NovaTech Corp')">
                        <div>
                            <div class="preset-user-name">👤 Isaac E. (Cliente Corporativo)</div>
                            <div class="preset-user-role">NovaTech Corp • isaac.dev@enterprise.com</div>
                        </div>
                        <span class="badge badge-sentiment-positive">Entrar</span>
                    </div>

                    <div class="preset-login-btn" onclick="window.performPresetLogin('Dra. Valenzuela', 'valenzuela@labs.io', 'Biotech Labs')">
                        <div>
                            <div class="preset-user-name">👤 Dra. Valenzuela (Cliente)</div>
                            <div class="preset-user-role">Biotech Labs • valenzuela@labs.io</div>
                        </div>
                        <span class="badge badge-sentiment-positive">Entrar</span>
                    </div>
                </div>

                <div style="margin-top: var(--space-lg); padding: var(--space-sm); background: #f8fafc; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--color-text-muted); border: 1px solid var(--color-border);">
                    💡 <em>Nota de Arquitectura:</em> Los administradores de la plataforma analizan estas métricas desde el Dashboard de Analítica PLN interno.
                </div>
                
                <div class="modal-actions" style="margin-top: var(--space-lg);">
                    <button type="button" class="btn btn-ghost" onclick="window.closeModal('login-modal')">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    setTimeout(() => {
        const modal = document.getElementById('login-modal');
        if (modal) modal.classList.add('active');
    }, 10);
};

window.performPresetLogin = function(name, email, company) {
    currentUser = {
        name: name,
        email: email,
        company: company,
        role: 'Cliente Corporativo (E-commerce)',
        isLoggedIn: true,
        ordersCount: 3
    };

    window.closeModal('login-modal');
    renderAuthArea();
    if (currentView === 'profile') {
        renderProfileView();
    }
    window.showToast(`👋 Bienvenido de nuevo, <strong>${name}</strong>.`);
};

// RF-02: Review & Sentiment Evaluation Modal
window.openReviewModal = function(productId, productName) {
    if (!currentUser.isLoggedIn) {
        window.openLoginModal();
        window.showToast('ℹ️ Por favor inicia sesión como cliente para evaluar el producto.');
        return;
    }

    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="review-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Evaluar Producto</h3>
                    <p>Tu opinión será procesada por el motor de análisis de sentimientos.</p>
                    <div style="font-weight: 600; color: var(--color-primary); margin-top: 4px;">${productName}</div>
                </div>
                
                <form id="review-form" onsubmit="window.submitReview(event, ${productId}, '${escapeHtml(productName)}')">
                    <div class="form-group">
                        <label class="form-label">Calificación Cuantitativa</label>
                        <div class="star-rating">
                            <input type="radio" id="star5" name="rating" value="5" required />
                            <label for="star5" title="5 estrellas">★</label>
                            <input type="radio" id="star4" name="rating" value="4" />
                            <label for="star4" title="4 estrellas">★</label>
                            <input type="radio" id="star3" name="rating" value="3" />
                            <label for="star3" title="3 estrellas">★</label>
                            <input type="radio" id="star2" name="rating" value="2" />
                            <label for="star2" title="2 estrellas">★</label>
                            <input type="radio" id="star1" name="rating" value="1" />
                            <label for="star1" title="1 estrella">★</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Comentario Cualitativo del Cliente</label>
                        <textarea id="review-text" class="form-textarea" placeholder="Escribe tu experiencia con el producto (ej. 'Excelente calidad de construcción', 'Presenta fallos térmicos')..." required oninput="window.simulateSentimentAnalysis(this.value)"></textarea>
                        
                        <!-- Simulated Real-time NLP Detector Preview -->
                        <div class="sentiment-live-preview" id="live-sentiment-box">
                            <span class="preview-title">Telemetría de Sentimiento Previsto:</span>
                            <span id="live-sentiment-badge" class="badge badge-sentiment-neutral">Escribe para analizar...</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" onclick="window.closeModal('review-modal')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Registrar Evaluación</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    
    setTimeout(() => {
        const modal = document.getElementById('review-modal');
        if (modal) modal.classList.add('active');
    }, 10);
};

// Real-time sentiment classification preview simulation
window.simulateSentimentAnalysis = function(text) {
    const badge = document.getElementById('live-sentiment-badge');
    if (!badge) return;

    const lower = text.toLowerCase();
    if (lower.trim().length < 3) {
        badge.className = 'badge badge-sentiment-neutral';
        badge.innerText = 'Escribe para analizar...';
        return;
    }

    const posKeywords = ['excelente', 'increible', 'bueno', 'perfecto', 'calidad', 'impecable', 'comodo', 'rapido', 'gran', 'satisfecho', 'recomiendo', 'genial', 'optimo', 'premium'];
    const negKeywords = ['malo', 'pesimo', 'falla', 'defecto', 'lento', 'ruidoso', 'horrible', 'caro', 'incomodo', 'calienta', 'decepcion', 'rompio', 'quebrado', 'error'];

    let posScore = 0;
    let negScore = 0;

    posKeywords.forEach(k => { if (lower.includes(k)) posScore++; });
    negKeywords.forEach(k => { if (lower.includes(k)) negScore++; });

    if (posScore > negScore) {
        badge.className = 'badge badge-sentiment-positive';
        badge.innerText = 'Positivo (~94% confianza)';
    } else if (negScore > posScore) {
        badge.className = 'badge badge-sentiment-negative';
        badge.innerText = 'Crítico (~89% confianza)';
    } else {
        badge.className = 'badge badge-sentiment-neutral';
        badge.innerText = 'Neutral (~70% confianza)';
    }
};

window.closeModal = function(modalId = 'review-modal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.getElementById('modal-container').innerHTML = '';
        }, 300);
    }
};

window.submitReview = function(e, productId, productName) {
    e.preventDefault();
    
    const form = document.getElementById('review-form');
    const ratingInput = form.querySelector('input[name="rating"]:checked');
    const commentInput = document.getElementById('review-text');
    
    const ratingVal = ratingInput ? parseInt(ratingInput.value) : 5;
    const commentVal = commentInput ? commentInput.value.trim() : '';

    let detectedTag = 'Positivo (95%)';
    if (ratingVal <= 2) detectedTag = 'Crítico (88%)';
    else if (ratingVal === 3) detectedTag = 'Neutral (72%)';

    // Store in user history
    userReviewsHistory.unshift({
        productName: productName,
        rating: ratingVal,
        comment: commentVal,
        detectedSentiment: detectedTag,
        date: 'Justo ahora'
    });

    // Update product stats
    const product = products.find(p => p.id === productId);
    if (product) {
        product.reviewsCount += 1;
        if (ratingVal >= 4) {
            product.sentimentBreakdown.pos = Math.min(99, product.sentimentBreakdown.pos + 1);
        } else if (ratingVal <= 2) {
            product.sentimentBreakdown.neg = Math.min(99, product.sentimentBreakdown.neg + 2);
        }
    }

    window.closeModal('review-modal');
    window.showToast(`✅ Evaluación registrada exitosamente para <strong>${productName}</strong>.`);
    renderProducts();
};

window.showToast = function(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast slide-up';
    toast.innerHTML = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
