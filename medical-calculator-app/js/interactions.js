// ==========================================
// INTERACTIONS.JS - Drug Interaction Checker
// ==========================================

let selectedDrugs = [];

// Search drug in database
function searchDrug(query) {
  if (query.length < 2) {
    document.getElementById('drug-suggestions').style.display = 'none';
    return;
  }
  
  const suggestions = document.getElementById('drug-suggestions');
  const matches = Object.keys(DRUG_DATABASE).filter(drug => 
    drug.toLowerCase().includes(query.toLowerCase()) ||
    DRUG_DATABASE[drug].name.toLowerCase().includes(query.toLowerCase())
  );
  
  if (matches.length === 0) {
    suggestions.style.display = 'none';
    return;
  }
  
  let html = '';
  matches.slice(0, 10).forEach(drugKey => {
    const drug = DRUG_DATABASE[drugKey];
    html += `
      <div class="drug-suggestion-item" onclick="selectDrug('${drugKey}')">
        <strong>${drug.name}</strong>
        <small>${drug.category}</small>
      </div>
    `;
  });
  
  suggestions.innerHTML = html;
  suggestions.style.display = 'block';
}

// Select drug from suggestions
function selectDrug(drugKey) {
  const drug = DRUG_DATABASE[drugKey];
  
  if (!selectedDrugs.includes(drugKey)) {
    selectedDrugs.push(drugKey);
    updateSelectedDrugs();
  }
  
  document.getElementById('drug-search').value = '';
  document.getElementById('drug-suggestions').style.display = 'none';
}

// Add drug from input
function addDrugToCheck() {
  const input = document.getElementById('drug-search').value.toLowerCase();
  
  const drugKey = Object.keys(DRUG_DATABASE).find(key => 
    key.toLowerCase() === input ||
    DRUG_DATABASE[key].name.toLowerCase() === input
  );
  
  if (drugKey && !selectedDrugs.includes(drugKey)) {
    selectedDrugs.push(drugKey);
    updateSelectedDrugs();
    document.getElementById('drug-search').value = '';
  } else if (!drugKey) {
    showToast('Drug not found in database', 'error');
  } else {
    showToast('Drug already added', 'warning');
  }
}

// Update selected drugs display
function updateSelectedDrugs() {
  const container = document.getElementById('selected-drugs');
  
  let html = '';
  selectedDrugs.forEach(drugKey => {
    const drug = DRUG_DATABASE[drugKey];
    html += `
      <div class="drug-tag">
        ${drug.name}
        <button onclick="removeDrug('${drugKey}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Remove drug from selection
function removeDrug(drugKey) {
  selectedDrugs = selectedDrugs.filter(d => d !== drugKey);
  updateSelectedDrugs();
}

// Check interactions
function checkInteractions() {
  if (selectedDrugs.length < 2) {
    showToast('Please select at least 2 drugs', 'warning');
    return;
  }
  
  const results = [];
  
  // Check all combinations
  for (let i = 0; i < selectedDrugs.length; i++) {
    for (let j = i + 1; j < selectedDrugs.length; j++) {
      const drug1Key = selectedDrugs[i];
      const drug2Key = selectedDrugs[j];
      const drug1 = DRUG_DATABASE[drug1Key];
      const drug2 = DRUG_DATABASE[drug2Key];
      
      // Check if interaction exists
      if (drug1.interactions.includes(drug2Key)) {
        const interactionKey = `${drug1Key}-${drug2Key}`;
        const reverseKey = `${drug2Key}-${drug1Key}`;
        
        const interactionData = DRUG_INTERACTIONS[interactionKey] || 
                               DRUG_INTERACTIONS[reverseKey];
        
        if (interactionData) {
          results.push({
            drug1: drug1.name,
            drug2: drug2.name,
            ...interactionData
          });
        } else {
          // Generic interaction if specific data not available
          results.push({
            drug1: drug1.name,
            drug2: drug2.name,
            severity: 'moderate',
            risk: 'Potential drug interaction',
            mechanism: 'Mechanism not specified. Consult detailed drug interaction references.',
            management: 'Monitor patient closely. Consider alternative therapy if possible.',
            alternatives: []
          });
        }
      }
    }
  }
  
  displayInteractionResults(results);
  
  // Add notification if major interactions found
  const majorCount = results.filter(r => r.severity === 'major').length;
  if (majorCount > 0) {
    notificationStorage.addNotification(
      'warning',
      'Major Drug Interactions Detected',
      `${majorCount} major interaction(s) found among selected drugs`
    );
  }
}

// Display interaction results
function displayInteractionResults(results) {
  const container = document.getElementById('interaction-results');
  
  if (results.length === 0) {
    container.innerHTML = `
      <div class="no-interactions">
        <i class="fas fa-check-circle" style="color: var(--success); font-size: 3rem;"></i>
        <h3>No Major Interactions Detected</h3>
        <p>No significant drug interactions found in our database. However, always consult full prescribing information.</p>
      </div>
    `;
    return;
  }
  
  // Sort by severity
  const severityOrder = { 'major': 1, 'moderate': 2, 'minor': 3 };
  results.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  let html = '<h3 style="margin-bottom: 1rem;">Interaction Results</h3>';
  
  results.forEach(interaction => {
    html += `
      <div class="interaction-item ${interaction.severity}">
        <div class="interaction-header">
          <i class="fas fa-exclamation-circle"></i>
          <h4>${interaction.drug1} + ${interaction.drug2}</h4>
          <span class="severity-badge ${interaction.severity}">
            ${interaction.severity.toUpperCase()}
          </span>
        </div>
        <p><strong>Risk:</strong> ${interaction.risk}</p>
        <p><strong>Mechanism:</strong> ${interaction.mechanism}</p>
        <p><strong>Management:</strong> ${interaction.management}</p>
        ${interaction.alternatives.length > 0 ? `
          <p><strong>Alternatives:</strong></p>
          <ul>
            ${interaction.alternatives.map(alt => `<li>${alt}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Initialize with sample drugs
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('selected-drugs')) {
    selectedDrugs = ['warfarin', 'aspirin'];
    updateSelectedDrugs();
  }
});

// Export
window.searchDrug = searchDrug;
window.selectDrug = selectDrug;
window.addDrugToCheck = addDrugToCheck;
window.removeDrug = removeDrug;
window.checkInteractions = checkInteractions;