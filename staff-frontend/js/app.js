// app.js
// NexWork Systems - Controlador Principal del Panel Administrativo (Staff)
// Diseñado para alta accesibilidad y facilidad de uso por personal operativo

document.addEventListener('DOMContentLoaded', () => {
    StaffApp.init();
});

const StaffApp = {
    state: {
        activeTab: 'dashboard',
        selectedTimeRange: '24h',
        categoryFilter: 'all',
        alertsFilter: 'unresolved',
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

        // Botón de Sincronizar Datos
        const btnSyncTelemetry = document.getElementById('btnSyncTelemetry');
        if (btnSyncTelemetry) {
            btnSyncTelemetry.addEventListener('click', async () => {
                btnSyncTelemetry.classList.add('loading');
                await this.loadAllData();
                btnSyncTelemetry.classList.remove('loading');
                this.showToast('Datos sincronizados con la tienda en línea');
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

        // Filtros del Módulo de Alertas
        const alertsStatusFilter = document.getElementById('alertsStatusFilter');
        if (alertsStatusFilter) {
            alertsStatusFilter.addEventListener('change', async (e) => {
                this.state.alertsFilter = e.target.value;
                await this.renderAlertsSection();
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
            this.renderAlertsSection(),
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
        const elAlertBadgeCount = document.getElementById('alertBadgeCount');

        if (elSatisfaction) elSatisfaction.innerText = `${metrics.satisfactionScore}%`;
        if (elSatisfactionDelta) elSatisfactionDelta.innerText = `${metrics.satisfactionDelta} vs semana anterior`;
        if (elTotalReviews) elTotalReviews.innerText = metrics.totalReviewsProcessed.toLocaleString();
        if (elCriticalCount) elCriticalCount.innerText = metrics.criticalComplaintsCount;
        if (elEngineStatus) elEngineStatus.innerText = metrics.nlpEngineStatus;
        if (elEngineLatency) elEngineLatency.innerText = `${metrics.avgLatencyMs}ms tiempo de respuesta`;

        // Actualizar el distintivo en la pestaña de Alertas
        if (elAlertBadgeCount) {
            elAlertBadgeCount.innerText = metrics.criticalComplaintsCount;
            elAlertBadgeCount.style.display = metrics.criticalComplaintsCount > 0 ? 'inline-block' : 'none';
        }
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
                        <div style="font-size: 0.76rem; color: var(--color-text-muted);">${p.desc.substring(0, 50)}...</div>
                    </td>
                    <td>${p.category}</td>
                    <td>
                        <span class="badge-status-pill ${badgeClass}">
                            ${p.score}% Aprobación
                        </span>
                    </td>
                    <td>
                        <span class="badge-status-pill ${isAlert ? 'negative' : 'neutral'}">
                            ${p.riskTier}
                        </span>
                    </td>
                    <td style="max-width: 260px; font-size: 0.8rem;">${p.topIssue}</td>
                    <td>
                        ${isAlert ? `
                            <button class="table-action-btn danger" onclick="StaffApp.switchTab('alerts')">
                                🚨 Ver Quejas Urgentes
                            </button>
                        ` : `
                            <button class="table-action-btn" onclick="StaffApp.showToast('Producto en estado nominal: ${p.name}')">
                                Inspeccionar
                            </button>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    },

    // 6. Renderizado de la Sección de Alertas y Quejas (Seguimiento Oficial)
    async renderAlertsSection() {
        const container = document.getElementById('alertsListContainer');
        if (!container) return;

        const res = await StaffApiService.getReviewsLiveFeed({});
        if (!res.success) return;

        let negativeReviews = res.data.filter(r => r.sentiment === 'negative');

        if (this.state.alertsFilter === 'unresolved') {
            negativeReviews = negativeReviews.filter(r => !r.resolved);
        } else if (this.state.alertsFilter === 'resolved') {
            negativeReviews = negativeReviews.filter(r => r.resolved);
        }

        if (negativeReviews.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #F0FDFA; border: 1px solid #CCFBF1; border-radius: 8px;">
                    <div style="font-size: 1.5rem; margin-bottom: 8px;">🎉</div>
                    <div style="font-weight: 700; color: #0F766E; font-size: 1rem;">¡Excelente! No hay alertas de emergencia pendientes por resolver.</div>
                    <div style="color: #64748B; font-size: 0.84rem; margin-top: 4px;">Todas las quejas han sido atendidas o descartadas por el equipo de moderación.</div>
                </div>
            `;
            return;
        }

        container.innerHTML = negativeReviews.map(item => {
            return `
                <div class="feed-card ${item.resolved ? 'card-resolved' : 'highlight-critical'}">
                    <div class="feed-card-top">
                        <div class="feed-user-wrap">
                            <span>🚨 Alerta de Calidad: <strong>${item.productName}</strong></span>
                            <span style="font-size: 0.78rem; color: #64748B;">• Cliente: 🔒 ${item.customerMasked}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="badge-status-pill ${item.resolved ? 'resolved' : 'negative'}">
                                ${item.resolved ? '✓ Caso Resuelto / Atendido' : '🚨 Pendiente por Atender'}
                            </span>
                            <span style="font-size: 0.75rem; color: var(--color-text-muted);">${item.date}</span>
                        </div>
                    </div>
                    <div class="feed-comment-text" style="font-weight: 500;">
                        "${item.text}"
                    </div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
                        ${item.topics.map(t => `<span class="feed-tag-pill">${t}</span>`).join('')}
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--color-border);">
                        <div style="font-size: 0.78rem; color: #475569;">
                            ${item.notifiedSlack ? '✓ <strong>Notificación enviada al canal #soporte-qa y correo</strong>' : 'ℹ️ Notificación Push disponible para el equipo'}
                        </div>
                        <div style="display: flex; gap: 8px;">
                            ${!item.notifiedSlack ? `
                                <button class="table-action-btn" onclick="StaffApp.handleNotifySlack('${item.id}')">
                                    📢 Notificar a Soporte (Slack)
                                </button>
                            ` : ''}
                            ${!item.resolved ? `
                                <button class="table-action-btn danger" onclick="StaffApp.handlePauseProduct(${item.productId})">
                                    ⏸️ Pausar Producto en Tienda
                                </button>
                                <button class="table-action-btn success" onclick="StaffApp.handleResolveAlert('${item.id}')">
                                    ✓ Marcar como Atendida
                                </button>
                            ` : `
                                <span style="font-size: 0.78rem; color: #059669; font-weight: 600;">✓ Caso Archivado</span>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // 7. Renderizado del Live Feed de Reseñas (RF-03)
    async renderLiveFeed() {
        const container = document.getElementById('liveFeedContainer');
        if (!container) return;

        const res = await StaffApiService.getReviewsLiveFeed(this.state.feedFilter);
        if (!res.success) return;

        this.state.currentFeed = res.data;

        if (res.data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 32px; color: var(--color-text-muted);">
                    No se encontraron opiniones con los filtros seleccionados.
                </div>
            `;
            return;
        }

        container.innerHTML = res.data.map(item => {
            const isCrit = item.sentiment === 'negative';
            const badgeClass = item.sentiment;
            const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);

            return `
                <div class="feed-card ${isCrit ? (item.resolved ? 'card-resolved' : 'highlight-critical') : ''}">
                    <div class="feed-card-top">
                        <div class="feed-user-wrap">
                            <span>🔒 ${item.customerMasked}</span>
                            <span class="feed-product-title">↳ ${item.productName}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: #F59E0B; font-size: 0.9rem;">${stars}</span>
                            <span class="badge-status-pill ${badgeClass}">${item.sentiment === 'positive' ? 'Positivo' : (item.sentiment === 'neutral' ? 'Neutro' : 'Queja Crítica')}</span>
                            <span style="font-size: 0.75rem; color: var(--color-text-muted);">${item.date}</span>
                        </div>
                    </div>
                    <div class="feed-comment-text">
                        "${item.text}"
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${item.topics.map(t => `<span class="feed-tag-pill">${t}</span>`).join('')}
                        </div>
                        ${isCrit && !item.resolved ? `
                            <button class="table-action-btn success" style="padding: 3px 8px; font-size: 0.74rem;" onclick="StaffApp.handleResolveAlert('${item.id}')">
                                ✓ Resolver Queja
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // 8. Renderizado del CRUD de Productos (RF-05)
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
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${p.imageUrl}" alt="${p.name}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover; border: 1px solid var(--color-border);">
                            <div>
                                <div style="font-weight: 600; color: var(--color-primary);">${p.name}</div>
                                <div style="font-size: 0.74rem; color: var(--color-text-muted);">${p.desc.substring(0, 45)}...</div>
                            </div>
                        </div>
                    </td>
                    <td>${p.category}</td>
                    <td class="tabular-nums" style="font-weight: 600;">${p.price}</td>
                    <td>
                        <span class="badge-status-pill ${p.active ? 'active' : 'inactive'}">
                            ${p.active ? '● Disponible en Tienda' : '○ Pausado / Oculto'}
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

    // 9. Modales y Operaciones CRUD (RF-05)
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
            this.showToast(`Producto "${productData.name}" añadido al catálogo.`);
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
            this.showToast(`El producto ahora está: ${res.data.active ? 'Disponible en Tienda' : 'Pausado'}`);
        }
    },

    // 10. Acciones de Resolución de Alertas y Notificaciones (Descarte)
    async handleResolveAlert(reviewId) {
        const res = await StaffApiService.resolveReviewAlert(reviewId);
        if (res.success) {
            await this.refreshDashboard();
            await this.renderAlertsSection();
            await this.renderLiveFeed();
            this.showToast('✓ Queja marcada como atendida. El contador de emergencias ha disminuido.');
        }
    },

    async handleNotifySlack(reviewId) {
        const res = await StaffApiService.notifySupportSlack(reviewId);
        if (res.success) {
            await this.renderAlertsSection();
            this.showToast(res.message);
        }
    },

    async handlePauseProduct(productId) {
        const product = staffCatalogState.find(p => p.id === productId);
        if (product && product.active) {
            await StaffApiService.toggleProductStatus(productId);
            await this.loadAllData();
            this.showToast(`⚠️ Producto "${product.name}" pausado temporalmente en la tienda.`);
        }
    },

    // 11. Reporte PDF (RF-04)
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

    // 12. Notificaciones Toast
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

    // 13. Polling Periódico
    startAutoPolling() {
        setInterval(async () => {
            if (this.state.activeTab === 'dashboard' || this.state.activeTab === 'feed') {
                await this.renderLiveFeed();
            }
        }, 15000);
    }
};
