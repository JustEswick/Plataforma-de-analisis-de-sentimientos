// reports.js
// Generador y Exportador de Reportes Ejecutivos en PDF para Marketing (RF-04)

const ReportGenerator = {
    // Genera la vista previa interactiva del reporte consolidado en pantalla
    generateReportPreview(metrics, products) {
        const currentDate = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const topProducts = [...products].sort((a, b) => b.score - a.score).slice(0, 3);
        const criticalProducts = products.filter(p => p.score < 70);

        return `
            <div id="printableReportArea" class="printable-report-container">
                <div class="report-print-header">
                    <div>
                        <h1>NexWork Intelligence Suite</h1>
                        <p>Reporte Estadístico Consolidado: Satisfacción de Marca y Tendencias de Producto</p>
                    </div>
                    <div class="report-print-meta">
                        <div><strong>Fecha de Emisión:</strong> ${currentDate}</div>
                        <div><strong>Destinatario:</strong> Dirección de Marketing & Calidad</div>
                        <div><strong>Clasificación:</strong> Confidencial / Corporativo</div>
                    </div>
                </div>

                <div class="report-summary-box">
                    <h3 style="margin-bottom: 8px; font-size: 1.1rem; color: #0F172A;">1. Resumen Ejecutivo de Desempeño</h3>
                    <p style="font-size: 0.88rem; color: #334155; line-height: 1.5;">
                        Durante el período analizado, el ecosistema de procesamiento automatizado con <strong>${metrics.nlpEngineStatus}</strong> 
                        evaluó un total acumulado de <strong>${metrics.totalReviewsProcessed} opiniones</strong> con una tasa de automatización del <strong>${metrics.aiAutomatedRate}</strong>. 
                        El índice global de satisfacción se sitúa en <strong>${metrics.satisfactionScore}%</strong> con una tendencia favorable de <strong>${metrics.satisfactionDelta}</strong>.
                    </p>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px;">
                        <div style="background: #F0FDFA; border: 1px solid #CCFBF1; padding: 10px; border-radius: 6px;">
                            <div style="font-size: 0.75rem; color: #0F766E; font-weight: 600;">POLARIDAD POSITIVA</div>
                            <div style="font-size: 1.4rem; font-weight: 700; color: #0F766E;">${metrics.sentimentDistribution.positive}%</div>
                        </div>
                        <div style="background: #FFFBEB; border: 1px solid #FEF3C7; padding: 10px; border-radius: 6px;">
                            <div style="font-size: 0.75rem; color: #B45309; font-weight: 600;">POLARIDAD NEUTRA</div>
                            <div style="font-size: 1.4rem; font-weight: 700; color: #B45309;">${metrics.sentimentDistribution.neutral}%</div>
                        </div>
                        <div style="background: #FFF1F2; border: 1px solid #FFE4E6; padding: 10px; border-radius: 6px;">
                            <div style="font-size: 0.75rem; color: #BE123C; font-weight: 600;">POLARIDAD CRÍTICA</div>
                            <div style="font-size: 1.4rem; font-weight: 700; color: #BE123C;">${metrics.sentimentDistribution.negative}%</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 8px; font-size: 1rem; color: #0F172A;">2. Matriz de Productos Mejor Calificados (Alta Fidelidad)</h3>
                    <table class="data-table-custom" style="width: 100%; border: 1px solid #E2E8F0; border-radius: 6px;">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Score Positivo</th>
                                <th>Volumen Reseñas</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topProducts.map(p => `
                                <tr>
                                    <td><code>${p.sku}</code></td>
                                    <td><strong>${p.name}</strong></td>
                                    <td>${p.category}</td>
                                    <td><span class="badge-status-pill positive">${p.score}%</span></td>
                                    <td>${p.reviewsCount}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 8px; font-size: 1rem; color: #0F172A;">3. Productos Bajo Alerta y Plan de Acción Urgente</h3>
                    <table class="data-table-custom" style="width: 100%; border: 1px solid #E2E8F0; border-radius: 6px;">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Producto</th>
                                <th>Riesgo / Estado</th>
                                <th>Causa Raíz Identificada por PLN</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${criticalProducts.length > 0 ? criticalProducts.map(p => `
                                <tr>
                                    <td><code>${p.sku}</code></td>
                                    <td><strong>${p.name}</strong></td>
                                    <td><span class="badge-status-pill negative">${p.riskTier}</span></td>
                                    <td>${p.topIssue}</td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="4" style="text-align: center; color: #64748B;">No hay productos con alertas críticas actualmente.</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>

                <div class="report-footer-print">
                    <span>Generado automáticamente por Plataforma de Análisis de Sentimientos (NexWork System)</span>
                    <span>Página 1 de 1</span>
                </div>
            </div>
        `;
    },

    // Ejecuta la impresión / guardado directo como PDF utilizando las directivas CSS de print
    downloadPdf() {
        window.print();
    }
};
