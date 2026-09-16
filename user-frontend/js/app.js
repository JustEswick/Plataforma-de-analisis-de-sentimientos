// app.js
// NexWork Systems - Corporate Hardware E-commerce & Customer Feedback System

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
        name: 'Vessel Task Precision Ergonomic Chair',
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

// Registered Users Database
let registeredUsers = [
    {
        name: 'Isaac E.',
        email: 'isaac@empresa.com',
        password: 'password123',
        company: 'NovaTech Solutions',
        role: 'Cliente Corporativo',
        orders: [
            { id: 'NX-8941', product: 'Aura Studio Master II 32" Display', date: '14 Sep 2026', total: '$1,490.00', status: 'Entregado' },
            { id: 'NX-8920', product: 'NovaCraft Pro Wireless Keyboard', date: '10 Sep 2026', total: '$235.00', status: 'Entregado' },
            { id: 'NX-8874', product: 'Strata ErgoMotion Dual Desk Frame', date: '28 Ago 2026', total: '$820.00', status: 'Entregado' }
        ],
        reviews: [
            {
                productName: 'Aura Studio Master II 32" Display',
                rating: 5,
                comment: 'La nitidez y reproducción cromática son impecables para flujos de diseño y desarrollo continuo.',
                date: 'Hace 2 horas'
            },
            {
                productName: 'NovaCraft Pro Wireless Keyboard',
                rating: 5,
                comment: 'El acabado en aluminio mecanizado y la respuesta acústica superaron mis expectativas.',
                date: 'Ayer'
            }
        ]
    }
];

// Current active session
let currentUser = registeredUsers[0]; // Active by default for quick test, can be logged out

let currentFilter = 'all';
let currentSearch = '';
let currentView = 'catalog'; // 'catalog' | 'profile'

// Fallback SVGs cleanly handled in JS
const fallbackSvgs = {
    'Monitores': `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    'Mobiliario': `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="4" y="6" width="16" height="4" rx="1"/><line x1="6" y1="10" x2="6" y2="20"/><line x1="18" y1="10" x2="18" y2="20"/></svg>`,
    'Periféricos': `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="7" y1="15" x2="17" y2="15"/></svg>`,
    'Audio': `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
    'Iluminación': `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`,
    'Conectividad': `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/></svg>`
};

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Eswick - NexWork Systems Ready');
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        catalogSection.style.display = 'none';
        profileSection.style.display = 'block';
        metricsBar.style.display = 'none';
        navCatalog.classList.remove('active');
        navProfile.classList.add('active');
        renderProfileView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Auth Rendering
function renderAuthArea() {
    const authContainer = document.getElementById('auth-area');
    if (!authContainer) return;

    if (currentUser) {
        authContainer.innerHTML = `
            <div class="user-pill">
                <span class="user-avatar-mini">${currentUser.name.charAt(0)}</span>
                <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentUser.name}</span>
                <button class="btn-logout-link" onclick="window.handleLogout()" title="Cerrar Sesión">(Cerrar sesión)</button>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button class="btn btn-outline btn-sm" onclick="window.openAuthModal('login')">Iniciar Sesión</button>
            <button class="btn btn-primary btn-sm" onclick="window.openAuthModal('register')">Crear Cuenta</button>
        `;
    }
}

window.handleLogout = function() {
    currentUser = null;
    renderAuthArea();
    if (currentView === 'profile') {
        renderProfileView();
    }
    window.showToast('ℹ️ Has cerrado sesión correctamente.');
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
        let sentimentText = 'Satisfacción Media';
        
        if (product.sentiment === 'positive') {
            badgeClass = 'badge-sentiment-positive';
            sentimentText = 'Alta Recomendación';
        } else if (product.sentiment === 'negative') {
            badgeClass = 'badge-sentiment-negative';
            sentimentText = 'Opiniones Divididas';
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
                            <span>Índice de Aprobación</span>
                            <span>${product.sentimentBreakdown.pos}% Positivo</span>
                        </div>
                        <div class="sentiment-bar-track">
                            <div class="sentiment-bar-fill-pos" style="width: ${product.sentimentBreakdown.pos}%"></div>
                            <div class="sentiment-bar-fill-neu" style="width: ${product.sentimentBreakdown.neu}%"></div>
                            <div class="sentiment-bar-fill-neg" style="width: ${product.sentimentBreakdown.neg}%"></div>
                        </div>
                    </div>

                    <div class="product-footer">
                        <span class="product-price">${product.price}</span>
                        <button class="btn btn-primary" onclick="window.openReviewModal(${product.id}, '${escapeHtml(product.name)}')">Evaluar Producto</button>
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

    if (!currentUser) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem; max-width: 480px; margin: 0 auto;">
                <div style="font-size: 3rem; margin-bottom: var(--space-md);">🔒</div>
                <h3 style="font-size: 1.5rem; margin-bottom: var(--space-sm);">Acceso a tu Cuenta</h3>
                <p style="color: var(--color-text-muted); margin-bottom: var(--space-lg);">Inicia sesión o crea una cuenta corporativa para revisar tu historial de compras y emitir opiniones sobre tus dispositivos.</p>
                <div style="display: flex; gap: var(--space-sm); justify-content: center;">
                    <button class="btn btn-outline" onclick="window.openAuthModal('login')">Iniciar Sesión</button>
                    <button class="btn btn-primary" onclick="window.openAuthModal('register')">Crear Cuenta</button>
                </div>
            </div>
        `;
        return;
    }

    let reviewsHtml = '';
    if (!currentUser.reviews || currentUser.reviews.length === 0) {
        reviewsHtml = '<p style="color: var(--color-text-muted); padding: var(--space-md) 0;">Aún no has emitido evaluaciones sobre tus productos.</p>';
    } else {
        currentUser.reviews.forEach(r => {
            reviewsHtml += `
                <div class="reviews-history-item">
                    <div class="reviews-history-header">
                        <span class="reviews-history-product">${r.productName}</span>
                        <span style="color: #f59e0b; font-weight: 600;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p class="reviews-history-text">"${r.comment}"</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.75rem; color: var(--color-text-muted);">
                        <span>Estado: <strong style="color: var(--color-success);">Publicada</strong></span>
                        <span>${r.date}</span>
                    </div>
                </div>
            `;
        });
    }

    let ordersHtml = '';
    if (!currentUser.orders || currentUser.orders.length === 0) {
        ordersHtml = '<p style="color: var(--color-text-muted); padding: var(--space-md) 0;">No tienes pedidos registrados recientemente.</p>';
    } else {
        currentUser.orders.forEach(o => {
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
    }

    container.innerHTML = `
        <div class="profile-grid-layout">
            <!-- Columna Izquierda: Información de Perfil -->
            <div>
                <div class="profile-card-box">
                    <div class="profile-avatar-large">${currentUser.name.charAt(0)}</div>
                    <div class="profile-name">${currentUser.name}</div>
                    <div class="profile-email">${currentUser.email}</div>
                    <span class="profile-role-tag">${currentUser.role || 'Cliente Corporativo'}</span>
                    
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Organización / Empresa</span>
                        <span class="profile-meta-val">${currentUser.company || 'Empresa Registrada'}</span>
                    </div>
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Pedidos Registrados</span>
                        <span class="profile-meta-val">${currentUser.orders ? currentUser.orders.length : 0}</span>
                    </div>
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Evaluaciones Realizadas</span>
                        <span class="profile-meta-val">${currentUser.reviews ? currentUser.reviews.length : 0}</span>
                    </div>
                    <div style="margin-top: var(--space-lg);">
                        <button class="btn btn-outline" style="width: 100%;" onclick="window.handleLogout()">Cerrar Sesión</button>
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
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md);">Mis Evaluaciones Publicadas</h3>
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

window.filterByCategory = function(category) {
    currentSearch = category;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = category;
    window.switchView('catalog');
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

// Authentication Modal (Tabs: Login / Register)
window.openAuthModal = function(activeTab = 'login') {
    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="auth-modal" class="modal-overlay">
            <div class="modal-content" style="max-width: 460px;">
                <div class="auth-tabs">
                    <button class="auth-tab-btn ${activeTab === 'login' ? 'active' : ''}" onclick="window.switchAuthTab('login')">Iniciar Sesión</button>
                    <button class="auth-tab-btn ${activeTab === 'register' ? 'active' : ''}" onclick="window.switchAuthTab('register')">Crear Cuenta</button>
                </div>
                
                <!-- Tab: Iniciar Sesión -->
                <div id="tab-login-content" style="display: ${activeTab === 'login' ? 'block' : 'none'};">
                    <div class="modal-header">
                        <h3>Bienvenido a NexWork</h3>
                        <p>Ingresa tus credenciales para acceder a tus pedidos y beneficios corporativos.</p>
                    </div>
                    
                    <form onsubmit="window.handleLoginSubmit(event)">
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico</label>
                            <input type="email" id="login-email" class="form-input" placeholder="ejemplo@empresa.com" required value="${currentUser ? currentUser.email : ''}" />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Contraseña</label>
                            <input type="password" id="login-password" class="form-input" placeholder="••••••••" required />
                        </div>

                        <div class="modal-actions" style="margin-top: var(--space-xl);">
                            <button type="button" class="btn btn-ghost" onclick="window.closeModal('auth-modal')">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Entrar a mi Cuenta</button>
                        </div>
                    </form>
                </div>

                <!-- Tab: Crear Cuenta -->
                <div id="tab-register-content" style="display: ${activeTab === 'register' ? 'block' : 'none'};">
                    <div class="modal-header">
                        <h3>Registro de Cuenta Corporativa</h3>
                        <p>Crea tu cuenta para comprar equipamiento de trabajo y publicar reseñas.</p>
                    </div>
                    
                    <form onsubmit="window.handleRegisterSubmit(event)">
                        <div class="form-group">
                            <label class="form-label">Nombre Completo</label>
                            <input type="text" id="reg-name" class="form-input" placeholder="Ing. Alejandro Ruiz" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Correo Electrónico Corporativo</label>
                            <input type="email" id="reg-email" class="form-input" placeholder="nombre@organizacion.com" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nombre de la Empresa</label>
                            <input type="text" id="reg-company" class="form-input" placeholder="Grupo Industrial S.A." required />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Contraseña</label>
                            <input type="password" id="reg-password" class="form-input" placeholder="Mínimo 6 caracteres" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Confirmar Contraseña</label>
                            <input type="password" id="reg-password-confirm" class="form-input" placeholder="Repite tu contraseña" required />
                        </div>

                        <div class="form-group">
                            <label class="form-checkbox-label">
                                <input type="checkbox" id="reg-terms" required />
                                <span>He leído y acepto el <a href="#" onclick="window.openPrivacyModal(); return false;" style="color: var(--color-primary); text-decoration: underline;">Aviso de Privacidad</a> y los Términos de Servicio.</span>
                            </label>
                        </div>

                        <div class="modal-actions" style="margin-top: var(--space-xl);">
                            <button type="button" class="btn btn-ghost" onclick="window.closeModal('auth-modal')">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Registrar Cuenta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    setTimeout(() => {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('active');
    }, 10);
};

window.switchAuthTab = function(tab) {
    const loginTab = document.getElementById('tab-login-content');
    const registerTab = document.getElementById('tab-register-content');
    const tabBtns = document.querySelectorAll('.auth-tab-btn');

    if (tab === 'login') {
        loginTab.style.display = 'block';
        registerTab.style.display = 'none';
        tabBtns[0].classList.add('active');
        tabBtns[1].classList.remove('active');
    } else {
        loginTab.style.display = 'none';
        registerTab.style.display = 'block';
        tabBtns[0].classList.remove('active');
        tabBtns[1].classList.add('active');
    }
};

window.handleLoginSubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        window.showErrorPopup('Usuario No Encontrado', 'El correo electrónico ingresado no se encuentra registrado en nuestro sistema. Por favor verifica tus datos o crea una cuenta nueva.');
        return;
    }

    if (user.password !== password) {
        window.showErrorPopup('Contraseña Incorrecta', 'La contraseña ingresada no coincide con nuestros registros. Por favor inténtalo de nuevo.');
        return;
    }

    currentUser = user;
    window.closeModal('auth-modal');
    renderAuthArea();
    if (currentView === 'profile') {
        renderProfileView();
    }
    window.showToast(`👋 Bienvenido de nuevo, <strong>${user.name}</strong>.`);
};

window.handleRegisterSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const company = document.getElementById('reg-company').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const termsChecked = document.getElementById('reg-terms').checked;

    // Validation checks
    if (!name || !email || !company) {
        window.showErrorPopup('Campos Incompletos', 'Por favor completa todos los campos requeridos para continuar con el registro.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        window.showErrorPopup('Formato de Correo Inválido', 'El correo electrónico ingresado no tiene una estructura válida (ejemplo: usuario@empresa.com).');
        return;
    }

    if (password.length < 6) {
        window.showErrorPopup('Contraseña Muy Corta', 'Por motivos de seguridad, la contraseña debe tener al menos 6 caracteres.');
        return;
    }

    if (password !== passwordConfirm) {
        window.showErrorPopup('Contraseñas No Coinciden', 'La confirmación de la contraseña no coincide con la contraseña escrita. Por favor verifícalas.');
        return;
    }

    if (!termsChecked) {
        window.showErrorPopup('Términos y Privacidad', 'Debes aceptar el Aviso de Privacidad y Términos de Servicio para crear una cuenta.');
        return;
    }

    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        window.showErrorPopup('Cuenta Existente', `Ya existe una cuenta registrada con el correo <strong>${email}</strong>. Por favor inicia sesión.`);
        return;
    }

    // Create and store new user
    const newUser = {
        name: name,
        email: email,
        password: password,
        company: company,
        role: 'Cliente Corporativo',
        orders: [
            { id: 'NX-' + Math.floor(1000 + Math.random() * 9000), product: 'Lumina Bar Pro Smart ScreenBar', date: 'Hoy', total: '$119.00', status: 'En Proceso' }
        ],
        reviews: []
    };

    registeredUsers.push(newUser);
    currentUser = newUser;

    window.closeModal('auth-modal');
    renderAuthArea();
    if (currentView === 'profile') {
        renderProfileView();
    }
    window.showToast(`🎉 ¡Cuenta creada con éxito! Bienvenido a NexWork, <strong>${name}</strong>.`);
};

// Generic Error Alert Pop-up Modal
window.showErrorPopup = function(title, message) {
    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="error-popup-modal" class="modal-overlay">
            <div class="modal-content error-popup-content">
                <div class="error-icon-circle">⚠️</div>
                <h3 class="error-popup-title">${title}</h3>
                <p class="error-popup-text">${message}</p>
                <button class="btn btn-primary" style="width: 100%;" onclick="window.closeModal('error-popup-modal')">Entendido</button>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    setTimeout(() => {
        const modal = document.getElementById('error-popup-modal');
        if (modal) modal.classList.add('active');
    }, 10);
};

// Privacy Notice Modal (Aviso de Privacidad)
window.openPrivacyModal = function() {
    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="privacy-modal" class="modal-overlay">
            <div class="modal-content legal-modal-content">
                <div class="modal-header">
                    <h3>Aviso de Privacidad y Tratamiento de Datos</h3>
                    <p>NexWork Systems Inc. • Última actualización: Septiembre 2026</p>
                </div>
                
                <div class="legal-body-scroll">
                    <div class="legal-section-block">
                        <div class="legal-section-title">1. Identidad y Domicilio del Responsable</div>
                        <p class="legal-section-text">NexWork Systems Inc., con domicilio corporativo en el sector de tecnologías de información, es responsable del tratamiento de los datos personales y opiniones que usted nos proporcione como cliente o usuario de nuestra plataforma de comercio electrónico.</p>
                    </div>

                    <div class="legal-section-block">
                        <div class="legal-section-title">2. Finalidad del Tratamiento de Reseñas y Evaluaciones</div>
                        <p class="legal-section-text">Las opiniones, comentarios y calificaciones por estrellas proporcionadas voluntariamente por los compradores son procesadas con el objetivo exclusivo de mejorar la calidad de nuestros productos, ofrecer soporte post-venta y generar índices de satisfacción y recomendación para futuros clientes corporativos.</p>
                    </div>

                    <div class="legal-section-block">
                        <div class="legal-section-title">3. Anonimización y Seguridad</div>
                        <p class="legal-section-text">Los datos cualitativos se almacenan bajo estrictos protocolos de seguridad y encriptación. No compartimos información financiera ni correos con terceros no autorizados.</p>
                    </div>

                    <div class="legal-section-block">
                        <div class="legal-section-title">4. Derechos ARCO</div>
                        <p class="legal-section-text">Usted tiene derecho en cualquier momento al Acceso, Rectificación, Cancelación u Oposición del tratamiento de sus datos personales y opiniones registradas en su perfil de cliente.</p>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" onclick="window.closeModal('privacy-modal')">Aceptar y Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    setTimeout(() => {
        const modal = document.getElementById('privacy-modal');
        if (modal) modal.classList.add('active');
    }, 10);
};

// Terms of Service Modal
window.openTermsModal = function() {
    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="terms-modal" class="modal-overlay">
            <div class="modal-content legal-modal-content">
                <div class="modal-header">
                    <h3>Términos y Condiciones de Servicio</h3>
                    <p>NexWork Systems Inc. • Garantías y Uso Corporativo</p>
                </div>
                
                <div class="legal-body-scroll">
                    <div class="legal-section-block">
                        <div class="legal-section-title">1. Validez de Órdenes y Envíos</div>
                        <p class="legal-section-text">Todas las compras corporativas emitidas en la plataforma cuentan con factura fiscal, trazabilidad y seguro contra daños de transporte.</p>
                    </div>

                    <div class="legal-section-block">
                        <div class="legal-section-title">2. Política de Reseñas Verificadas</div>
                        <p class="legal-section-text">Para preservar la honestidad del catálogo, únicamente se aceptan evaluaciones constructivas redactadas por clientes que hayan probado el dispositivo.</p>
                    </div>

                    <div class="legal-section-block">
                        <div class="legal-section-title">3. Garantía Corporativa de 3 Años</div>
                        <p class="legal-section-text">Todos los productos distribuidos por NexWork cuentan con reemplazo inmediato ante cualquier defecto de fabricación.</p>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" onclick="window.closeModal('terms-modal')">Comprendido</button>
                </div>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    setTimeout(() => {
        const modal = document.getElementById('terms-modal');
        if (modal) modal.classList.add('active');
    }, 10);
};

// RF-02: Review & Evaluation Modal
window.openReviewModal = function(productId, productName) {
    if (!currentUser) {
        window.openAuthModal('login');
        window.showToast('ℹ️ Por favor inicia sesión o crea una cuenta para dejar tu reseña.');
        return;
    }

    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="review-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Evaluar Producto</h3>
                    <p>Comparte tu experiencia con otros profesionales y compradores corporativos.</p>
                    <div style="font-weight: 700; color: var(--color-primary); margin-top: 6px; font-size: 1.05rem;">${productName}</div>
                </div>
                
                <form id="review-form" onsubmit="window.submitReview(event, ${productId}, '${escapeHtml(productName)}')">
                    <div class="form-group">
                        <label class="form-label">Calificación General</label>
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
                        <label class="form-label">Tu Opinión Detallada</label>
                        <textarea id="review-text" class="form-textarea" placeholder="Escribe sobre la ergonomía, desempeño, calidad de construcción o detalles a considerar..." required></textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" onclick="window.closeModal('review-modal')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Publicar Reseña</button>
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
    
    if (!ratingInput || !commentInput) {
        window.showErrorPopup('Formulario Incompleto', 'Por favor selecciona una calificación con estrellas y escribe un comentario.');
        return;
    }

    const ratingVal = parseInt(ratingInput.value);
    const commentVal = commentInput.value.trim();

    if (commentVal.length < 5) {
        window.showErrorPopup('Opinión Muy Breve', 'Por favor escribe una reseña con al menos 5 caracteres para que sea de utilidad.');
        return;
    }

    // Add to current user reviews history
    if (!currentUser.reviews) currentUser.reviews = [];
    currentUser.reviews.unshift({
        productName: productName,
        rating: ratingVal,
        comment: commentVal,
        date: 'Justo ahora'
    });

    // Update product metrics
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
    window.showToast(`✅ Tu reseña sobre <strong>${productName}</strong> ha sido registrada con éxito.`);
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
