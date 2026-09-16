// app.js
// Main entry point for the User Frontend Application (RF-01 & RF-02)

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
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80',
        imageSvg: `<svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="180" fill="#0F172A"/>
            <rect x="50" y="25" width="220" height="120" rx="4" stroke="#475569" stroke-width="3" fill="#1E293B"/>
            <rect x="56" y="31" width="208" height="108" rx="2" fill="url(#screen-grad-1)"/>
            <rect x="152" y="145" width="16" height="20" fill="#64748B"/>
            <rect x="130" y="165" width="60" height="4" rx="2" fill="#94A3B8"/>
            <defs>
                <linearGradient id="screen-grad-1" x1="56" y1="31" x2="264" y2="139" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#3B82F6" stop-opacity="0.8"/>
                    <stop offset="1" stop-color="#8B5CF6" stop-opacity="0.8"/>
                </linearGradient>
            </defs>
        </svg>`
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
        imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=700&auto=format&fit=crop&q=80',
        imageSvg: `<svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="180" fill="#F8FAFC"/>
            <rect x="40" y="70" width="240" height="12" rx="3" fill="#334155"/>
            <rect x="60" y="82" width="14" height="75" fill="#64748B"/>
            <rect x="246" y="82" width="14" height="75" fill="#64748B"/>
            <rect x="45" y="157" width="44" height="6" rx="2" fill="#475569"/>
            <rect x="231" y="157" width="44" height="6" rx="2" fill="#475569"/>
        </svg>`
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
        imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a8a37f714b?w=700&auto=format&fit=crop&q=80',
        imageSvg: `<svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="180" fill="#F1F5F9"/>
            <path d="M140 30 C140 25, 180 25, 180 30 L176 80 L144 80 Z" fill="#334155"/>
            <rect x="135" y="80" width="50" height="12" rx="4" fill="#1E293B"/>
            <rect x="156" y="92" width="8" height="45" fill="#64748B"/>
            <line x1="160" y1="137" x2="135" y2="155" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
            <line x1="160" y1="137" x2="185" y2="155" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
        </svg>`
    },
    {
        id: 4,
        name: 'NovaCraft Pro Wireless Keyboard',
        category: 'Periféricos',
        desc: 'Teclado mecánico custom inalámbrico 75% con chasis de aluminio CNC, switches lubricados de fábrica e insonorización por capas.',
        sentiment: 'positive',
        score: 93,
        rating: 4.8,
        reviewsCount: 312,
        sentimentBreakdown: { pos: 93, neu: 5, neg: 2 },
        price: '$235.00',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80',
        imageSvg: `<svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="180" fill="#0F172A"/>
            <rect x="45" y="45" width="230" height="90" rx="8" fill="#1E293B" stroke="#334155" stroke-width="2"/>
            <rect x="55" y="55" width="210" height="70" rx="4" fill="#0F172A"/>
            <circle cx="80" cy="75" r="5" fill="#38BDF8"/>
            <circle cx="100" cy="75" r="5" fill="#38BDF8"/>
            <circle cx="120" cy="75" r="5" fill="#38BDF8"/>
            <circle cx="140" cy="75" r="5" fill="#38BDF8"/>
            <rect x="110" y="105" width="100" height="10" rx="3" fill="#38BDF8"/>
        </svg>`
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
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80',
        imageSvg: `<svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="180" fill="#1E293B"/>
            <rect x="145" y="30" width="30" height="60" rx="15" fill="#475569" stroke="#94A3B8" stroke-width="2"/>
            <rect x="156" y="90" width="8" height="40" fill="#94A3B8"/>
            <circle cx="160" cy="145" r="22" stroke="#94A3B8" stroke-width="4" fill="none"/>
        </svg>`
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
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
        imageSvg: `<svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="180" fill="#F8FAFC"/>
            <path d="M110 90 A 50 50 0 0 1 210 90" stroke="#1E293B" stroke-width="8" fill="none" stroke-linecap="round"/>
            <rect x="95" y="80" width="22" height="45" rx="10" fill="#334155"/>
            <rect x="203" y="80" width="22" height="45" rx="10" fill="#334155"/>
        </svg>`
    }
];

// User submitted reviews state
let userReviewsHistory = [
    {
        productName: 'Aura Studio Master II 32" Display',
        rating: 5,
        comment: 'La nitidez y reproducción cromática son impecables para flujos de diseño y desarrollo continuo.',
        detectedSentiment: 'Positivo (98%)',
        date: 'Hace 2 horas'
    }
];

let currentFilter = 'all';
let currentSearch = '';

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Eswick - User Frontend App Ready');
    initApp();
    setupNavEvents();
});

function initApp() {
    renderProducts();
}

function setupNavEvents() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (index === 1) {
                // Mis Evaluaciones
                openMyReviewsModal();
            } else {
                // Catálogo Enterprise
                filterBySentiment('all');
            }
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Filter by sentiment and search keyword
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
                <div class="product-image-container">
                    <span class="product-category-tag">${product.category}</span>
                    <img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'product-category-tag\\'>${product.category}</span>' + \`${product.imageSvg}\`;" />
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
                        <button class="btn btn-primary" onclick="window.openReviewModal(${product.id}, '${escapeHtml(product.name)}')">Evaluar (RF-02)</button>
                    </div>
                </div>
            </article>
        `;
    });

    grid.innerHTML = html;
}

// Global Filter Handlers
window.filterBySentiment = function(type) {
    currentFilter = type;
    
    // Update active class on buttons
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

// RF-02: Review & Sentiment Evaluation Modal
window.openReviewModal = function(productId, productName) {
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
                        <label class="form-label">Calificación Cuantitativa (RF-02)</label>
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
                        <button type="button" class="btn btn-ghost" onclick="window.closeModal()">Cancelar</button>
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

window.closeModal = function() {
    const modal = document.getElementById('review-modal');
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

    // Determine sentiment for local mock update
    let detectedTag = 'Positivo (95%)';
    if (ratingVal <= 2) detectedTag = 'Crítico (88%)';
    else if (ratingVal === 3) detectedTag = 'Neutral (72%)';

    // Store in history
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

    window.closeModal();
    window.showToast(`✅ Evaluación registrada exitosamente para <strong>${productName}</strong>.`);
    renderProducts();
};

// Modal for "Mis Evaluaciones"
window.openMyReviewsModal = function() {
    const modalContainer = document.getElementById('modal-container');
    
    let listHtml = '';
    if (userReviewsHistory.length === 0) {
        listHtml = '<p style="color: var(--color-text-muted); text-align: center; padding: var(--space-lg);">Aún no has registrado evaluaciones.</p>';
    } else {
        userReviewsHistory.forEach(item => {
            listHtml += `
                <div class="reviews-history-item">
                    <div class="reviews-history-header">
                        <span class="reviews-history-product">${item.productName}</span>
                        <span style="color: #f59e0b; font-weight: 600;">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</span>
                    </div>
                    <p class="reviews-history-text">"${item.comment}"</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.75rem; color: var(--color-text-muted);">
                        <span>Sentimiento clasificado: <strong>${item.detectedSentiment}</strong></span>
                        <span>${item.date}</span>
                    </div>
                </div>
            `;
        });
    }

    const modalHtml = `
        <div id="review-modal" class="modal-overlay">
            <div class="modal-content" style="max-width: 580px;">
                <div class="modal-header">
                    <h3>Mis Evaluaciones Registradas</h3>
                    <p>Historial de retroalimentación analizada por la plataforma de análisis de sentimientos.</p>
                </div>
                
                <div style="max-height: 360px; overflow-y: auto; padding-right: 4px;">
                    ${listHtml}
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" onclick="window.closeModal()">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    modalContainer.innerHTML = modalHtml;
    setTimeout(() => {
        const modal = document.getElementById('review-modal');
        if (modal) modal.classList.add('active');
    }, 10);
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
