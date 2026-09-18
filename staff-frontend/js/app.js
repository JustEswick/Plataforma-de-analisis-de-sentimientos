// app.js
// Controlador Principal del Frontend Staff
// Orquestación de Vistas, Eventos, Modales y Gestión de Estado

document.addEventListener('DOMContentLoaded', () => {
    StaffApp.init();
});

const StaffApp = {
    state: {
        activeTab: 'dashboard',
        selectedTimeRange: '24h',
        categoryFilter: 'all',
        feedFilter: { sentiment: 'all', search: '' },
        currentMetrics: null,
        currentProducts: [],
        currentFeed: [],
        editingProductId: null
    },

    async init() {
        this.bindEvents();
        await this.loadAllData();
        this.startAutoPolling();
    },

    // 1. Enlace de Eventos del DOM
    bindEvents() {
        // Navegación por pestañas
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Selector de rango temporal
        const timeRangeSelect = document.getElementById('timeRangeSelect');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', async (e) => {
                this.state.selectedTimeRange = e.target.value;
                await this.refreshDashboard();
                this.showToast(`Métricas actualizadas para: ${e.target.options[e.target.selectedIndex].text}`);
            });
        }

        // Botón de Sincronizar Telemetría
        const btnSyncTelemetry = document.getElementById('btnSyncTelemetry');
        if (btnSyncTelemetry) {
            btnSyncTelemetry.addEventListener('click', async () => {
                btnSyncTelemetry.classList.add('loading');
                await this.loadAllData();
                btnSyncTelemetry.classList.remove('loading');
                this.showToast('Telemetría y base de datos sincronizadas');
            });
        }

        // Botón de Generar Reporte PDF (RF-04)
        const btnGenerateReport = document.getElementById('btnGenerateReport');
        if (btnGenerateReport) {
            btnGenerateReport.addEventListener('click', () => {
                this.openReportModal();
            });
        }

        // Botón de Nuevo Producto (RF-05)
        const btnOpenAddProduct = document.getElementById('btnOpenAddProduct');
        if (btnOpenAddProduct) {
            btnOpenAddProduct.addEventListener('click', () => {
                this.openAddProductModal();
            });
        }

        // Formularios de Modales
        const formAddProduct = document.getElementById('formAddProduct');
        if (formAddProduct) {
            formAddProduct.addEventListener('submit', (e) => this.handleAddProductSubmit(e));
        }

        const formEditProduct = document.getElementById('formEditProduct');
        if (formEditProduct) {
            formEditProduct.addEventListener('submit', (e) => this.handleEditProductSubmit(e));
        }

        // Filtro de Categoría en la Matriz de Riesgo
        const categoryFilterSelect = document.getElementById('categoryFilterSelect');
        if (categoryFilterSelect) {
            categoryFilterSelect.addEventListener('change', async (e) => {
                this.state.categoryFilter = e.target.value;
                await this.renderSentimentMatrix();
            });
        }

        // Filtros del Live Feed
        const feedSentimentFilter = document.getElementById('feedSentimentFilter');
        if (feedSentimentFilter) {
            feedSentimentFilter.addEventListener('change', async (e) => {
                this.state.feedFilter.sentiment = e.target.value;
                await this.renderLiveFeed();
            });
        }

        const feedSearchInput = document.getElementById('feedSearchInput');
        if (feedSearchInput) {
            feedSearchInput.addEventListener('input', (e) => {
                this.state.feedFilter.search = e.target.value;
                this.renderLiveFeed();
            });
        }

        // Modal de Reporte: Descarga
        const btnDownloadReportPdf = document.getElementById('btnDownloadReportPdf');
        if (btnDownloadReportPdf) {
            btnDownloadReportPdf.addEventListener('click', () => {
                ReportGenerator.downloadPdf();
            });
        }
    },

    // 2. Carga General de Datos
    async loadAllData() {
        await Promise.all([
            this.refreshDashboard(),
            this.renderProductsCrudTable(),
            this.renderLiveFeed()
        ]);
    },

    // 3. Conmutación de Pestañas
    switchTab(tabId) {
        this.state.activeTab = tabId;

        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.tab-view-section').forEach(view => {
            view.classList.toggle('active', view.id === `view-${tabId}`);
        });
    },

    // 4. Renderizado de Dashboard y KPIs (RF-03)
    async refreshDashboard() {
        const [metricsRes, matrixRes] = await Promise.all([
            StaffApiService.getMetricsOverview(this.state.selectedTimeRange),
            StaffApiService.getProductSentimentMatrix(this.state.categoryFilter)
        ]);

        if (metricsRes.success) {
            this.state.currentMetrics = metricsRes.data;
            this.updateKpiCards(metricsRes.data);
            
            // Gráficos
            ChartsEngine.renderSentimentDistribution(
                'sentimentDistChart',
                metricsRes.data.sentimentDistribution.positive,
                metricsRes.data.sentimentDistribution.neutral,
                metricsRes.data.sentimentDistribution.negative
            );

            ChartsEngine.renderDepartmentBars(
                'departmentBarsContainer',
                metricsRes.data.departmentBreakdown
            );
        }

        if (matrixRes.success) {
            this.state.currentProducts = matrixRes.data;
            this.renderSentimentMatrix();
        }
    },

    updateKpiCards(metrics) {
        const elSatisfaction = document.getElementById('kpiSatisfactionVal');
        const elSatisfactionDelta = document.getElementById('kpiSatisfactionDelta');
        const elTotalReviews = document.getElementById('kpiTotalReviewsVal');
        const elCriticalCount = document.getElementById('kpiCriticalCountVal');
        const elEngineStatus = document.getElementById('kpiEngineStatusVal');
        const elEngineLatency = document.getElementById('kpiEngineLatencyVal');

        if (elSatisfaction) elSatisfaction.innerText = `${metrics.satisfactionScore}%`;
        if (elSatisfactionDelta) elSatisfactionDelta.innerText = `${metrics.satisfactionDelta} vs prev`;
        if (elTotalReviews) elTotalReviews.innerText = metrics.totalReviewsProcessed.toLocaleString();
        if (elCriticalCount) elCriticalCount.innerText = metrics.criticalComplaintsCount;
        if (elEngineStatus) elEngineStatus.innerText = metrics.nlpEngineStatus;
        if (elEngineLatency) elEngineLatency.innerText = `${metrics.avgLatencyMs}ms latencia prom.`;
    },

    // 5. Renderizado de la Matriz de Riesgo y Calidad (RF-03)
    async renderSentimentMatrix() {
        const tbody = document.getElementById('sentimentMatrixTableBody');
        if (!tbody) return;

        const res = await StaffApiService.getProductSentimentMatrix(this.state.categoryFilter);
        if (!res.success) return;

        this.state.currentProducts = res.data;

        tbody.innerHTML = res.data.map(p => {
            const isAlert = p.score < 60;
            const badgeClass = p.sentiment;
            const rowHighlight = isAlert ? 'style="background-color: #FFF1F2;"' : '';

            return `
                <tr ${rowHighlight}>
                    <td><code>${p.sku}</code></td>
                    <td>
                        <div style="font-weight: 600; color: var(--color-primary);">${p.name}</div>
                        <div style="font-size: 0.72rem; color: var(--color-text-muted);">${p.desc.substring(0, 50)}...</div>
                    </td>
                    <td>${p.category}</td>
                    <td>
                        <span class="badge-status-pill ${badgeClass}">
                            ${p.score}% (${p.sentimentBreakdown.pos}% / ${p.sentimentBreakdown.neu}% / ${p.sentimentBreakdown.neg}%)
                        </span>
                    </td>
                    <td>
                        <span class="badge-status-pill ${isAlert ? 'negative' : 'neutral'}">
                            ${p.riskTier}
                        </span>
                    </td>
                    <td style="max-width: 260px; font-size: 0.78rem;">${p.topIssue}</td>
                    <td>
                        ${isAlert ? `
                            <button class="table-action-btn danger" onclick="StaffApp.handleEscalate(${p.id})">
                                🚨 Escalar a QA
                            </button>
                        ` : `
                            <button class="table-action-btn" onclick="StaffApp.showToast('Monitoreo nominal para ${p.name}')">
                                Inspeccionar
                            </button>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    },

    // 6. Renderizado del Live Feed de Reseñas (RF-03)
    async renderLiveFeed() {
        const container = document.getElementById('liveFeedContainer');
        if (!container) return;

        const res = await StaffApiService.getReviewsLiveFeed(this.state.feedFilter);
        if (!res.success) return;

        this.state.currentFeed = res.data;

        if (res.data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 32px; color: var(--color-text-muted);">
                    No se encontraron reseñas con los filtros seleccionados.
                </div>
            `;
            return;
        }

        container.innerHTML = res.data.map(item => {
            const isCrit = item.sentiment === 'negative';
            const badgeClass = item.sentiment;
            const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);

            return `
                <div class="feed-card ${isCrit ? 'highlight-critical' : ''}">
                    <div class="feed-card-top">
                        <div class="feed-user-wrap">
                            <span>🔒 ${item.customerMasked}</span>
                            <span class="feed-product-title">↳ ${item.productName}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #F59E0B; font-size: 0.85rem;">${stars}</span>
                            <span class="badge-status-pill ${badgeClass}">${item.sentiment.toUpperCase()} (${item.confidence}% conf.)</span>
                            <span style="font-size: 0.72rem; color: var(--color-text-muted);">${item.date}</span>
                        </div>
                    </div>
                    <div class="feed-comment-text">
                        "${item.text}"
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${item.topics.map(t => `<span class="feed-tag-pill">${t}</span>`).join('')}
                        </div>
                        ${isCrit ? `
                            <button class="table-action-btn danger" style="padding: 2px 8px; font-size: 0.72rem;" onclick="StaffApp.handleEscalate(${item.productId})">
                                ${item.escalated ? '✓ Ticket Asignado' : 'Asignar a Soporte'}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // 7. Renderizado del CRUD de Productos (RF-05)
    async renderProductsCrudTable() {
        const tbody = document.getElementById('productsCrudTableBody');
        if (!tbody) return;

        const res = await StaffApiService.getProductsList();
        if (!res.success) return;

        tbody.innerHTML = res.data.map(p => {
            return `
                <tr>
                    <td><code>${p.sku}</code></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${p.imageUrl}" alt="${p.name}" style="width: 36px; height: 36px; border-radius: 4px; object-fit: cover; border: 1px solid var(--color-border);">
                            <div>
                                <div style="font-weight: 600; color: var(--color-primary);">${p.name}</div>
                                <div style="font-size: 0.72rem; color: var(--color-text-muted);">${p.desc.substring(0, 40)}...</div>
                            </div>
                        </div>
                    </td>
                    <td>${p.category}</td>
                    <td class="tabular-nums" style="font-weight: 600;">${p.price}</td>
                    <td>
                        <span class="badge-status-pill ${p.active ? 'active' : 'inactive'}">
                            ${p.active ? '● Activo' : '○ En Pausa'}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <button class="table-action-btn" onclick="StaffApp.openEditProductModal(${p.id})">
                                ✏️ Editar
                            </button>
                            <button class="table-action-btn" onclick="StaffApp.handleToggleProductStatus(${p.id})">
                                ${p.active ? '⏸️ Pausar' : '▶️ Activar'}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // 8. Modales y Operaciones CRUD (RF-05)
    openAddProductModal() {
        const modal = document.getElementById('modalAddProduct');
        if (modal) {
            document.getElementById('formAddProduct').reset();
            modal.classList.add('show');
        }
    },

    async handleAddProductSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const productData = {
            sku: form.sku.value.trim(),
            name: form.name.value.trim(),
            category: form.category.value,
            price: form.price.value.trim(),
            desc: form.desc.value.trim(),
            imageUrl: form.imageUrl.value.trim()
        };

        const res = await StaffApiService.createProduct(productData);
        if (res.success) {
            this.closeModal('modalAddProduct');
            await this.loadAllData();
            this.showToast(`Producto "${productData.name}" añadido exitosamente.`);
        }
    },

    openEditProductModal(id) {
        const product = staffCatalogState.find(p => p.id === parseInt(id));
        if (!product) return;

        this.state.editingProductId = id;
        const form = document.getElementById('formEditProduct');
        form.editId.value = product.id;
        form.editName.value = product.name;
        form.editCategory.value = product.category;
        form.editPrice.value = product.price;
        form.editDesc.value = product.desc;
        form.editImageUrl.value = product.imageUrl;

        document.getElementById('modalEditProduct').classList.add('show');
    },

    async handleEditProductSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.editId.value;
        const productData = {
            name: form.editName.value.trim(),
            category: form.editCategory.value,
            price: form.editPrice.value.trim(),
            desc: form.editDesc.value.trim(),
            imageUrl: form.editImageUrl.value.trim()
        };

        const res = await StaffApiService.updateProduct(id, productData);
        if (res.success) {
            this.closeModal('modalEditProduct');
            await this.loadAllData();
            this.showToast(`Producto "${productData.name}" actualizado.`);
        }
    },

    async handleToggleProductStatus(id) {
        const res = await StaffApiService.toggleProductStatus(id);
        if (res.success) {
            await this.renderProductsCrudTable();
            this.showToast(`Estado del producto modificado a: ${res.data.active ? 'Activo' : 'En Pausa'}`);
        }
    },

    async handleEscalate(productId) {
        const res = await StaffApiService.escalateProductIssue(productId);
        if (res.success) {
            await this.renderSentimentMatrix();
            await this.renderLiveFeed();
            this.showToast('🚨 Caso escalado inmediatamente al equipo de Control de Calidad.');
        }
    },

    // 9. Reporte PDF (RF-04)
    openReportModal() {
        const modal = document.getElementById('modalReportPreview');
        const container = document.getElementById('reportPreviewContent');
        if (modal && container && this.state.currentMetrics) {
            container.innerHTML = ReportGenerator.generateReportPreview(
                this.state.currentMetrics,
                staffCatalogState
            );
            modal.classList.add('show');
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    },

    // 10. Notificaciones Toast
    showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-alert-item';
        toast.innerHTML = `<span>✓</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    // 11. Polling Periódico para simular ingestión de eventos en vivo
    startAutoPolling() {
        setInterval(async () => {
            if (this.state.activeTab === 'dashboard' || this.state.activeTab === 'feed') {
                await this.renderLiveFeed();
            }
        }, 15000);
    }
};
