let currentElement = null;

function createPeriodicTable() {
    const tableContainer = document.getElementById('periodicTable');
    
    elementsData.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = `element ${element.category}`;
        elementDiv.style.gridColumn = element.col;
        elementDiv.style.gridRow = element.row;
        
        // Add special styling for lanthanides and actinides
        if (element.row === 9 || element.row === 10) {
            elementDiv.classList.add('rare-earth');
        }
        
        elementDiv.innerHTML = `
            <div class="element-number">${element.number}</div>
            <div class="element-symbol">${element.symbol}</div>
            <div class="element-name">${element.name}</div>
            <div class="element-mass">${element.mass}</div>
            ${element.edsPeaks && element.edsPeaks.length > 0 ? '<div class="eds-indicator"></div>' : ''}
        `;
        
        elementDiv.addEventListener('click', () => openModal(element));
        tableContainer.appendChild(elementDiv);
    });
}

function openModal(element) {
    currentElement = element;
    const modal = document.getElementById('modal');
    
    // Basic information
    document.getElementById('modalSymbol').textContent = element.symbol;
    document.getElementById('modalName').textContent = element.name;
    document.getElementById('modalNumber').textContent = `Atomic Number: ${element.number}`;
    document.getElementById('modalMass').textContent = `${element.mass} u`;
    document.getElementById('modalGroup').textContent = element.group || 'N/A';
    document.getElementById('modalPeriod').textContent = element.period;
    document.getElementById('modalCategory').textContent = element.category.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    document.getElementById('modalElectronConfig').textContent = element.electronConfig;
    
    // Physical properties with proper formatting
    document.getElementById('modalDensity').textContent = element.density ? `${element.density} g/cm³` : 'Unknown';
    document.getElementById('modalMeltingPoint').textContent = element.meltingPoint ? `${element.meltingPoint} K` : 'Unknown';
    document.getElementById('modalBoilingPoint').textContent = element.boilingPoint ? `${element.boilingPoint} K` : 'Unknown';
    document.getElementById('modalElectronegativity').textContent = element.electronegativity || 'N/A';
    document.getElementById('modalOxidationStates').textContent = element.oxidationStates ? element.oxidationStates.join(', ') : 'Unknown';
    
    // Description
    document.getElementById('modalDescription').textContent = element.description;
    
    // Wikipedia link
    const wikipediaLink = document.getElementById('wikipediaLink');
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(element.name)}`;
    wikipediaLink.href = wikipediaUrl;
    wikipediaLink.title = `Learn more about ${element.name} on Wikipedia`;
    
    // EDS analysis
    displayEdsOverview(element);
    displayEdsPeaks(element.edsPeaks || []);
    createEdsChart(element.edsPeaks || []);
    displayEdsTechnicalInfo(element);
    
    modal.style.display = 'block';
}

function displayEdsOverview(element) {
    const summaryContainer = document.getElementById('edsSummary');
    const applicationsContainer = document.getElementById('edsApplications');
    
    const hasEDS = element.edsPeaks && element.edsPeaks.length > 0;
    
    // Summary
    summaryContainer.innerHTML = `
        <h4>📊 Detection Overview</h4>
        <p><strong>Detectability:</strong> ${hasEDS ? 'Readily detectable' : 'Limited/Special conditions'}</p>
        <p><strong>Peaks:</strong> ${hasEDS ? `${element.edsPeaks.length} characteristic lines` : 'Below typical detection limits'}</p>
        <p><strong>Atomic Number:</strong> ${element.number} (${element.number < 11 ? 'Light element' : element.number < 30 ? 'Medium-Z' : 'Heavy element'})</p>
    `;
    
    // Applications
    const applications = getEdsApplications(element);
    applicationsContainer.innerHTML = `
        <h4>🔬 EDS Applications</h4>
        ${applications.map(app => `<p>• ${app}</p>`).join('')}
    `;
}

function getEdsApplications(element) {
    const applications = {
        'Fe': ['Steel analysis', 'Corrosion studies', 'Metallurgy QC'],
        'Al': ['Aerospace alloys', 'Automotive parts', 'Construction materials'],
        'Cu': ['Electronics PCBs', 'Wiring analysis', 'Bronze/brass alloys'],
        'Ti': ['Biomedical implants', 'Aerospace components', 'Corrosion coatings'],
        'Cr': ['Stainless steel', 'Chrome plating', 'Refractory materials'],
        'Ni': ['Superalloys', 'Catalysts', 'Electroplating'],
        'Zn': ['Galvanized coatings', 'Die-cast parts', 'Brass analysis'],
        'Si': ['Semiconductor wafers', 'Solar cells', 'Glass analysis'],
        'Ca': ['Biological samples', 'Concrete analysis', 'Mineral studies'],
        'Mg': ['Lightweight alloys', 'Biological systems', 'Refractory materials'],
        'Au': ['Jewelry authentication', 'Electronic contacts', 'Dental alloys'],
        'Ag': ['Electronics', 'Photography materials', 'Antimicrobial coatings'],
        'Pb': ['Environmental analysis', 'Paint studies', 'Battery components'],
        'Sn': ['Solder analysis', 'Tin plating', 'Bronze alloys'],
        'W': ['Tungsten carbide tools', 'Filaments', 'Heavy alloys'],
        'Mo': ['High-temp alloys', 'Catalysts', 'Electronics'],
        'Co': ['Superalloys', 'Permanent magnets', 'Catalysts'],
        'Mn': ['Steel production', 'Battery materials', 'Chemical catalysts'],
        'V': ['Steel additives', 'Catalysts', 'Aerospace alloys'],
        'Ta': ['Capacitors', 'Surgical implants', 'Chemical equipment'],
        'Nb': ['Superconductors', 'Steel additives', 'Electronics']
    };
    
    return applications[element.symbol] || [
        'Material identification',
        'Compositional analysis', 
        'Quality control testing'
    ];
}

function displayEdsPeaks(peaks) {
    const peaksContainer = document.getElementById('edsPeaks');
    peaksContainer.innerHTML = '';
    
    if (!peaks || peaks.length === 0) {
        peaksContainer.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 20px;">⚠️ No significant EDS peaks detected for this element</p>';
        return;
    }
    
    peaks.forEach((peak, index) => {
        const peakElement = document.createElement('div');
        peakElement.className = 'eds-peak';
        const lineType = index === 0 ? 'Kα' : index === 1 ? 'Kβ' : `L${index-1}`;
        peakElement.textContent = `${peak} keV (${lineType})`;
        peakElement.style.animationDelay = `${index * 0.1}s`;
        peakElement.title = `${lineType} line at ${peak} keV - Click for details`;
        peaksContainer.appendChild(peakElement);
    });
}

function createEdsChart(peaks) {
    const chartContainer = document.getElementById('edsChart');
    chartContainer.innerHTML = '';
    
    if (!peaks || peaks.length === 0) {
        chartContainer.innerHTML = `
            <div style="text-align: center; padding: 60px; color: #999; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6;">
                <div style="font-size: 2em; margin-bottom: 10px;">📊</div>
                <p><strong>No EDS Spectrum Available</strong></p>
                <p style="font-size: 0.9em; margin-top: 5px;">This element may have peaks below detection limits or requires special conditions for analysis.</p>
            </div>
        `;
        return;
    }
    
    // Create enhanced chart with better visualization
    const maxPeak = Math.max(...peaks);
    const minPeak = Math.min(...peaks);
    const chartHeight = 180;
    
    const chartTitle = document.createElement('div');
    chartTitle.style.textAlign = 'center';
    chartTitle.style.marginBottom = '15px';
    chartTitle.style.fontWeight = 'bold';
    chartTitle.style.color = '#ff8f00';
    chartTitle.innerHTML = `EDS Spectrum - ${currentElement.name} (${currentElement.symbol})`;
    
    const chart = document.createElement('div');
    chart.style.position = 'relative';
    chart.style.height = `${chartHeight}px`;
    chart.style.display = 'flex';
    chart.style.alignItems = 'flex-end';
    chart.style.justifyContent = 'center';
    chart.style.gap = '8px';
    chart.style.background = 'linear-gradient(to top, #1a1a1a, #2d2d2d)';
    chart.style.borderRadius = '8px';
    chart.style.padding = '15px';
    chart.style.border = '2px solid #ff8f00';
    
    peaks.forEach((peak, index) => {
        const barHeight = (peak / maxPeak) * (chartHeight - 60);
        const intensity = (peak / maxPeak * 100).toFixed(1);
        
        const barContainer = document.createElement('div');
        barContainer.style.position = 'relative';
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.style.cursor = 'pointer';
        
        const bar = document.createElement('div');
        bar.style.width = '25px';
        bar.style.height = `${barHeight}px`;
        bar.style.background = `linear-gradient(to top, #ff6b35, #ffab00, #fff59d)`;
        bar.style.borderRadius = '4px 4px 0 0';
        bar.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.5)';
        bar.style.transition = 'all 0.3s ease';
        bar.style.position = 'relative';
        bar.style.overflow = 'hidden';
        bar.title = `${peak} keV - Intensity: ${intensity}%`;
        
        // Add glow effect
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.right = '0';
        glow.style.bottom = '0';
        glow.style.background = 'linear-gradient(to top, transparent, rgba(255, 255, 255, 0.3))';
        glow.style.opacity = '0';
        glow.style.transition = 'opacity 0.3s ease';
        
        bar.appendChild(glow);
        
        const label = document.createElement('div');
        label.textContent = `${peak}`;
        label.style.fontSize = '0.7em';
        label.style.color = '#fff';
        label.style.marginTop = '5px';
        label.style.fontWeight = 'bold';
        label.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
        
        const intensityLabel = document.createElement('div');
        intensityLabel.textContent = `${intensity}%`;
        intensityLabel.style.fontSize = '0.6em';
        intensityLabel.style.color = '#ffa726';
        intensityLabel.style.fontWeight = 'bold';
        
        // Hover effects
        barContainer.addEventListener('mouseenter', () => {
            bar.style.transform = 'scale(1.1)';
            bar.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.8)';
            glow.style.opacity = '1';
        });
        
        barContainer.addEventListener('mouseleave', () => {
            bar.style.transform = 'scale(1)';
            bar.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.5)';
            glow.style.opacity = '0';
        });
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        barContainer.appendChild(intensityLabel);
        chart.appendChild(barContainer);
    });
    
    // Add axis labels
    const xAxisLabel = document.createElement('div');
    xAxisLabel.style.position = 'absolute';
    xAxisLabel.style.bottom = '-35px';
    xAxisLabel.style.left = '50%';
    xAxisLabel.style.transform = 'translateX(-50%)';
    xAxisLabel.style.fontSize = '0.9em';
    xAxisLabel.style.color = '#ff8f00';
    xAxisLabel.style.fontWeight = 'bold';
    xAxisLabel.textContent = 'Energy (keV)';
    
    const yAxisLabel = document.createElement('div');
    yAxisLabel.style.position = 'absolute';
    yAxisLabel.style.left = '-25px';
    yAxisLabel.style.top = '50%';
    yAxisLabel.style.transform = 'translateY(-50%) rotate(-90deg)';
    yAxisLabel.style.fontSize = '0.8em';
    yAxisLabel.style.color = '#ff8f00';
    yAxisLabel.style.fontWeight = 'bold';
    yAxisLabel.textContent = 'Intensity';
    
    chart.appendChild(xAxisLabel);
    chart.appendChild(yAxisLabel);
    
    chartContainer.appendChild(chartTitle);
    chartContainer.appendChild(chart);
    
    // Add spectrum info
    const spectrumInfo = document.createElement('div');
    spectrumInfo.style.marginTop = '45px';
    spectrumInfo.style.marginBottom = '20px';
    spectrumInfo.style.padding = '12px';
    spectrumInfo.style.background = 'rgba(255, 143, 0, 0.15)';
    spectrumInfo.style.borderRadius = '8px';
    spectrumInfo.style.fontSize = '0.85em';
    spectrumInfo.style.color = '#666';
    spectrumInfo.style.border = '1px dashed #ffa726';
    spectrumInfo.style.position = 'relative';
    spectrumInfo.style.zIndex = '2';
    spectrumInfo.style.clear = 'both';
    
    const peakTypes = peaks.map((peak, i) => {
        const type = i === 0 ? 'Kα₁' : i === 1 ? 'Kβ₁' : `L${i-1}`;
        return `${type} (${peak} keV)`;
    }).join(', ');
    
    spectrumInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>📈 Spectrum Analysis</strong></span>
            <span style="color: #ff8f00; font-weight: bold;">${peaks.length} peaks detected</span>
        </div>
        <div style="font-size: 0.8em; line-height: 1.4;">
            <div><strong>Peak Lines:</strong> ${peakTypes}</div>
            <div><strong>Energy Range:</strong> ${minPeak} - ${maxPeak} keV</div>
            <div><strong>Primary Line:</strong> ${peaks[0]} keV (${((peaks[0]/maxPeak) * 100).toFixed(1)}% relative intensity)</div>
            <div><strong>Detection Limit:</strong> ~${(0.1 * currentElement.number/26).toFixed(3)}% by weight</div>
        </div>
    `;
    
    chartContainer.appendChild(spectrumInfo);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    createPeriodicTable();
    
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});

function displayEdsTechnicalInfo(element) {
    const technicalContainer = document.getElementById('edsTechnical');
    const hasEDS = element.edsPeaks && element.edsPeaks.length > 0;
    
    if (!hasEDS) {
        technicalContainer.innerHTML = `
            <h4>⚙️ Technical Notes</h4>
            <p style="color: #ffa726; font-style: italic;">This element requires special detection conditions or has peaks below typical EDS detection limits (~0.1%). Consider using WDS (Wavelength Dispersive Spectroscopy) for light elements (Z < 11).</p>
        `;
        return;
    }
    
    const atomicWeight = element.mass;
    const detectionLimit = (0.1 * element.number / 26).toFixed(3);
    const peakSeparation = element.edsPeaks.length > 1 ? (element.edsPeaks[1] - element.edsPeaks[0]).toFixed(2) : 'N/A';
    const kEdgeEnergy = element.edsPeaks[0] * 1.1; // Approximate K-edge
    
    technicalContainer.innerHTML = `
        <h4>⚙️ Technical Specifications</h4>
        <div class="tech-grid">
            <div class="tech-item">
                <div class="tech-label">Detection Limit</div>
                <div class="tech-value">~${detectionLimit}% by weight</div>
            </div>
            <div class="tech-item">
                <div class="tech-label">Peak Separation</div>
                <div class="tech-value">${peakSeparation} keV (Kα-Kβ)</div>
            </div>
            <div class="tech-item">
                <div class="tech-label">K-Edge Energy</div>
                <div class="tech-value">~${kEdgeEnergy.toFixed(1)} keV</div>
            </div>
            <div class="tech-item">
                <div class="tech-label">Atomic Weight</div>
                <div class="tech-value">${atomicWeight} u</div>
            </div>
        </div>
        <div style="margin-top: 12px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px;">
            <div style="color: #ffa726; font-size: 0.9em; font-weight: bold;">💡 Analysis Tips:</div>
            <div style="font-size: 0.8em; line-height: 1.4; margin-top: 4px;">
                • Use ${element.number < 20 ? '10-15 kV' : element.number < 40 ? '20-25 kV' : '25-30 kV'} accelerating voltage<br>
                • Optimize for ${element.edsPeaks[0] < 5 ? 'light element detection' : element.edsPeaks[0] < 15 ? 'medium-Z analysis' : 'heavy element analysis'}<br>
                • ${element.number < 11 ? 'Consider carbon coating to reduce charging' : 'Standard sample preparation adequate'}
            </div>
        </div>
    `;
}

window.addEventListener('resize', function() {
    if (currentElement && document.getElementById('modal').style.display === 'block') {
        setTimeout(() => createEdsChart(currentElement.edsPeaks || []), 100);
    }
});