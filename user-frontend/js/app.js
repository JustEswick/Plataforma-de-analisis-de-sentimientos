// app.js
// Main entry point for the frontend application

document.addEventListener('DOMContentLoaded', () => {
    console.log('Eswick - Frontend App initialized');
    initApp();
});

function initApp() {
    renderMockProducts();
}

function renderMockProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const mockProducts = [
        { id: 1, name: 'Aura Studio Master II Monitor', desc: 'Monitor 6K Retina con calibración de color. Calidad de construcción excepcional.', sentiment: 'positive', score: 98, price: '$1,890.00' },
        { id: 2, name: 'Strata Desk Frame', desc: 'Escritorio motorizado con telemetría anti-colisión.', sentiment: 'neutral', score: 72, price: '$1,150.00' },
        { id: 3, name: 'Vessel Task Chair', desc: 'Silla ergonómica con malla auto-ajustable lumbar.', sentiment: 'positive', score: 91, price: '$980.00' },
        { id: 4, name: 'Apex Pro Studio Mic', desc: 'Micrófono condensador con interfaz híbrida XLR/USB-C.', sentiment: 'negative', score: 44, price: '$410.00' },
    ];

    let html = '';
    
    mockProducts.forEach((product, index) => {
        let badgeClass = 'badge-sentiment-neutral';
        let sentimentText = 'Neutral';
        
        if (product.sentiment === 'positive') {
            badgeClass = 'badge-sentiment-positive';
            sentimentText = 'Positivo';
        } else if (product.sentiment === 'negative') {
            badgeClass = 'badge-sentiment-negative';
            sentimentText = 'Crítico';
        }
        
        const delayClass = `stagger-${(index % 5) + 1}`;

        html += `
            <article class="product-card slide-up ${delayClass}">
                <div class="product-image-container">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </div>
                <div class="product-details">
                    <div style="margin-bottom: var(--space-sm);">
                        <span class="badge ${badgeClass}">${product.score}% ${sentimentText}</span>
                    </div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.desc}</p>
                    
                    <div class="product-footer">
                        <span class="product-price">${product.price}</span>
                        <button class="btn btn-primary" onclick="window.openReviewModal(${product.id}, '${product.name}')">Reseñar</button>
                    </div>
                </div>
            </article>
        `;
    });

    grid.innerHTML = html;
}

// Global function to open modal
window.openReviewModal = function(productId, productName) {
    const modalContainer = document.getElementById('modal-container');
    
    const modalHtml = `
        <div id="review-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Evaluar Producto</h3>
                    <p>${productName}</p>
                </div>
                
                <form id="review-form" onsubmit="window.submitReview(event)">
                    <div class="form-group">
                        <label class="form-label">Calificación (RF-02)</label>
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
                        <label class="form-label">Opinión detallada</label>
                        <textarea class="form-textarea" placeholder="Escribe tu experiencia con el producto..." required></textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-ghost" onclick="window.closeModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Enviar Evaluación</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHtml;
    
    // Trigger animation
    setTimeout(() => {
        document.getElementById('review-modal').classList.add('active');
    }, 10);
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

window.submitReview = function(e) {
    e.preventDefault();
    window.closeModal();
    window.showToast('✅ Evaluación recibida y enviada a análisis de sentimiento.');
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
