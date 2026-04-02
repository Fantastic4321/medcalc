// ==========================================
// CALCULATORS.JS - SESSION 1
// 30+ common medical calculators
// ==========================================

const CALCULATORS = {
  // GENERAL
  bmi: {
    name: 'BMI',
    category: 'general',
    icon: 'fa-weight',
    description: 'Body Mass Index',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', required: true }
    ],
    calculate: d => {
      const w = +d.weight, h = +d.height / 100;
      const bmi = w / (h * h);
      let cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
      return resultObj(bmi.toFixed(1), 'kg/m²', `BMI: ${bmi.toFixed(1)} (${cat})`, cat);
    }
  },

  bsa: {
    name: 'BSA',
    category: 'general',
    icon: 'fa-user',
    description: 'Body Surface Area (Mosteller)',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', required: true }
    ],
    calculate: d => {
      const bsa = Math.sqrt((+d.weight * +d.height) / 3600);
      return resultObj(bsa.toFixed(2), 'm²', `BSA: ${bsa.toFixed(2)} m²`);
    }
  },

  ibw: {
    name: 'IBW',
    category: 'general',
    icon: 'fa-balance-scale',
    description: 'Ideal Body Weight',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', required: true }
    ],
    calculate: d => {
      const inches = +d.height / 2.54;
      let ibw = d.gender === 'Male' ? 50 + 2.3 * (inches - 60) : 45.5 + 2.3 * (inches - 60);
      return resultObj(ibw.toFixed(1), 'kg', `IBW: ${ibw.toFixed(1)} kg`);
    }
  },

  ajbw: {
    name: 'Adjusted Body Weight',
    category: 'general',
    icon: 'fa-weight-scale',
    description: 'Adjusted body weight',
    inputs: [
      { id: 'actual', label: 'Actual Weight', type: 'number', unit: 'kg', required: true },
      { id: 'ibw', label: 'Ideal Body Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const ajbw = +d.ibw + 0.4 * (+d.actual - +d.ibw);
      return resultObj(ajbw.toFixed(1), 'kg', `Adjusted Body Weight: ${ajbw.toFixed(1)} kg`);
    }
  },

  lbw: {
    name: 'Lean Body Weight',
    category: 'general',
    icon: 'fa-person',
    description: 'Lean body weight',
    inputs: [
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', required: true }
    ],
    calculate: d => {
      const w = +d.weight, h = +d.height;
      let lbw = d.gender === 'Male'
        ? (9270 * w) / (6680 + 216 * (w / Math.pow(h / 100, 2)))
        : (9270 * w) / (8780 + 244 * (w / Math.pow(h / 100, 2)));
      return resultObj(lbw.toFixed(1), 'kg', `Lean Body Weight: ${lbw.toFixed(1)} kg`);
    }
  },

  map: {
    name: 'MAP',
    category: 'general',
    icon: 'fa-heartbeat',
    description: 'Mean Arterial Pressure',
    inputs: [
      { id: 'sbp', label: 'Systolic BP', type: 'number', unit: 'mmHg', required: true },
      { id: 'dbp', label: 'Diastolic BP', type: 'number', unit: 'mmHg', required: true }
    ],
    calculate: d => {
      const map = (+d.dbp) + ((+d.sbp - +d.dbp) / 3);
      return resultObj(map.toFixed(0), 'mmHg', `MAP: ${map.toFixed(0)} mmHg`);
    }
  },

  correctedCalcium: {
    name: 'Corrected Calcium',
    category: 'general',
    icon: 'fa-flask',
    description: 'Albumin-corrected calcium',
    inputs: [
      { id: 'calcium', label: 'Total Calcium', type: 'number', unit: 'mg/dL', required: true },
      { id: 'albumin', label: 'Albumin', type: 'number', unit: 'g/dL', required: true }
    ],
    calculate: d => {
      const ca = +d.calcium + 0.8 * (4 - +d.albumin);
      return resultObj(ca.toFixed(1), 'mg/dL', `Corrected Calcium: ${ca.toFixed(1)} mg/dL`);
    }
  },

  anionGap: {
    name: 'Anion Gap',
    category: 'general',
    icon: 'fa-vial',
    description: 'Anion gap',
    inputs: [
      { id: 'na', label: 'Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'cl', label: 'Cl', type: 'number', unit: 'mEq/L', required: true },
      { id: 'hco3', label: 'HCO₃', type: 'number', unit: 'mEq/L', required: true }
    ],
    calculate: d => {
      const ag = +d.na - (+d.cl + +d.hco3);
      return resultObj(ag.toFixed(1), 'mEq/L', `Anion Gap: ${ag.toFixed(1)} mEq/L`);
    }
  },

  correctedSodium: {
    name: 'Corrected Sodium',
    category: 'general',
    icon: 'fa-droplet',
    description: 'Sodium corrected for hyperglycemia',
    inputs: [
      { id: 'na', label: 'Measured Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'glucose', label: 'Glucose', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const corrected = +d.na + 1.6 * ((+d.glucose - 100) / 100);
      return resultObj(corrected.toFixed(1), 'mEq/L', `Corrected Sodium: ${corrected.toFixed(1)} mEq/L`);
    }
  },

  serumOsm: {
    name: 'Serum Osmolality',
    category: 'general',
    icon: 'fa-beaker',
    description: 'Calculated serum osmolality',
    inputs: [
      { id: 'na', label: 'Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'glucose', label: 'Glucose', type: 'number', unit: 'mg/dL', required: true },
      { id: 'bun', label: 'BUN', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const osm = (2 * +d.na) + (+d.glucose / 18) + (+d.bun / 2.8);
      return resultObj(osm.toFixed(1), 'mOsm/kg', `Calculated serum osmolality: ${osm.toFixed(1)} mOsm/kg`);
    }
  },

  freeWaterDeficit: {
    name: 'Free Water Deficit',
    category: 'general',
    icon: 'fa-tint',
    description: 'Hypernatremia water deficit',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'na', label: 'Current Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true }
    ],
    calculate: d => {
      const tbw = (+d.weight) * (d.gender === 'Male' ? 0.6 : 0.5);
      const deficit = tbw * ((+d.na / 140) - 1);
      return resultObj(deficit.toFixed(2), 'L', `Free water deficit: ${deficit.toFixed(2)} L`);
    }
  },

  fluidMaintenanceAdult: {
    name: 'Fluid Maintenance',
    category: 'general',
    icon: 'fa-tint',
    description: '4-2-1 rule',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const w = +d.weight;
      let rate = 0;
      if (w <= 10) rate = w * 4;
      else if (w <= 20) rate = 40 + ((w - 10) * 2);
      else rate = 60 + (w - 20);
      return resultObj(rate.toFixed(0), 'mL/hr', `Maintenance fluid rate: ${rate.toFixed(0)} mL/hr`);
    }
  },

  gcs: {
    name: 'GCS',
    category: 'general',
    icon: 'fa-brain',
    description: 'Glasgow Coma Scale',
    inputs: [
      { id: 'eye', label: 'Eye', type: 'select', options: ['4', '3', '2', '1'], required: true },
      { id: 'verbal', label: 'Verbal', type: 'select', options: ['5', '4', '3', '2', '1'], required: true },
      { id: 'motor', label: 'Motor', type: 'select', options: ['6', '5', '4', '3', '2', '1'], required: true }
    ],
    calculate: d => {
      const total = +d.eye + +d.verbal + +d.motor;
      return resultObj(total, '/15', `GCS: ${total}/15`, `E${d.eye} V${d.verbal} M${d.motor}`);
    }
  },

  // RENAL
  crcl: {
    name: 'Creatinine Clearance',
    category: 'nephro',
    icon: 'fa-kidneys',
    description: 'Cockcroft-Gault',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', required: true },
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'scr', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true }
    ],
    calculate: d => {
      let crcl = ((140 - +d.age) * +d.weight) / (72 * +d.scr);
      if (d.gender === 'Female') crcl *= 0.85;
      return resultObj(crcl.toFixed(1), 'mL/min', `CrCl: ${crcl.toFixed(1)} mL/min`);
    }
  },

  egfr: {
    name: 'eGFR',
    category: 'nephro',
    icon: 'fa-chart-line',
    description: 'CKD-EPI simplified',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', required: true },
      { id: 'scr', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true }
    ],
    calculate: d => {
      const age = +d.age, scr = +d.scr;
      const isFemale = d.gender === 'Female';
      const k = isFemale ? 0.7 : 0.9;
      const a = isFemale ? -0.329 : -0.411;
      let egfr = 141 * Math.pow(Math.min(scr / k, 1), a) * Math.pow(Math.max(scr / k, 1), -1.209) * Math.pow(0.993, age);
      if (isFemale) egfr *= 1.018;
      return resultObj(egfr.toFixed(1), 'mL/min/1.73m²', `eGFR: ${egfr.toFixed(1)} mL/min/1.73m²`);
    }
  },

  bunCrRatio: {
    name: 'BUN/Cr Ratio',
    category: 'nephro',
    icon: 'fa-percent',
    description: 'BUN to creatinine ratio',
    inputs: [
      { id: 'bun', label: 'BUN', type: 'number', unit: 'mg/dL', required: true },
      { id: 'cr', label: 'Creatinine', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const ratio = +d.bun / +d.cr;
      return resultObj(ratio.toFixed(1), '', `BUN/Cr Ratio: ${ratio.toFixed(1)}`);
    }
  },

  fena: {
    name: 'FeNa',
    category: 'nephro',
    icon: 'fa-percentage',
    description: 'Fractional excretion of sodium',
    inputs: [
      { id: 'urineNa', label: 'Urine Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'plasmaNa', label: 'Plasma Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'urineCr', label: 'Urine Cr', type: 'number', unit: 'mg/dL', required: true },
      { id: 'plasmaCr', label: 'Plasma Cr', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const fena = ((+d.urineNa * +d.plasmaCr) / (+d.plasmaNa * +d.urineCr)) * 100;
      return resultObj(fena.toFixed(2), '%', `FeNa: ${fena.toFixed(2)}%`);
    }
  },

  urineOutput: {
    name: 'Urine Output',
    category: 'nephro',
    icon: 'fa-toilet',
    description: 'mL/kg/hr',
    inputs: [
      { id: 'urine', label: 'Urine Output', type: 'number', unit: 'mL', required: true },
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'hours', label: 'Hours', type: 'number', unit: 'hr', required: true }
    ],
    calculate: d => {
      const rate = +d.urine / (+d.weight * +d.hours);
      return resultObj(rate.toFixed(2), 'mL/kg/hr', `Urine output: ${rate.toFixed(2)} mL/kg/hr`);
    }
  },

  // CARDIO
  qtc: {
    name: 'QTc',
    category: 'cardio',
    icon: 'fa-wave-square',
    description: 'Bazett correction',
    inputs: [
      { id: 'qt', label: 'QT Interval', type: 'number', unit: 'ms', required: true },
      { id: 'rr', label: 'RR Interval', type: 'number', unit: 'sec', required: true }
    ],
    calculate: d => {
      const qtc = +d.qt / Math.sqrt(+d.rr);
      return resultObj(qtc.toFixed(0), 'ms', `QTc (Bazett): ${qtc.toFixed(0)} ms`);
    }
  },

  chadsvasc: {
    name: 'CHA₂DS₂-VASc',
    category: 'cardio',
    icon: 'fa-heart',
    description: 'Stroke risk in AF',
    inputs: [
      { id: 'chf', label: 'CHF', type: 'select', options: ['0', '1'], required: true },
      { id: 'htn', label: 'Hypertension', type: 'select', options: ['0', '1'], required: true },
      { id: 'age75', label: 'Age ≥ 75', type: 'select', options: ['0', '2'], required: true },
      { id: 'dm', label: 'Diabetes', type: 'select', options: ['0', '1'], required: true },
      { id: 'stroke', label: 'Stroke/TIA/TE', type: 'select', options: ['0', '2'], required: true },
      { id: 'vascular', label: 'Vascular disease', type: 'select', options: ['0', '1'], required: true },
      { id: 'age65', label: 'Age 65-74', type: 'select', options: ['0', '1'], required: true },
      { id: 'sex', label: 'Female sex', type: 'select', options: ['0', '1'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return resultObj(score, 'points', `CHA₂DS₂-VASc Score: ${score}`);
    }
  },

  hasbled: {
    name: 'HAS-BLED',
    category: 'cardio',
    icon: 'fa-droplet',
    description: 'Bleeding risk',
    inputs: [
      { id: 'htn', label: 'Hypertension', type: 'select', options: ['0', '1'], required: true },
      { id: 'renal', label: 'Renal disease', type: 'select', options: ['0', '1'], required: true },
      { id: 'liver', label: 'Liver disease', type: 'select', options: ['0', '1'], required: true },
      { id: 'stroke', label: 'Stroke', type: 'select', options: ['0', '1'], required: true },
      { id: 'bleed', label: 'Bleeding history', type: 'select', options: ['0', '1'], required: true },
      { id: 'inr', label: 'Labile INR', type: 'select', options: ['0', '1'], required: true },
      { id: 'elderly', label: 'Age > 65', type: 'select', options: ['0', '1'], required: true },
      { id: 'drugs', label: 'Drugs/alcohol', type: 'select', options: ['0', '1', '2'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return resultObj(score, 'points', `HAS-BLED Score: ${score}`);
    }
  },

  shockIndex: {
    name: 'Shock Index',
    category: 'er',
    icon: 'fa-triangle-exclamation',
    description: 'HR / SBP',
    inputs: [
      { id: 'hr', label: 'Heart Rate', type: 'number', unit: '/min', required: true },
      { id: 'sbp', label: 'Systolic BP', type: 'number', unit: 'mmHg', required: true }
    ],
    calculate: d => {
      const si = +d.hr / +d.sbp;
      return resultObj(si.toFixed(2), '', `Shock Index: ${si.toFixed(2)}`);
    }
  },

  // ER
  parkland: {
    name: 'Parkland Formula',
    category: 'er',
    icon: 'fa-fire',
    description: 'Burn fluid calculation',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'tbsa', label: 'Burn TBSA', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const total = 4 * +d.weight * +d.tbsa;
      const first8 = total / 2;
      const next16 = total / 2;
      return {
        value: total.toFixed(0),
        unit: 'mL/24hr',
        interpretation: `Total 24hr fluid: ${total.toFixed(0)} mL`,
        details: [
          `First 8 hours: ${first8.toFixed(0)} mL`,
          `Next 16 hours: ${next16.toFixed(0)} mL`
        ]
      };
    }
  },

  // ICU / PULM
  pfRatio: {
    name: 'P/F Ratio',
    category: 'icu',
    icon: 'fa-wind',
    description: 'PaO₂ / FiO₂',
    inputs: [
      { id: 'pao2', label: 'PaO₂', type: 'number', unit: 'mmHg', required: true },
      { id: 'fio2', label: 'FiO₂', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const ratio = +d.pao2 / (+d.fio2 / 100);
      return resultObj(ratio.toFixed(0), '', `P/F Ratio: ${ratio.toFixed(0)}`);
    }
  },

  tidalVolume: {
    name: 'Tidal Volume',
    category: 'icu',
    icon: 'fa-lungs',
    description: '6-8 mL/kg IBW',
    inputs: [
      { id: 'ibw', label: 'IBW', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const low = 6 * +d.ibw;
      const high = 8 * +d.ibw;
      return {
        value: `${low.toFixed(0)} - ${high.toFixed(0)}`,
        unit: 'mL',
        interpretation: `Suggested tidal volume: ${low.toFixed(0)} - ${high.toFixed(0)} mL`
      };
    }
  },

  // PEDS
  pedsDose: {
    name: 'Weight-based Dose',
    category: 'peds',
    icon: 'fa-pills',
    description: 'mg/kg dosing',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'dose', label: 'Dose', type: 'number', unit: 'mg/kg', required: true }
    ],
    calculate: d => {
      const total = +d.weight * +d.dose;
      return resultObj(total.toFixed(1), 'mg', `Dose: ${total.toFixed(1)} mg`);
    }
  },

  pedsFluid: {
    name: 'Pediatric Maintenance Fluids',
    category: 'peds',
    icon: 'fa-tint',
    description: 'Holliday-Segar',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const w = +d.weight;
      let rate = 0;
      if (w <= 10) rate = 4 * w;
      else if (w <= 20) rate = 40 + 2 * (w - 10);
      else rate = 60 + (w - 20);
      return resultObj(rate.toFixed(0), 'mL/hr', `Pediatric maintenance fluid: ${rate.toFixed(0)} mL/hr`);
    }
  },

  // OB/GYN
  gestationalAge: {
    name: 'Gestational Age',
    category: 'obgyn',
    icon: 'fa-calendar',
    description: 'Weeks from LMP',
    inputs: [
      { id: 'lmp', label: 'LMP Date', type: 'date', required: true }
    ],
    calculate: d => {
      const lmp = new Date(d.lmp);
      const now = new Date();
      const diff = Math.floor((now - lmp) / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diff / 7);
      const days = diff % 7;
      return resultObj(`${weeks}w ${days}d`, '', `Gestational age: ${weeks} weeks ${days} days`);
    }
  },

  edd: {
    name: 'EDD',
    category: 'obgyn',
    icon: 'fa-baby',
    description: 'Estimated date of delivery',
    inputs: [
      { id: 'lmp', label: 'LMP Date', type: 'date', required: true }
    ],
    calculate: d => {
      const lmp = new Date(d.lmp);
      lmp.setDate(lmp.getDate() + 280);
      return resultObj(lmp.toLocaleDateString(), '', `Estimated date of delivery: ${lmp.toLocaleDateString()}`);
    }
  },

  // GI / HEPATIC
  meld: {
    name: 'MELD',
    category: 'general',
    icon: 'fa-liver',
    description: 'MELD Score',
    inputs: [
      { id: 'bilirubin', label: 'Bilirubin', type: 'number', unit: 'mg/dL', required: true },
      { id: 'inr', label: 'INR', type: 'number', required: true },
      { id: 'creatinine', label: 'Creatinine', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const bili = Math.max(+d.bilirubin, 1);
      const inr = Math.max(+d.inr, 1);
      const cr = Math.max(+d.creatinine, 1);
      const meld = 3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43;
      return resultObj(Math.round(meld), 'points', `MELD Score: ${Math.round(meld)}`);
    }
  },

  childPugh: {
    name: 'Child-Pugh',
    category: 'general',
    icon: 'fa-liver',
    description: 'Child-Pugh class',
    inputs: [
      { id: 'bilirubin', label: 'Bilirubin points', type: 'select', options: ['1', '2', '3'], required: true },
      { id: 'albumin', label: 'Albumin points', type: 'select', options: ['1', '2', '3'], required: true },
      { id: 'inr', label: 'INR/PT points', type: 'select', options: ['1', '2', '3'], required: true },
      { id: 'ascites', label: 'Ascites points', type: 'select', options: ['1', '2', '3'], required: true },
      { id: 'enceph', label: 'Encephalopathy points', type: 'select', options: ['1', '2', '3'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      const cls = score <= 6 ? 'A' : score <= 9 ? 'B' : 'C';
      return resultObj(score, 'points', `Child-Pugh: ${score} (Class ${cls})`);
    }
  },

  // HEME
  anc: {
    name: 'ANC',
    category: 'general',
    icon: 'fa-droplet',
    description: 'Absolute Neutrophil Count',
    inputs: [
      { id: 'wbc', label: 'WBC', type: 'number', unit: '/µL', required: true },
      { id: 'neut', label: 'Neutrophils', type: 'number', unit: '%', required: true },
      { id: 'bands', label: 'Bands', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const anc = (+d.wbc) * ((+d.neut + +d.bands) / 100);
      return resultObj(anc.toFixed(0), '/µL', `ANC: ${anc.toFixed(0)} /µL`);
    }
  },

  ironDeficit: {
    name: 'Iron Deficit',
    category: 'general',
    icon: 'fa-vial',
    description: 'Ganzoni formula',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'actualHb', label: 'Actual Hb', type: 'number', unit: 'g/dL', required: true },
      { id: 'targetHb', label: 'Target Hb', type: 'number', unit: 'g/dL', required: true }
    ],
    calculate: d => {
      const deficit = (+d.weight) * ((+d.targetHb) - (+d.actualHb)) * 2.4 + 500;
      return resultObj(deficit.toFixed(0), 'mg', `Iron deficit: ${deficit.toFixed(0)} mg`);
    }
  }
};

function resultObj(value, unit, interpretation, category = '') {
  return { value, unit, interpretation, category };
}

function openCalculator(calcId) {
  const calc = CALCULATORS[calcId];
  if (!calc) {
    showToast('Calculator not found', 'error');
    return;
  }

  const modal = document.getElementById('calculator-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('calculator-content');

  title.innerHTML = `<i class="fas ${calc.icon || 'fa-calculator'}"></i> ${calc.name}`;

  let html = `
    <div style="margin-bottom:1rem;padding:0.9rem 1rem;background:#eff6ff;border:1px solid #dbeafe;border-radius:12px;">
      <strong style="display:block;color:#1e3a8a;margin-bottom:0.25rem;">${calc.name}</strong>
      <small style="color:#475569;">${calc.description || 'Clinical calculator'}</small>
    </div>
    <form id="calc-form" onsubmit="calculateResult(event, '${calcId}')">
  `;

  calc.inputs.forEach(input => {
    html += `<div class="form-group">`;
    html += `<label>${input.label}${input.unit ? ` (${input.unit})` : ''}</label>`;

    if (input.type === 'select') {
      html += `<select id="${input.id}" required>
        <option value="">Select...</option>
        ${input.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
      </select>`;
    } else if (input.type === 'date') {
      html += `<input type="date" id="${input.id}" required />`;
    } else {
      html += `<input type="number" id="${input.id}" step="any" required placeholder="Enter ${input.label.toLowerCase()}" />`;
    }

    html += `</div>`;
  });

  html += `
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1rem;">
        <button type="submit" class="btn-primary" style="flex:1;min-width:160px;">
          <i class="fas fa-calculator"></i> Calculate
        </button>
        <button type="button" class="btn-secondary" onclick="closeCalculator()" style="min-width:120px;">
          Cancel
        </button>
      </div>
    </form>
    <div id="calc-result" style="display:none;margin-top:1.25rem;"></div>
  `;

  content.innerHTML = html;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function calculateResult(event, calcId) {
  event.preventDefault();

  const calc = CALCULATORS[calcId];
  const inputData = {};
  calc.inputs.forEach(input => {
    inputData[input.id] = document.getElementById(input.id).value;
  });

  const result = calc.calculate(inputData);
  const resultDiv = document.getElementById('calc-result');

  const detailsHtml = result.details ? `<ul>${result.details.map(x => `<li>${x}</li>`).join('')}</ul>` : '';

  const summaryText = `${calc.name}\n${result.interpretation || ''}\n${result.value || ''} ${result.unit || ''}`;

  resultDiv.innerHTML = `
    <div class="result-card">
      <div class="result-main">
        <div class="result-value">${result.value} <span class="result-unit">${result.unit || ''}</span></div>
        ${result.category ? `<div class="result-category">${result.category}</div>` : ''}
      </div>
      <div class="result-interpretation">${result.interpretation || ''}</div>
      ${detailsHtml}
      <div class="result-actions" style="margin-top:1rem;">
        <button class="btn-secondary" onclick='saveCalculation("${calcId}", ${JSON.stringify(inputData)}, ${JSON.stringify(result)})' type="button">
          <i class="fas fa-save"></i> Save
        </button>
        <button class="btn-secondary" onclick='copyResultText(${JSON.stringify(summaryText)})' type="button">
          <i class="fas fa-copy"></i> Copy
        </button>
        <button class="btn-secondary" onclick="window.print()" type="button">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  `;

  resultDiv.style.display = 'block';
}

function saveCalculation(calcId, data, result) {
  const calc = CALCULATORS[calcId];
  data.name = calc.name;
  calcStorage.saveCalculation(calcId, data, result);
  showToast('Calculation saved', 'success');
  loadHistory();
}

function closeCalculator() {
  document.getElementById('calculator-modal').classList.remove('active');
  document.body.style.overflow = '';
}
// ==========================================
// SESSION 4 - MORE MEDICAL CALCULATORS
// ==========================================

Object.assign(CALCULATORS, {
  // ------------------------------
  // CARDIOLOGY
  // ------------------------------
  heartScore: {
    name: 'HEART Score',
    category: 'cardio',
    icon: 'fa-heart-circle-check',
    description: 'ACS risk stratification',
    inputs: [
      { id: 'history', label: 'History points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'ecg', label: 'ECG points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'age', label: 'Age points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'risk', label: 'Risk factors points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'troponin', label: 'Troponin points', type: 'select', options: ['0', '1', '2'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return { value: score, unit: '/10', interpretation: `HEART Score: ${score}/10` };
    }
  },

  timiUA: {
    name: 'TIMI UA/NSTEMI',
    category: 'cardio',
    icon: 'fa-heart',
    description: 'TIMI risk score',
    inputs: [
      { id: 'age65', label: 'Age ≥ 65', type: 'select', options: ['0', '1'], required: true },
      { id: 'rf3', label: '≥3 CAD risk factors', type: 'select', options: ['0', '1'], required: true },
      { id: 'cad', label: 'Known CAD', type: 'select', options: ['0', '1'], required: true },
      { id: 'asa', label: 'ASA in last 7 days', type: 'select', options: ['0', '1'], required: true },
      { id: 'angina', label: '≥2 angina in 24 hr', type: 'select', options: ['0', '1'], required: true },
      { id: 'st', label: 'ST changes', type: 'select', options: ['0', '1'], required: true },
      { id: 'marker', label: 'Positive markers', type: 'select', options: ['0', '1'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return { value: score, unit: '/7', interpretation: `TIMI Score: ${score}/7` };
    }
  },

  ratePressureProduct: {
    name: 'Rate Pressure Product',
    category: 'cardio',
    icon: 'fa-gauge-high',
    description: 'HR × SBP',
    inputs: [
      { id: 'hr', label: 'Heart Rate', type: 'number', unit: '/min', required: true },
      { id: 'sbp', label: 'SBP', type: 'number', unit: 'mmHg', required: true }
    ],
    calculate: d => {
      const rpp = +d.hr * +d.sbp;
      return { value: rpp.toFixed(0), unit: '', interpretation: `Rate Pressure Product: ${rpp.toFixed(0)}` };
    }
  },

  cardiacIndex: {
    name: 'Cardiac Index',
    category: 'cardio',
    icon: 'fa-heart-pulse',
    description: 'CO / BSA',
    inputs: [
      { id: 'co', label: 'Cardiac Output', type: 'number', unit: 'L/min', required: true },
      { id: 'bsa', label: 'BSA', type: 'number', unit: 'm²', required: true }
    ],
    calculate: d => {
      const ci = +d.co / +d.bsa;
      return { value: ci.toFixed(2), unit: 'L/min/m²', interpretation: `Cardiac Index: ${ci.toFixed(2)} L/min/m²` };
    }
  },

  // ------------------------------
  // PULMONOLOGY / ICU
  // ------------------------------
  aAGradient: {
    name: 'A-a Gradient',
    category: 'icu',
    icon: 'fa-wind',
    description: 'Alveolar-arterial oxygen gradient',
    inputs: [
      { id: 'fio2', label: 'FiO2', type: 'number', unit: '%', required: true },
      { id: 'paco2', label: 'PaCO2', type: 'number', unit: 'mmHg', required: true },
      { id: 'pao2', label: 'PaO2', type: 'number', unit: 'mmHg', required: true }
    ],
    calculate: d => {
      const fio2 = +d.fio2 / 100;
      const PAO2 = (fio2 * (760 - 47)) - (+d.paco2 / 0.8);
      const gradient = PAO2 - +d.pao2;
      return { value: gradient.toFixed(1), unit: 'mmHg', interpretation: `A-a Gradient: ${gradient.toFixed(1)} mmHg` };
    }
  },

  oxygenContent: {
    name: 'Oxygen Content (CaO₂)',
    category: 'icu',
    icon: 'fa-lungs',
    description: 'CaO₂',
    inputs: [
      { id: 'hb', label: 'Hemoglobin', type: 'number', unit: 'g/dL', required: true },
      { id: 'sao2', label: 'SaO2', type: 'number', unit: '%', required: true },
      { id: 'pao2', label: 'PaO2', type: 'number', unit: 'mmHg', required: true }
    ],
    calculate: d => {
      const cao2 = (1.34 * +d.hb * (+d.sao2 / 100)) + (0.003 * +d.pao2);
      return { value: cao2.toFixed(2), unit: 'mL O2/dL', interpretation: `CaO₂: ${cao2.toFixed(2)} mL O₂/dL` };
    }
  },

  fio2FromO2: {
    name: 'Estimated FiO₂',
    category: 'icu',
    icon: 'fa-mask-face',
    description: 'Estimate FiO₂ from O₂ flow',
    inputs: [
      { id: 'flow', label: 'Oxygen Flow', type: 'number', unit: 'L/min', required: true }
    ],
    calculate: d => {
      const fio2 = 21 + (+d.flow * 4);
      return { value: fio2.toFixed(0), unit: '%', interpretation: `Estimated FiO₂: ${fio2.toFixed(0)}%` };
    }
  },

  // ------------------------------
  // GI / HEPATOLOGY
  // ------------------------------
  maddreyDF: {
    name: "Maddrey's DF",
    category: 'general',
    icon: 'fa-liver',
    description: 'Alcoholic hepatitis severity',
    inputs: [
      { id: 'ptPatient', label: 'Patient PT', type: 'number', unit: 'sec', required: true },
      { id: 'ptControl', label: 'Control PT', type: 'number', unit: 'sec', required: true },
      { id: 'bilirubin', label: 'Bilirubin', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const df = 4.6 * (+d.ptPatient - +d.ptControl) + +d.bilirubin;
      return { value: df.toFixed(1), unit: '', interpretation: `Maddrey DF: ${df.toFixed(1)}` };
    }
  },

  fib4: {
    name: 'FIB-4',
    category: 'general',
    icon: 'fa-chart-line',
    description: 'Fibrosis-4 index',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', required: true },
      { id: 'ast', label: 'AST', type: 'number', unit: 'U/L', required: true },
      { id: 'alt', label: 'ALT', type: 'number', unit: 'U/L', required: true },
      { id: 'platelets', label: 'Platelets', type: 'number', unit: '10^9/L', required: true }
    ],
    calculate: d => {
      const fib4 = (+d.age * +d.ast) / (+d.platelets * Math.sqrt(+d.alt));
      return { value: fib4.toFixed(2), unit: '', interpretation: `FIB-4 Index: ${fib4.toFixed(2)}` };
    }
  },

  glasgowBlatchford: {
    name: 'Glasgow-Blatchford',
    category: 'general',
    icon: 'fa-stomach',
    description: 'UGIB risk score',
    inputs: [
      { id: 'bunPts', label: 'BUN points', type: 'number', unit: 'points', required: true },
      { id: 'hbPts', label: 'Hb points', type: 'number', unit: 'points', required: true },
      { id: 'sbpPts', label: 'SBP points', type: 'number', unit: 'points', required: true },
      { id: 'otherPts', label: 'Other points', type: 'number', unit: 'points', required: true }
    ],
    calculate: d => {
      const score = +d.bunPts + +d.hbPts + +d.sbpPts + +d.otherPts;
      return { value: score, unit: 'points', interpretation: `Glasgow-Blatchford Score: ${score}` };
    }
  },

  // ------------------------------
  // ENDOCRINE
  // ------------------------------
  hba1cToAvgGlucose: {
    name: 'HbA1c to Avg Glucose',
    category: 'general',
    icon: 'fa-chart-area',
    description: 'Estimated average glucose',
    inputs: [
      { id: 'a1c', label: 'HbA1c', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const eag = (28.7 * +d.a1c) - 46.7;
      return { value: eag.toFixed(1), unit: 'mg/dL', interpretation: `Estimated average glucose: ${eag.toFixed(1)} mg/dL` };
    }
  },

  dkaOsm: {
    name: 'DKA Effective Osmolality',
    category: 'general',
    icon: 'fa-droplet',
    description: '2Na + glucose/18',
    inputs: [
      { id: 'na', label: 'Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'glucose', label: 'Glucose', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const osm = (2 * +d.na) + (+d.glucose / 18);
      return { value: osm.toFixed(1), unit: 'mOsm/kg', interpretation: `Effective osmolality: ${osm.toFixed(1)} mOsm/kg` };
    }
  },

  steroidConversion: {
    name: 'Steroid Conversion',
    category: 'general',
    icon: 'fa-capsules',
    description: 'Equivalent steroid dose',
    inputs: [
      { id: 'prednisone', label: 'Prednisone equivalent', type: 'number', unit: 'mg', required: true }
    ],
    calculate: d => {
      const pred = +d.prednisone;
      const dex = pred / 6.67;
      const methyl = pred * 0.8;
      const hydrocort = pred * 4;
      return {
        value: pred.toFixed(1),
        unit: 'mg prednisone eq',
        interpretation: `Prednisone equivalent: ${pred.toFixed(1)} mg`,
        details: [
          `Dexamethasone ≈ ${dex.toFixed(2)} mg`,
          `Methylprednisolone ≈ ${methyl.toFixed(2)} mg`,
          `Hydrocortisone ≈ ${hydrocort.toFixed(2)} mg`
        ]
      };
    }
  },

  // ------------------------------
  // HEMATOLOGY
  // ------------------------------
  reticIndex: {
    name: 'Reticulocyte Index',
    category: 'general',
    icon: 'fa-droplet',
    description: 'Corrected reticulocyte response',
    inputs: [
      { id: 'retic', label: 'Retic %', type: 'number', unit: '%', required: true },
      { id: 'hctPatient', label: 'Patient Hct', type: 'number', unit: '%', required: true },
      { id: 'hctNormal', label: 'Normal Hct', type: 'number', unit: '%', required: true },
      { id: 'maturation', label: 'Maturation factor', type: 'number', unit: '', required: true }
    ],
    calculate: d => {
      const ri = ((+d.retic * (+d.hctPatient / +d.hctNormal)) / +d.maturation);
      return { value: ri.toFixed(2), unit: '', interpretation: `Reticulocyte Index: ${ri.toFixed(2)}` };
    }
  },

  transfusionVolume: {
    name: 'Transfusion Volume',
    category: 'general',
    icon: 'fa-syringe',
    description: 'PRBC volume estimate',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'hbRise', label: 'Desired Hb rise', type: 'number', unit: 'g/dL', required: true }
    ],
    calculate: d => {
      const vol = +d.weight * +d.hbRise * 4;
      return { value: vol.toFixed(0), unit: 'mL PRBC', interpretation: `Estimated PRBC volume: ${vol.toFixed(0)} mL` };
    }
  },

  correctedRetic: {
    name: 'Corrected Retic Count',
    category: 'general',
    icon: 'fa-vial',
    description: 'Corrected reticulocyte count',
    inputs: [
      { id: 'retic', label: 'Retic %', type: 'number', unit: '%', required: true },
      { id: 'hctPatient', label: 'Patient Hct', type: 'number', unit: '%', required: true },
      { id: 'hctNormal', label: 'Normal Hct', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const corrected = +d.retic * (+d.hctPatient / +d.hctNormal);
      return { value: corrected.toFixed(2), unit: '%', interpretation: `Corrected Retic Count: ${corrected.toFixed(2)}%` };
    }
  },

  // ------------------------------
  // NEUROLOGY
  // ------------------------------
  abcd2: {
    name: 'ABCD2 Score',
    category: 'general',
    icon: 'fa-brain',
    description: 'TIA risk score',
    inputs: [
      { id: 'age', label: 'Age ≥60', type: 'select', options: ['0', '1'], required: true },
      { id: 'bp', label: 'BP ≥140/90', type: 'select', options: ['0', '1'], required: true },
      { id: 'clinical', label: 'Clinical points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'duration', label: 'Duration points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'diabetes', label: 'Diabetes', type: 'select', options: ['0', '1'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return { value: score, unit: '/7', interpretation: `ABCD2 Score: ${score}/7` };
    }
  },

  rassSimple: {
    name: 'RASS Recording Helper',
    category: 'icu',
    icon: 'fa-bed',
    description: 'Richmond Agitation Sedation Scale',
    inputs: [
      { id: 'score', label: 'RASS score', type: 'select', options: ['+4', '+3', '+2', '+1', '0', '-1', '-2', '-3', '-4', '-5'], required: true }
    ],
    calculate: d => {
      return { value: d.score, unit: '', interpretation: `RASS Score: ${d.score}` };
    }
  },

  // ------------------------------
  // OB/GYN
  // ------------------------------
  bishopScore: {
    name: 'Bishop Score',
    category: 'obgyn',
    icon: 'fa-baby',
    description: 'Cervical readiness score',
    inputs: [
      { id: 'dilation', label: 'Dilation points', type: 'select', options: ['0', '1', '2', '3'], required: true },
      { id: 'effacement', label: 'Effacement points', type: 'select', options: ['0', '1', '2', '3'], required: true },
      { id: 'station', label: 'Station points', type: 'select', options: ['0', '1', '2', '3'], required: true },
      { id: 'consistency', label: 'Consistency points', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'position', label: 'Position points', type: 'select', options: ['0', '1', '2'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return { value: score, unit: 'points', interpretation: `Bishop Score: ${score}` };
    }
  },

  apgar: {
    name: 'Apgar Score',
    category: 'obgyn',
    icon: 'fa-child',
    description: 'Newborn APGAR',
    inputs: [
      { id: 'appearance', label: 'Appearance', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'pulse', label: 'Pulse', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'grimace', label: 'Grimace', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'activity', label: 'Activity', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'respiration', label: 'Respiration', type: 'select', options: ['0', '1', '2'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return { value: score, unit: '/10', interpretation: `Apgar Score: ${score}/10` };
    }
  },

  // ------------------------------
  // GENERAL / FLUIDS
  // ------------------------------
  winterFormula: {
    name: "Winter's Formula",
    category: 'general',
    icon: 'fa-vial',
    description: 'Expected PaCO2 in metabolic acidosis',
    inputs: [
      { id: 'hco3', label: 'HCO3', type: 'number', unit: 'mEq/L', required: true }
    ],
    calculate: d => {
      const expected = (1.5 * +d.hco3) + 8;
      return {
        value: `${(expected - 2).toFixed(1)} - ${(expected + 2).toFixed(1)}`,
        unit: 'mmHg',
        interpretation: `Expected PaCO₂: ${(expected - 2).toFixed(1)} - ${(expected + 2).toFixed(1)} mmHg`
      };
    }
  },

  maintenanceFluid24h: {
    name: 'Maintenance Fluid 24h',
    category: 'general',
    icon: 'fa-bottle-water',
    description: 'Daily fluid requirement',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const w = +d.weight;
      let total = 0;
      if (w <= 10) total = 100 * w;
      else if (w <= 20) total = 1000 + (w - 10) * 50;
      else total = 1500 + (w - 20) * 20;
      return { value: total.toFixed(0), unit: 'mL/day', interpretation: `24-hour maintenance fluid: ${total.toFixed(0)} mL/day` };
    }
  },

  sodiumDeficit: {
    name: 'Sodium Deficit',
    category: 'general',
    icon: 'fa-droplet',
    description: 'Estimated Na deficit',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'currentNa', label: 'Current Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'desiredNa', label: 'Desired Na', type: 'number', unit: 'mEq/L', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true }
    ],
    calculate: d => {
      const tbw = +d.weight * (d.gender === 'Male' ? 0.6 : 0.5);
      const deficit = tbw * (+d.desiredNa - +d.currentNa);
      return { value: deficit.toFixed(1), unit: 'mEq', interpretation: `Estimated sodium deficit: ${deficit.toFixed(1)} mEq` };
    }
  },

  osmolGap: {
    name: 'Osmol Gap',
    category: 'general',
    icon: 'fa-beaker',
    description: 'Measured - calculated osmolality',
    inputs: [
      { id: 'measured', label: 'Measured Osmolality', type: 'number', unit: 'mOsm/kg', required: true },
      { id: 'calculated', label: 'Calculated Osmolality', type: 'number', unit: 'mOsm/kg', required: true }
    ],
    calculate: d => {
      const gap = +d.measured - +d.calculated;
      return { value: gap.toFixed(1), unit: 'mOsm/kg', interpretation: `Osmol Gap: ${gap.toFixed(1)} mOsm/kg` };
    }
  }
});

function calculateResult(event, calcId) {
  event.preventDefault();

  const calc = CALCULATORS[calcId];
  const inputData = {};
  calc.inputs.forEach(input => {
    inputData[input.id] = document.getElementById(input.id).value;
  });

  const result = calc.calculate(inputData);
  const resultDiv = document.getElementById('calc-result');

  const detailsHtml = result.details ? `<ul>${result.details.map(x => `<li>${x}</li>`).join('')}</ul>` : '';

  const summaryText = [
  `Calculator: ${calc.name}`,
  result.interpretation ? `Interpretation: ${result.interpretation}` : '',
  (result.value !== undefined ? `Result: ${result.value} ${result.unit || ''}` : ''),
  (result.category ? `Category: ${result.category}` : '')
].filter(Boolean).join('\n');

  resultDiv.innerHTML = `
    <div class="result-card">
      <div class="result-main">
        <div class="result-value">${result.value} <span class="result-unit">${result.unit || ''}</span></div>
        ${result.category ? `<div class="result-category">${result.category}</div>` : ''}
      </div>
      <div class="result-interpretation">${result.interpretation || ''}</div>
      ${detailsHtml}
      <div class="result-actions" style="margin-top:1rem;">
        <button class="btn-secondary" onclick='saveCalculation("${calcId}", ${JSON.stringify(inputData)}, ${JSON.stringify(result)})' type="button">
          <i class="fas fa-save"></i> Save
        </button>
        <button class="btn-secondary" onclick='copyResultText(${JSON.stringify(summaryText)})' type="button">
          <i class="fas fa-copy"></i> Copy
        </button>
        <button class="btn-secondary" onclick="window.print()" type="button">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  `;

  resultDiv.style.display = 'block';
}

// ==========================================
// SESSION 7 - MORE CALCULATORS
// ==========================================

Object.assign(CALCULATORS, {
  // ------------------------------
  // ADVANCED NEPHROLOGY
  // ------------------------------
  feUrea: {
    name: 'FeUrea',
    category: 'nephro',
    icon: 'fa-percent',
    description: 'Fractional excretion of urea',
    inputs: [
      { id: 'urineUrea', label: 'Urine Urea', type: 'number', unit: 'mg/dL', required: true },
      { id: 'plasmaUrea', label: 'Plasma Urea', type: 'number', unit: 'mg/dL', required: true },
      { id: 'urineCr', label: 'Urine Creatinine', type: 'number', unit: 'mg/dL', required: true },
      { id: 'plasmaCr', label: 'Plasma Creatinine', type: 'number', unit: 'mg/dL', required: true }
    ],
    calculate: d => {
      const feu = ((+d.urineUrea * +d.plasmaCr) / (+d.plasmaUrea * +d.urineCr)) * 100;
      return { value: feu.toFixed(2), unit: '%', interpretation: `FeUrea: ${feu.toFixed(2)}%` };
    }
  },

  correctedAnionGap: {
    name: 'Corrected Anion Gap',
    category: 'nephro',
    icon: 'fa-vial-circle-check',
    description: 'Anion gap corrected for albumin',
    inputs: [
      { id: 'anionGap', label: 'Measured AG', type: 'number', unit: 'mEq/L', required: true },
      { id: 'albumin', label: 'Albumin', type: 'number', unit: 'g/dL', required: true }
    ],
    calculate: d => {
      const cag = +d.anionGap + (2.5 * (4 - +d.albumin));
      return { value: cag.toFixed(1), unit: 'mEq/L', interpretation: `Corrected Anion Gap: ${cag.toFixed(1)} mEq/L` };
    }
  },

  serumBicarbonateDeficit: {
    name: 'Bicarbonate Deficit',
    category: 'nephro',
    icon: 'fa-prescription-bottle',
    description: 'Estimated bicarbonate deficit',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'currentHco3', label: 'Current HCO₃', type: 'number', unit: 'mEq/L', required: true },
      { id: 'desiredHco3', label: 'Desired HCO₃', type: 'number', unit: 'mEq/L', required: true }
    ],
    calculate: d => {
      const deficit = 0.5 * +d.weight * (+d.desiredHco3 - +d.currentHco3);
      return { value: deficit.toFixed(1), unit: 'mEq', interpretation: `Estimated bicarbonate deficit: ${deficit.toFixed(1)} mEq` };
    }
  },

  // ------------------------------
  // PEDIATRICS EXTRA
  // ------------------------------
  pedsIbuprofen: {
    name: 'Peds Ibuprofen Dose',
    category: 'peds',
    icon: 'fa-tablets',
    description: '10 mg/kg basic pediatric ibuprofen',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const dose = +d.weight * 10;
      return { value: dose.toFixed(0), unit: 'mg', interpretation: `Ibuprofen dose: ${dose.toFixed(0)} mg` };
    }
  },

  pedsParacetamol: {
    name: 'Peds Paracetamol Dose',
    category: 'peds',
    icon: 'fa-capsules',
    description: '15 mg/kg pediatric paracetamol',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const dose = +d.weight * 15;
      return { value: dose.toFixed(0), unit: 'mg', interpretation: `Paracetamol dose: ${dose.toFixed(0)} mg` };
    }
  },

  pedsResusFluid: {
    name: 'Peds Fluid Bolus',
    category: 'peds',
    icon: 'fa-tint',
    description: '20 mL/kg bolus',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true }
    ],
    calculate: d => {
      const bolus = +d.weight * 20;
      return { value: bolus.toFixed(0), unit: 'mL', interpretation: `Fluid bolus: ${bolus.toFixed(0)} mL` };
    }
  },

  pedsTubeSize: {
    name: 'Pediatric ETT Size',
    category: 'peds',
    icon: 'fa-lungs',
    description: 'Age-based tube size',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', required: true }
    ],
    calculate: d => {
      const uncuffed = (+d.age / 4) + 4;
      const cuffed = (+d.age / 4) + 3.5;
      return {
        value: `${uncuffed.toFixed(1)} / ${cuffed.toFixed(1)}`,
        unit: 'mm',
        interpretation: `Uncuffed: ${uncuffed.toFixed(1)} mm, Cuffed: ${cuffed.toFixed(1)} mm`
      };
    }
  },

  pedsTubeDepth: {
    name: 'Pediatric ETT Depth',
    category: 'peds',
    icon: 'fa-ruler',
    description: 'Approx tube depth',
    inputs: [
      { id: 'tubeSize', label: 'ETT Size', type: 'number', unit: 'mm', required: true }
    ],
    calculate: d => {
      const depth = +d.tubeSize * 3;
      return { value: depth.toFixed(1), unit: 'cm', interpretation: `Approx oral tube depth: ${depth.toFixed(1)} cm` };
    }
  },

  apgarFiveMinute: {
    name: '5-Minute Apgar',
    category: 'peds',
    icon: 'fa-baby',
    description: 'Neonatal APGAR',
    inputs: [
      { id: 'appearance', label: 'Appearance', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'pulse', label: 'Pulse', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'grimace', label: 'Grimace', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'activity', label: 'Activity', type: 'select', options: ['0', '1', '2'], required: true },
      { id: 'respiration', label: 'Respiration', type: 'select', options: ['0', '1', '2'], required: true }
    ],
    calculate: d => {
      const score = Object.values(d).reduce((a, b) => a + (+b), 0);
      return { value: score, unit: '/10', interpretation: `5-minute Apgar Score: ${score}/10` };
    }
  },

  // ------------------------------
  // SURGERY
  // ------------------------------
  capriniSimple: {
    name: 'Caprini (Simple)',
    category: 'general',
    icon: 'fa-user-injured',
    description: 'VTE risk score helper',
    inputs: [
      { id: 'points', label: 'Total Caprini points', type: 'number', unit: 'points', required: true }
    ],
    calculate: d => {
      const p = +d.points;
      let risk = 'Low';
      if (p >= 5) risk = 'Highest';
      else if (p >= 3) risk = 'High';
      else if (p >= 2) risk = 'Moderate';
      return { value: p, unit: 'points', interpretation: `Caprini Score: ${p} (${risk} risk)` };
    }
  },

  surgicalApgar: {
    name: 'Surgical Apgar',
    category: 'general',
    icon: 'fa-scissors',
    description: 'Intraoperative risk score',
    inputs: [
      { id: 'bloodLoss', label: 'Blood loss points', type: 'select', options: ['0', '1', '2', '3'], required: true },
      { id: 'map', label: 'Lowest MAP points', type: 'select', options: ['0', '1', '2', '3'], required: true },
      { id: 'hr', label: 'Lowest HR points', type: 'select', options: ['0', '1', '2', '3', '4'], required: true }
    ],
    calculate: d => {
      const score = +d.bloodLoss + +d.map + +d.hr;
      return { value: score, unit: '/10', interpretation: `Surgical Apgar Score: ${score}/10` };
    }
  },

  bloodLossEstimate: {
    name: 'Blood Loss Estimate',
    category: 'general',
    icon: 'fa-droplet',
    description: 'Estimated blood volume loss',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'bloodVolumeFactor', label: 'EBV factor', type: 'number', unit: 'mL/kg', required: true },
      { id: 'hctStart', label: 'Starting Hct', type: 'number', unit: '%', required: true },
      { id: 'hctEnd', label: 'Ending Hct', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const ebv = +d.weight * +d.bloodVolumeFactor;
      const loss = ebv * ((+d.hctStart - +d.hctEnd) / +d.hctStart);
      return { value: loss.toFixed(0), unit: 'mL', interpretation: `Estimated blood loss: ${loss.toFixed(0)} mL` };
    }
  },

  // ------------------------------
  // ENDOCRINE EXTRA
  // ------------------------------
  insulinCorrectionDose: {
    name: 'Insulin Correction Dose',
    category: 'general',
    icon: 'fa-syringe',
    description: 'Simple correction formula',
    inputs: [
      { id: 'currentGlucose', label: 'Current Glucose', type: 'number', unit: 'mg/dL', required: true },
      { id: 'targetGlucose', label: 'Target Glucose', type: 'number', unit: 'mg/dL', required: true },
      { id: 'isf', label: 'Insulin Sensitivity Factor', type: 'number', unit: 'mg/dL per unit', required: true }
    ],
    calculate: d => {
      const dose = (+d.currentGlucose - +d.targetGlucose) / +d.isf;
      return { value: Math.max(dose, 0).toFixed(1), unit: 'units', interpretation: `Correction insulin dose: ${Math.max(dose, 0).toFixed(1)} units` };
    }
  },

  correctedCalciumSI: {
    name: 'Corrected Calcium (mmol/L)',
    category: 'general',
    icon: 'fa-flask',
    description: 'Calcium correction in SI',
    inputs: [
      { id: 'calcium', label: 'Calcium', type: 'number', unit: 'mmol/L', required: true },
      { id: 'albumin', label: 'Albumin', type: 'number', unit: 'g/L', required: true }
    ],
    calculate: d => {
      const corrected = +d.calcium + 0.02 * (40 - +d.albumin);
      return { value: corrected.toFixed(2), unit: 'mmol/L', interpretation: `Corrected calcium: ${corrected.toFixed(2)} mmol/L` };
    }
  },

  // ------------------------------
  // NEURO EXTRA
  // ------------------------------
  nihssSimple: {
    name: 'NIHSS (Simple Total)',
    category: 'general',
    icon: 'fa-brain',
    description: 'Enter total NIHSS',
    inputs: [
      { id: 'score', label: 'NIHSS Total', type: 'number', unit: 'points', required: true }
    ],
    calculate: d => {
      return { value: +d.score, unit: 'points', interpretation: `NIHSS Score: ${+d.score}` };
    }
  },

  huntHess: {
    name: 'Hunt & Hess Grade',
    category: 'general',
    icon: 'fa-head-side-virus',
    description: 'SAH grading helper',
    inputs: [
      { id: 'grade', label: 'Grade', type: 'select', options: ['1', '2', '3', '4', '5'], required: true }
    ],
    calculate: d => {
      return { value: d.grade, unit: '', interpretation: `Hunt & Hess Grade: ${d.grade}` };
    }
  },

  fisherGrade: {
    name: 'Fisher Grade',
    category: 'general',
    icon: 'fa-layer-group',
    description: 'SAH CT grading helper',
    inputs: [
      { id: 'grade', label: 'Grade', type: 'select', options: ['1', '2', '3', '4'], required: true }
    ],
    calculate: d => {
      return { value: d.grade, unit: '', interpretation: `Fisher Grade: ${d.grade}` };
    }
  },

  // ------------------------------
  // RESP / ICU EXTRA
  // ------------------------------
  minuteVentilation: {
    name: 'Minute Ventilation',
    category: 'icu',
    icon: 'fa-wind',
    description: 'RR × TV',
    inputs: [
      { id: 'rr', label: 'Respiratory Rate', type: 'number', unit: '/min', required: true },
      { id: 'tv', label: 'Tidal Volume', type: 'number', unit: 'mL', required: true }
    ],
    calculate: d => {
      const mv = (+d.rr * +d.tv) / 1000;
      return { value: mv.toFixed(2), unit: 'L/min', interpretation: `Minute ventilation: ${mv.toFixed(2)} L/min` };
    }
  },

  alveolarVentilation: {
    name: 'Alveolar Ventilation',
    category: 'icu',
    icon: 'fa-lungs',
    description: '(TV - dead space) × RR',
    inputs: [
      { id: 'tv', label: 'Tidal Volume', type: 'number', unit: 'mL', required: true },
      { id: 'deadSpace', label: 'Dead Space', type: 'number', unit: 'mL', required: true },
      { id: 'rr', label: 'Respiratory Rate', type: 'number', unit: '/min', required: true }
    ],
    calculate: d => {
      const av = ((+d.tv - +d.deadSpace) * +d.rr) / 1000;
      return { value: av.toFixed(2), unit: 'L/min', interpretation: `Alveolar ventilation: ${av.toFixed(2)} L/min` };
    }
  },

  deadSpaceVent: {
    name: 'Dead Space Fraction',
    category: 'icu',
    icon: 'fa-wave-square',
    description: '(PaCO₂ - EtCO₂) / PaCO₂',
    inputs: [
      { id: 'paco2', label: 'PaCO₂', type: 'number', unit: 'mmHg', required: true },
      { id: 'etco2', label: 'EtCO₂', type: 'number', unit: 'mmHg', required: true }
    ],
    calculate: d => {
      const vdvt = (+d.paco2 - +d.etco2) / +d.paco2;
      return { value: vdvt.toFixed(2), unit: '', interpretation: `Dead space fraction: ${vdvt.toFixed(2)}` };
    }
  },

  // ------------------------------
  // OB EXTRA
  // ------------------------------
  magnesiumSulphateLoading: {
    name: 'Magnesium Sulfate Loading',
    category: 'obgyn',
    icon: 'fa-syringe',
    description: 'Typical loading dose helper',
    inputs: [
      { id: 'dose', label: 'Dose', type: 'number', unit: 'g', required: true },
      { id: 'time', label: 'Time', type: 'number', unit: 'minutes', required: true }
    ],
    calculate: d => {
      const rate = (+d.dose * 1000) / +d.time;
      return { value: rate.toFixed(1), unit: 'mg/min', interpretation: `Loading rate: ${rate.toFixed(1)} mg/min` };
    }
  },

  gravidWeeksFromEDD: {
    name: 'Weeks Until EDD',
    category: 'obgyn',
    icon: 'fa-calendar-day',
    description: 'Time remaining until EDD',
    inputs: [
      { id: 'eddDate', label: 'EDD Date', type: 'date', required: true }
    ],
    calculate: d => {
      const edd = new Date(d.eddDate);
      const now = new Date();
      const diffDays = Math.ceil((edd - now) / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      return { value: `${weeks}w ${days}d`, unit: '', interpretation: `Time until EDD: ${weeks} weeks ${days} days` };
    }
  }
});

function copyResultText(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('Result copied successfully', 'success'))
    .catch(() => showToast('Copy failed', 'error'));
}

window.copyResultText = copyResultText;
window.CALCULATORS = CALCULATORS;
window.openCalculator = openCalculator;
window.calculateResult = calculateResult;
window.closeCalculator = closeCalculator;
window.saveCalculation = saveCalculation;