// ==========================================
// CALCULATORS.JS - Medical Calculator Functions
// ==========================================

// Calculator Definitions
const CALCULATORS = {
  // === BMI Calculator ===
  bmi: {
    name: 'BMI Calculator',
    category: 'general',
    icon: 'fa-weight',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, max: 500, required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, max: 250, required: true }
    ],
    calculate: (data) => {
      const weight = parseFloat(data.weight);
      const height = parseFloat(data.height) / 100; // Convert to meters
      const bmi = weight / (height * height);
      
      let category = '';
      let color = '';
      
      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'info';
      } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'success';
      } else if (bmi < 30) {
        category = 'Overweight';
        color = 'warning';
      } else {
        category = 'Obese';
        color = 'danger';
      }
      
      return {
        value: bmi.toFixed(1),
        unit: 'kg/m²',
        category: category,
        color: color,
        interpretation: `BMI of ${bmi.toFixed(1)} indicates ${category}`,
        details: [
          'Underweight: < 18.5',
          'Normal: 18.5 - 24.9',
          'Overweight: 25 - 29.9',
          'Obese: ≥ 30'
        ]
      };
    }
  },

  // === BSA Calculator ===
  bsa: {
    name: 'Body Surface Area (BSA)',
    category: 'general',
    icon: 'fa-user',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, max: 500, required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, max: 250, required: true },
      { id: 'formula', label: 'Formula', type: 'select', options: ['Mosteller', 'DuBois'], required: true }
    ],
    calculate: (data) => {
      const weight = parseFloat(data.weight);
      const height = parseFloat(data.height);
      let bsa;
      
      if (data.formula === 'Mosteller') {
        bsa = Math.sqrt((height * weight) / 3600);
      } else {
        bsa = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
      }
      
      return {
        value: bsa.toFixed(2),
        unit: 'm²',
        category: data.formula + ' Formula',
        interpretation: `Body Surface Area: ${bsa.toFixed(2)} m²`,
        details: [
          'Used for drug dosing, especially chemotherapy',
          'Normal adult BSA: 1.7 - 2.0 m²'
        ]
      };
    }
  },

  // === Ideal Body Weight ===
  ibw: {
    name: 'Ideal Body Weight (IBW)',
    category: 'general',
    icon: 'fa-balance-scale',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, max: 250, required: true }
    ],
    calculate: (data) => {
      const height = parseFloat(data.height);
      const heightInches = height / 2.54;
      let ibw;
      
      if (data.gender === 'Male') {
        ibw = 50 + 2.3 * (heightInches - 60);
      } else {
        ibw = 45.5 + 2.3 * (heightInches - 60);
      }
      
      return {
        value: ibw.toFixed(1),
        unit: 'kg',
        interpretation: `Ideal Body Weight: ${ibw.toFixed(1)} kg`,
        details: [
          'Based on Devine formula',
          'Used for drug dosing calculations',
          'Especially important for aminoglycosides, vancomycin'
        ]
      };
    }
  },

  // === Creatinine Clearance ===
  crcl: {
    name: 'Creatinine Clearance (CrCl)',
    category: 'nephro',
    icon: 'fa-kidneys',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, required: true },
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, max: 500, required: true },
      { id: 'scr', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 20, step: 0.1, required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true }
    ],
    calculate: (data) => {
      const age = parseFloat(data.age);
      const weight = parseFloat(data.weight);
      const scr = parseFloat(data.scr);
      const genderMultiplier = data.gender === 'Female' ? 0.85 : 1;
      
      const crcl = ((140 - age) * weight * genderMultiplier) / (72 * scr);
      
      let stage = '';
      let color = '';
      
      if (crcl >= 90) {
        stage = 'Normal (Stage 1)';
        color = 'success';
      } else if (crcl >= 60) {
        stage = 'Mild (Stage 2)';
        color = 'success';
      } else if (crcl >= 30) {
        stage = 'Moderate (Stage 3)';
        color = 'warning';
      } else if (crcl >= 15) {
        stage = 'Severe (Stage 4)';
        color = 'danger';
      } else {
        stage = 'Kidney Failure (Stage 5)';
        color = 'danger';
      }
      
      return {
        value: crcl.toFixed(1),
        unit: 'mL/min',
        category: stage,
        color: color,
        interpretation: `CrCl: ${crcl.toFixed(1)} mL/min - ${stage}`,
        warning: crcl < 60 ? 'Dose adjustment may be required for renally eliminated drugs' : null,
        details: [
          'Cockcroft-Gault Formula',
          'Normal: ≥ 90 mL/min',
          'Mild impairment: 60-89 mL/min',
          'Moderate: 30-59 mL/min',
          'Severe: 15-29 mL/min',
          'Kidney failure: < 15 mL/min'
        ]
      };
    }
  },

  // === eGFR Calculator ===
  egfr: {
    name: 'eGFR Calculator',
    category: 'nephro',
    icon: 'fa-chart-line',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 120, required: true },
      { id: 'scr', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 20, step: 0.1, required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'race', label: 'Race', type: 'select', options: ['Black', 'Non-Black'], required: true }
    ],
    calculate: (data) => {
      const age = parseFloat(data.age);
      const scr = parseFloat(data.scr);
      const isFemale = data.gender === 'Female';
      const isBlack = data.race === 'Black';
      
      // CKD-EPI formula
      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.329 : -0.411;
      const minValue = Math.min(scr / kappa, 1);
      const maxValue = Math.max(scr / kappa, 1);
      
      let egfr = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * Math.pow(0.993, age);
      
      if (isFemale) egfr *= 1.018;
      if (isBlack) egfr *= 1.159;
      
      let stage = '';
      let color = '';
      
      if (egfr >= 90) {
        stage = 'G1 - Normal';
        color = 'success';
      } else if (egfr >= 60) {
        stage = 'G2 - Mildly decreased';
        color = 'success';
      } else if (egfr >= 45) {
        stage = 'G3a - Mild to moderate';
        color = 'warning';
      } else if (egfr >= 30) {
        stage = 'G3b - Moderate to severe';
        color = 'warning';
      } else if (egfr >= 15) {
        stage = 'G4 - Severely decreased';
        color = 'danger';
      } else {
        stage = 'G5 - Kidney failure';
        color = 'danger';
      }
      
      return {
        value: egfr.toFixed(1),
        unit: 'mL/min/1.73m²',
        category: stage,
        color: color,
        interpretation: `eGFR: ${egfr.toFixed(1)} mL/min/1.73m² - CKD ${stage}`,
        details: [
          'CKD-EPI Formula',
          'More accurate than MDRD',
          'G1: ≥ 90',
          'G2: 60-89',
          'G3a: 45-59',
          'G3b: 30-44',
          'G4: 15-29',
          'G5: < 15'
        ]
      };
    }
  },

  // === Mean Arterial Pressure ===
  map: {
    name: 'Mean Arterial Pressure (MAP)',
    category: 'general',
    icon: 'fa-heartbeat',
    inputs: [
      { id: 'sbp', label: 'Systolic BP', type: 'number', unit: 'mmHg', min: 50, max: 300, required: true },
      { id: 'dbp', label: 'Diastolic BP', type: 'number', unit: 'mmHg', min: 30, max: 200, required: true }
    ],
    calculate: (data) => {
      const sbp = parseFloat(data.sbp);
      const dbp = parseFloat(data.dbp);
      
      const map = dbp + (sbp - dbp) / 3;
      
      let interpretation = '';
      let color = '';
      
      if (map < 60) {
        interpretation = 'Low - Risk of inadequate organ perfusion';
        color = 'danger';
      } else if (map < 70) {
        interpretation = 'Below optimal - Monitor closely';
        color = 'warning';
      } else if (map <= 100) {
        interpretation = 'Normal range';
        color = 'success';
      } else {
        interpretation = 'Elevated - May require treatment';
        color = 'warning';
      }
      
      return {
        value: map.toFixed(0),
        unit: 'mmHg',
        color: color,
        interpretation: `MAP: ${map.toFixed(0)} mmHg - ${interpretation}`,
        details: [
          'Target MAP: 65-100 mmHg',
          'Critical threshold: < 60 mmHg',
          'Optimal for organ perfusion: 70-100 mmHg'
        ]
      };
    }
  },

  // === Corrected Calcium ===
  'corrected-calcium': {
    name: 'Corrected Calcium',
    category: 'general',
    icon: 'fa-flask',
    inputs: [
      { id: 'calcium', label: 'Serum Calcium', type: 'number', unit: 'mg/dL', min: 1, max: 20, step: 0.1, required: true },
      { id: 'albumin', label: 'Serum Albumin', type: 'number', unit: 'g/dL', min: 1, max: 6, step: 0.1, required: true }
    ],
    calculate: (data) => {
      const calcium = parseFloat(data.calcium);
      const albumin = parseFloat(data.albumin);
      
      const correctedCa = calcium + 0.8 * (4 - albumin);
      
      let status = '';
      let color = '';
      
      if (correctedCa < 8.5) {
        status = 'Hypocalcemia';
        color = 'warning';
      } else if (correctedCa <= 10.5) {
        status = 'Normal';
        color = 'success';
      } else {
        status = 'Hypercalcemia';
        color = 'danger';
      }
      
      return {
        value: correctedCa.toFixed(1),
        unit: 'mg/dL',
        category: status,
        color: color,
        interpretation: `Corrected Calcium: ${correctedCa.toFixed(1)} mg/dL - ${status}`,
        details: [
          'Normal range: 8.5-10.5 mg/dL',
          'Correction accounts for low albumin',
          'Formula: Ca + 0.8 × (4 - Albumin)'
        ]
      };
    }
  },

  // === Anion Gap ===
  'anion-gap': {
    name: 'Anion Gap',
    category: 'general',
    icon: 'fa-vial',
    inputs: [
      { id: 'sodium', label: 'Sodium (Na+)', type: 'number', unit: 'mEq/L', min: 100, max: 200, required: true },
      { id: 'chloride', label: 'Chloride (Cl-)', type: 'number', unit: 'mEq/L', min: 50, max: 150, required: true },
      { id: 'bicarbonate', label: 'Bicarbonate (HCO3-)', type: 'number', unit: 'mEq/L', min: 5, max: 50, required: true }
    ],
    calculate: (data) => {
      const na = parseFloat(data.sodium);
      const cl = parseFloat(data.chloride);
      const hco3 = parseFloat(data.bicarbonate);
      
      const ag = na - (cl + hco3);
      
      let category = '';
      let color = '';
      
      if (ag < 8) {
        category = 'Low anion gap';
        color = 'info';
      } else if (ag <= 12) {
        category = 'Normal';
        color = 'success';
      } else if (ag <= 20) {
        category = 'High normal / Mild elevation';
        color = 'warning';
      } else {
        category = 'Elevated - MUDPILES causes';
        color = 'danger';
      }
      
      return {
        value: ag.toFixed(1),
        unit: 'mEq/L',
        category: category,
        color: color,
        interpretation: `Anion Gap: ${ag.toFixed(1)} mEq/L - ${category}`,
        details: [
          'Normal: 8-12 mEq/L',
          'High AG acidosis (MUDPILES):',
          '• Methanol',
          '• Uremia',
          '• DKA',
          '• Propylene glycol',
          '• Iron/Isoniazid',
          '• Lactic acidosis',
          '• Ethylene glycol',
          '• Salicylates'
        ]
      };
    }
  },

  // === Glasgow Coma Scale ===
  gcs: {
    name: 'Glasgow Coma Scale (GCS)',
    category: 'general',
    icon: 'fa-brain',
    inputs: [
      { 
        id: 'eye', 
        label: 'Eye Opening', 
        type: 'select', 
        options: [
          '4 - Spontaneous',
          '3 - To speech',
          '2 - To pain',
          '1 - None'
        ], 
        required: true 
      },
      { 
        id: 'verbal', 
        label: 'Verbal Response', 
        type: 'select', 
        options: [
          '5 - Oriented',
          '4 - Confused',
          '3 - Inappropriate words',
          '2 - Incomprehensible sounds',
          '1 - None'
        ], 
        required: true 
      },
      { 
        id: 'motor', 
        label: 'Motor Response', 
        type: 'select', 
        options: [
          '6 - Obeys commands',
          '5 - Localizes pain',
          '4 - Withdraws from pain',
          '3 - Flexion to pain',
          '2 - Extension to pain',
          '1 - None'
        ], 
        required: true 
      }
    ],
    calculate: (data) => {
      const eye = parseInt(data.eye.charAt(0));
      const verbal = parseInt(data.verbal.charAt(0));
      const motor = parseInt(data.motor.charAt(0));
      
      const total = eye + verbal + motor;
      
      let severity = '';
      let color = '';
      
      if (total >= 13) {
        severity = 'Mild injury';
        color = 'success';
      } else if (total >= 9) {
        severity = 'Moderate injury';
        color = 'warning';
      } else {
        severity = 'Severe injury';
        color = 'danger';
      }
      
      return {
        value: total,
        unit: 'points',
        category: severity,
        color: color,
        interpretation: `GCS: ${total}/15 - ${severity}`,
        breakdown: `E${eye} V${verbal} M${motor}`,
        details: [
          'Severe: 3-8',
          'Moderate: 9-12',
          'Mild: 13-15',
          'Score < 8 typically requires intubation'
        ]
      };
    }
  }
};

// Open Calculator Modal
function openCalculator(calcId) {
  const calculator = CALCULATORS[calcId];
  if (!calculator) {
    showToast('Calculator not found', 'error');
    return;
  }

  const modal = document.getElementById('calculator-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('calculator-content');

  title.innerHTML = `<i class="fas ${calculator.icon}"></i> ${calculator.name}`;

  // Build form HTML
  let formHTML = `
    <form id="calc-form" onsubmit="calculateResult(event, '${calcId}')">
  `;

  calculator.inputs.forEach(input => {
    formHTML += `<div class="form-group">`;
    formHTML += `<label>${input.label}${input.unit ? ` (${input.unit})` : ''}</label>`;

    if (input.type === 'select') {
      formHTML += `<select id="${input.id}" required>`;
      formHTML += `<option value="">Select...</option>`;
      input.options.forEach(option => {
        formHTML += `<option value="${option}">${option}</option>`;
      });
      formHTML += `</select>`;
    } else {
      formHTML += `<input 
        type="${input.type}" 
        id="${input.id}" 
        ${input.min !== undefined ? `min="${input.min}"` : ''}
        ${input.max !== undefined ? `max="${input.max}"` : ''}
        ${input.step !== undefined ? `step="${input.step}"` : ''}
        ${input.required ? 'required' : ''}
        placeholder="Enter ${input.label.toLowerCase()}"
      >`;
    }

    formHTML += `</div>`;
  });

  formHTML += `
      <button type="submit" class="btn-primary">
        <i class="fas fa-calculator"></i> Calculate
      </button>
    </form>
    <div id="calc-result" class="calc-result" style="display:none; margin-top: 2rem;"></div>
  `;

  content.innerHTML = formHTML;
  modal.classList.add('active');
}

// Calculate Result
function calculateResult(event, calcId) {
  event.preventDefault();

  const calculator = CALCULATORS[calcId];
  const formData = {};

  calculator.inputs.forEach(input => {
    formData[input.id] = document.getElementById(input.id).value;
  });

  const result = calculator.calculate(formData);

  // Display result
  const resultDiv = document.getElementById('calc-result');
  
  let resultHTML = `
    <div class="result-card ${result.color || ''}">
      <div class="result-main">
        <div class="result-value">${result.value} <span class="result-unit">${result.unit}</span></div>
        ${result.category ? `<div class="result-category">${result.category}</div>` : ''}
        ${result.breakdown ? `<div class="result-breakdown">${result.breakdown}</div>` : ''}
      </div>
      <div class="result-interpretation">${result.interpretation}</div>
      ${result.warning ? `<div class="result-warning"><i class="fas fa-exclamation-triangle"></i> ${result.warning}</div>` : ''}
      ${result.details ? `
        <div class="result-details">
          <strong>Reference:</strong>
          <ul>
            ${result.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      <div class="result-actions">
        <button onclick="saveCalculation('${calcId}', ${JSON.stringify(formData).replace(/"/g, '&quot;')}, ${JSON.stringify(result).replace(/"/g, '&quot;')})" class="btn-secondary">
          <i class="fas fa-save"></i> Save to History
        </button>
        <button onclick="printResult()" class="btn-secondary">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  `;

  resultDiv.innerHTML = resultHTML;
  resultDiv.style.display = 'block';
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Save calculation to history
function saveCalculation(calcId, data, result) {
  const calculator = CALCULATORS[calcId];
  data.name = calculator.name;
  
  calcStorage.saveCalculation(calcId, data, result);
  showToast('Calculation saved to history', 'success');
  loadHistory();
}

// Close Calculator Modal
function closeCalculator() {
  document.getElementById('calculator-modal').classList.remove('active');
}

// Print result
function printResult() {
  window.print();
}

// Export for use
window.CALCULATORS = CALCULATORS;
window.openCalculator = openCalculator;
window.calculateResult = calculateResult;
window.closeCalculator = closeCalculator;
window.saveCalculation = saveCalculation;