// charts.js
// Visual Render Engine para Gráficos y Métricas de Sentimiento (RF-03)

const ChartsEngine = {
    // Renderiza la barra segmentada de distribución global de sentimientos
    renderSentimentDistribution(containerId, posPct, neuPct, negPct) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="sentiment-bar-segmented" title="Positivo: ${posPct}%, Neutro: ${neuPct}%, Negativo: ${negPct}%">
                <div class="sentiment-seg-pos" style="width: ${posPct}%;"></div>
                <div class="sentiment-seg-neu" style="width: ${neuPct}%;"></div>
                <div class="sentiment-seg-neg" style="width: ${negPct}%;"></div>
            </div>
            <div class="sentiment-legend-grid">
                <div class="legend-card pos">
                    <span class="legend-title">Positivo</span>
                    <span class="legend-value tabular-nums">${posPct}%</span>
                </div>
                <div class="legend-card neu">
                    <span class="legend-title">Neutro</span>
                    <span class="legend-value tabular-nums">${neuPct}%</span>
                </div>
                <div class="legend-card neg">
                    <span class="legend-title">Negativo</span>
                    <span class="legend-value tabular-nums">${negPct}%</span>
                </div>
            </div>
        `;
    },

    // Renderiza la lista comparativa por departamentos de productos
    renderDepartmentBars(containerId, departments) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = departments.map(dept => {
            const isAlert = dept.score < 60;
            const barColor = isAlert ? 'var(--color-sentiment-neg)' : 'var(--color-accent-indigo)';
            const badgeClass = isAlert ? 'negative' : 'positive';

            return `
                <div class="dept-item">
                    <div class="dept-item-header">
                        <span>${dept.name}</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="badge-status-pill ${badgeClass}">${dept.status}</span>
                            <span class="tabular-nums" style="font-weight: 700;">${dept.score}%</span>
                        </div>
                    </div>
                    <div class="dept-bar-track">
                        <div class="dept-bar-fill" style="width: ${dept.score}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }
};
