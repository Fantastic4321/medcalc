// ==========================================
// PHARMACY.JS - Pharmacy Calculator Functions
// ==========================================

const PHARMACY_CALCULATORS = {
  // === IV Drip Rate Calculator ===
  drip: {
    name: 'IV Drip Rate Calculator',
    category: 'iv',
    icon: 'fa-tint',
    inputs: [
      { id: 'volume', label: 'Total Volume', type: 'number', unit: 'mL', min: 1, max: 10000, required: true },
      { id: 'time', label: 'Time', type: 'number', unit: 'hours', min: 0.1, max: 48, step: 0.1, required: true },
      { id: 'dropFactor', label: 'Drop Factor', type: 'select', options: ['10 gtt/mL', '15 gtt/mL', '20 gtt/mL', '60 gtt/mL (microdrip)'], required: true }
    ],
    calculate: (data) => {
      const volume = parseFloat(data.volume);
      const time = parseFloat(data.time);
      const dropFactor = parseInt(data.dropFactor);
      
      const flowRate = volume / time; // mL/hr
      const dropRate = (volume * dropFactor) / (time * 60); // drops/min
      
      return {
        flowRate: flowRate.toFixed(1),
        dropRate: dropRate.toFixed(0),
        interpretation: `Set IV pump to ${flowRate.toFixed(1)} mL/hr or ${dropRate.toFixed(0)} drops/min`,
        details: [
          `Flow rate: ${flowRate.toFixed(1)} mL/hr`,
          `Drop rate: ${dropRate.toFixed(0)} gtt/min`,
          `Total volume: ${volume} mL`,
          `Duration: ${time} hours`,
          `Drop factor: ${dropFactor} gtt/mL`
        ]
      };
    }
  },

  // === Vancomycin Dosing Calculator ===
  vanc: {
    name: 'Vancomycin Dosing (AUC-based)',
    category: 'pk',
    icon: 'fa-syringe',
    inputs: [
      { id: 'weight', label: 'Actual Body Weight', type: 'number', unit: 'kg', min: 1, max: 500, required: true },
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', min: 50, max: 250, required: true },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 120, required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'scr', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 20, step: 0.1, required: true },
      { id: 'indication', label: 'Indication', type: 'select', options: ['MRSA Bacteremia', 'Pneumonia', 'Meningitis', 'Endocarditis', 'Osteomyelitis'], required: true }
    ],
    calculate: (data) => {
      const weight = parseFloat(data.weight);
      const height = parseFloat(data.height);
      const age = parseFloat(data.age);
      const scr = parseFloat(data.scr);
      const genderMultiplier = data.gender === 'Female' ? 0.85 : 1;
      
      // Calculate CrCl
      const crcl = ((140 - age) * weight * genderMultiplier) / (72 * scr);
      
      // Target AUC based on indication
      let targetAUC;
      switch(data.indication) {
        case 'MRSA Bacteremia':
        case 'Endocarditis':
          targetAUC = 450; // 400-600 range
          break;
        case 'Pneumonia':
        case 'Osteomyelitis':
          targetAUC = 450;
          break;
        case 'Meningitis':
          targetAUC = 500;
          break;
        default:
          targetAUC = 450;
      }
      
      // Calculate Vd (Volume of distribution)
      const vd = 0.7 * weight; // L
      
      // Calculate Ke (Elimination rate constant)
      const ke = 0.00083 * crcl + 0.0044;
      
      // Calculate loading dose
      const loadingDose = Math.round((targetAUC * vd) / 24 / 50) * 50; // Round to nearest 50mg
      
      // Calculate maintenance dose
      const maintenanceDose = Math.round((targetAUC * ke * vd) / 50) * 50;
      
      // Determine dosing interval
      let interval;
      if (crcl >= 60) {
        interval = 12;
      } else if (crcl >= 30) {
        interval = 24;
      } else if (crcl >= 15) {
        interval = 48;
      } else {
        interval = 'Monitor levels';
      }
      
      return {
        loadingDose: loadingDose,
        maintenanceDose: maintenanceDose,
        interval: interval,
        crcl: crcl.toFixed(1),
        targetAUC: targetAUC,
        interpretation: typeof interval === 'number' 
          ? `Loading: ${loadingDose} mg, then ${maintenanceDose} mg every ${interval} hours`
          : `Loading: ${loadingDose} mg, then monitor levels`,
        warning: crcl < 30 ? 'Severe renal impairment - consider nephrology consult' : null,
        details: [
          `CrCl: ${crcl.toFixed(1)} mL/min`,
          `Target AUC: ${targetAUC} mg·h/L`,
          `Loading dose: ${loadingDose} mg IV over 1-2 hours`,
          `Maintenance: ${maintenanceDose} mg IV every ${interval} hours`,
          'Check trough level before 4th dose',
          'Target trough: 10-20 mcg/mL',
          'Monitor renal function every 2-3 days'
        ]
      };
    }
  },

  // === Aminoglycoside Dosing ===
  aminoglycoside: {
    name: 'Aminoglycoside Dosing',
    category: 'pk',
    icon: 'fa-vial',
    inputs: [
      { id: 'drug', label: 'Drug', type: 'select', options: ['Gentamicin', 'Tobramycin', 'Amikacin'], required: true },
      { id: 'weight', label: 'Actual Body Weight', type: 'number', unit: 'kg', min: 1, max: 500, required: true },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 120, required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
      { id: 'scr', label: 'Serum Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 20, step: 0.1, required: true },
      { id: 'method', label: 'Dosing Method', type: 'select', options: ['Extended Interval (Once Daily)', 'Traditional (Multiple Daily)'], required: true }
    ],
    calculate: (data) => {
      const weight = parseFloat(data.weight);
      const age = parseFloat(data.age);
      const scr = parseFloat(data.scr);
      const genderMultiplier = data.gender === 'Female' ? 0.85 : 1;
      
      // Calculate CrCl
      const crcl = ((140 - age) * weight * genderMultiplier) / (72 * scr);
      
      let dose, interval, peakTarget, troughTarget;
      
      if (data.method.includes('Extended')) {
        // Extended interval dosing
        if (data.drug === 'Amikacin') {
          dose = Math.round(weight * 15 / 50) * 50; // 15 mg/kg
          peakTarget = '56-64 mcg/mL';
          troughTarget = '< 5 mcg/mL';
        } else {
          dose = Math.round(weight * 7 / 50) * 50; // 7 mg/kg
          peakTarget = '20-30 mcg/mL';
          troughTarget = '< 1 mcg/mL';
        }
        
        // Hartford nomogram for interval
        if (crcl >= 60) interval = 24;
        else if (crcl >= 40) interval = 36;
        else if (crcl >= 20) interval = 48;
        else interval = 'Monitor levels';
        
      } else {
        // Traditional dosing
        if (data.drug === 'Amikacin') {
          dose = Math.round(weight * 7.5 / 50) * 50; // 7.5 mg/kg
          interval = 12;
          peakTarget = '20-30 mcg/mL';
          troughTarget = '< 10 mcg/mL';
        } else {
          dose = Math.round(weight * 2 / 25) * 25; // 2 mg/kg
          interval = 8;
          peakTarget = '5-10 mcg/mL';
          troughTarget = '< 2 mcg/mL';
        }
        
        // Adjust interval for renal function
        if (crcl < 60) interval = 12;
        if (crcl < 40) interval = 24;
        if (crcl < 20) interval = 'Monitor levels';
      }
      
      return {
        dose: dose,
        interval: interval,
        crcl: crcl.toFixed(1),
        interpretation: typeof interval === 'number'
          ? `${data.drug} ${dose} mg IV every ${interval} hours`
          : `${data.drug} ${dose} mg IV - Monitor levels for interval`,
        warning: crcl < 30 ? 'Severe renal impairment - monitor closely' : null,
        details: [
          `Dose: ${dose} mg IV over 30-60 minutes`,
          `Interval: ${interval} hours`,
          `Peak target: ${peakTarget}`,
          `Trough target: ${troughTarget}`,
          `CrCl: ${crcl.toFixed(1)} mL/min`,
          data.method.includes('Extended') 
            ? 'Check levels after 3rd dose (peak at 1hr, trough before next dose)'
            : 'Check levels after 3rd dose (peak 30min post-infusion, trough before next dose)',
          'Monitor renal function and hearing'
        ]
      };
    }
  },

  // === Drug Dose Calculator ===
  'drug-dose': {
    name: 'Standard Drug Dose Calculator',
    category: 'dosing',
    icon: 'fa-calculator',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, max: 500, required: true },
      { id: 'dose', label: 'Dose', type: 'number', unit: 'mg/kg', min: 0.01, max: 1000, step: 0.01, required: true },
      { id: 'frequency', label: 'Frequency', type: 'select', options: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours'], required: true }
    ],
    calculate: (data) => {
      const weight = parseFloat(data.weight);
      const dosePerKg = parseFloat(data.dose);
      
      const totalDose = weight * dosePerKg;
      
      // Calculate daily dose
      let frequencyMultiplier = 1;
      switch(data.frequency) {
        case 'Twice daily': frequencyMultiplier = 2; break;
        case 'Three times daily': frequencyMultiplier = 3; break;
        case 'Four times daily': frequencyMultiplier = 4; break;
        case 'Every 6 hours': frequencyMultiplier = 4; break;
        case 'Every 8 hours': frequencyMultiplier = 3; break;
        case 'Every 12 hours': frequencyMultiplier = 2; break;
      }
      
      const dailyDose = totalDose * frequencyMultiplier;
      
      return {
        singleDose: totalDose.toFixed(1),
        dailyDose: dailyDose.toFixed(1),
        interpretation: `Give ${totalDose.toFixed(1)} mg ${data.frequency.toLowerCase()}`,
        details: [
          `Single dose: ${totalDose.toFixed(1)} mg`,
          `Daily total: ${dailyDose.toFixed(1)} mg`,
          `Frequency: ${data.frequency}`,
          `Calculation: ${weight} kg × ${dosePerKg} mg/kg = ${totalDose.toFixed(1)} mg`
        ]
      };
    }
  },

  // === Dilution Calculator ===
  dilution: {
    name: 'Dilution Calculator (C1V1 = C2V2)',
    category: 'iv',
    icon: 'fa-fill-drip',
    inputs: [
      { id: 'c1', label: 'Initial Concentration (C1)', type: 'number', unit: 'mg/mL', min: 0.01, max: 10000, step: 0.01, required: true },
      { id: 'c2', label: 'Final Concentration (C2)', type: 'number', unit: 'mg/mL', min: 0.01, max: 10000, step: 0.01, required: true },
      { id: 'v2', label: 'Final Volume (V2)', type: 'number', unit: 'mL', min: 0.1, max: 10000, step: 0.1, required: true }
    ],
    calculate: (data) => {
      const c1 = parseFloat(data.c1);
      const c2 = parseFloat(data.c2);
      const v2 = parseFloat(data.v2);
      
      const v1 = (c2 * v2) / c1;
      const diluent = v2 - v1;
      
      if (v1 > v2) {
        return {
          error: true,
          interpretation: 'Error: Cannot achieve this dilution (final concentration too high)'
        };
      }
      
      return {
        v1: v1.toFixed(2),
        diluent: diluent.toFixed(2),
        interpretation: `Take ${v1.toFixed(2)} mL of stock solution and add ${diluent.toFixed(2)} mL of diluent`,
        details: [
          `Stock volume needed (V1): ${v1.toFixed(2)} mL`,
          `Diluent to add: ${diluent.toFixed(2)} mL`,
          `Final volume: ${v2} mL`,
          `Initial concentration: ${c1} mg/mL`,
          `Final concentration: ${c2} mg/mL`,
          'Mix thoroughly after adding diluent'
        ]
      };
    }
  },

  // === Concentration Calculator ===
  concentration: {
    name: 'Concentration Calculator',
    category: 'iv',
    icon: 'fa-flask',
    inputs: [
      { id: 'dose', label: 'Dose', type: 'number', unit: 'mg', min: 0.01, max: 100000, step: 0.01, required: true },
      { id: 'volume', label: 'Volume', type: 'number', unit: 'mL', min: 0.1, max: 10000, step: 0.1, required: true }
    ],
    calculate: (data) => {
      const dose = parseFloat(data.dose);
      const volume = parseFloat(data.volume);
      
      const concentration = dose / volume;
      const percentStrength = (concentration / 10).toFixed(2); // Convert to %
      
      return {
        concentration: concentration.toFixed(2),
        percentStrength: percentStrength,
        interpretation: `Concentration: ${concentration.toFixed(2)} mg/mL (${percentStrength}%)`,
        details: [
          `Concentration: ${concentration.toFixed(2)} mg/mL`,
          `Percent strength: ${percentStrength}% w/v`,
          `Total dose: ${dose} mg`,
          `Total volume: ${volume} mL`
        ]
      };
    }
  },

  // === Infusion Duration Calculator ===
  'infusion-duration': {
    name: 'Infusion Duration Calculator',
    category: 'iv',
    icon: 'fa-clock',
    inputs: [
      { id: 'volume', label: 'Total Volume', type: 'number', unit: 'mL', min: 1, max: 10000, required: true },
      { id: 'rate', label: 'Flow Rate', type: 'number', unit: 'mL/hr', min: 0.1, max: 1000, step: 0.1, required: true }
    ],
    calculate: (data) => {
      const volume = parseFloat(data.volume);
      const rate = parseFloat(data.rate);
      
      const durationHours = volume / rate;
      const hours = Math.floor(durationHours);
      const minutes = Math.round((durationHours - hours) * 60);
      
      const completionTime = new Date(Date.now() + durationHours * 60 * 60 * 1000);
      
      return {
        durationHours: durationHours.toFixed(2),
        interpretation: `Infusion will take ${hours} hours and ${minutes} minutes`,
        completionTime: completionTime.toLocaleTimeString(),
        details: [
          `Duration: ${hours}h ${minutes}min`,
          `Completion time: ${completionTime.toLocaleString()}`,
          `Volume: ${volume} mL`,
          `Rate: ${rate} mL/hr`
        ]
      };
    }
  },

  // === Alligation Calculator ===
  alligation: {
    name: 'Alligation Calculator',
    category: 'compounding',
    icon: 'fa-balance-scale',
    inputs: [
      { id: 'high', label: 'Higher Concentration', type: 'number', unit: '%', min: 0.01, max: 100, step: 0.01, required: true },
      { id: 'low', label: 'Lower Concentration', type: 'number', unit: '%', min: 0, max: 100, step: 0.01, required: true },
      { id: 'desired', label: 'Desired Concentration', type: 'number', unit: '%', min: 0.01, max: 100, step: 0.01, required: true },
      { id: 'totalVolume', label: 'Total Volume Needed', type: 'number', unit: 'mL', min: 1, max: 10000, required: true }
    ],
    calculate: (data) => {
      const high = parseFloat(data.high);
      const low = parseFloat(data.low);
      const desired = parseFloat(data.desired);
      const totalVolume = parseFloat(data.totalVolume);
      
      if (desired < low || desired > high) {
        return {
          error: true,
          interpretation: 'Error: Desired concentration must be between the two given concentrations'
        };
      }
      
      const partsHigh = desired - low;
      const partsLow = high - desired;
      const totalParts = partsHigh + partsLow;
      
      const volumeHigh = (partsHigh / totalParts) * totalVolume;
      const volumeLow = (partsLow / totalParts) * totalVolume;
      
      return {
        volumeHigh: volumeHigh.toFixed(2),
        volumeLow: volumeLow.toFixed(2),
        ratio: `${partsHigh.toFixed(1)}:${partsLow.toFixed(1)}`,
        interpretation: `Mix ${volumeHigh.toFixed(2)} mL of ${high}% with ${volumeLow.toFixed(2)} mL of ${low}%`,
        details: [
          `${high}% solution: ${volumeHigh.toFixed(2)} mL`,
          `${low}% solution: ${volumeLow.toFixed(2)} mL`,
          `Ratio: ${partsHigh.toFixed(1)} parts of ${high}% to ${partsLow.toFixed(1)} parts of ${low}%`,
          `Final concentration: ${desired}%`,
          `Total volume: ${totalVolume} mL`
        ]
      };
    }
  },

  // === Percentage Strength Calculator ===
  percentage: {
    name: 'Percentage Strength Calculator',
    category: 'compounding',
    icon: 'fa-percentage',
    inputs: [
      { id: 'type', label: 'Type', type: 'select', options: ['w/v (weight/volume)', 'w/w (weight/weight)', 'v/v (volume/volume)'], required: true },
      { id: 'amount', label: 'Amount of Active Ingredient', type: 'number', unit: 'g or mL', min: 0.01, max: 10000, step: 0.01, required: true },
      { id: 'total', label: 'Total Amount', type: 'number', unit: 'mL or g', min: 0.01, max: 10000, step: 0.01, required: true }
    ],
    calculate: (data) => {
      const amount = parseFloat(data.amount);
      const total = parseFloat(data.total);
      
      const percentage = (amount / total) * 100;
      
      let unit = '';
      if (data.type.includes('w/v')) unit = 'g/100mL';
      else if (data.type.includes('w/w')) unit = 'g/100g';
      else unit = 'mL/100mL';
      
      return {
        percentage: percentage.toFixed(2),
        interpretation: `${percentage.toFixed(2)}% ${data.type}`,
        details: [
          `Percentage: ${percentage.toFixed(2)}%`,
          `Type: ${data.type}`,
          `Active ingredient: ${amount} ${data.type.includes('v/v') ? 'mL' : 'g'}`,
          `Total: ${total} ${data.type.includes('w/w') ? 'g' : 'mL'}`,
          `Equivalent to: ${percentage.toFixed(2)} ${unit}`
        ]
      };
    }
  }
};

// Merge pharmacy calculators with main calculators
Object.assign(CALCULATORS, PHARMACY_CALCULATORS);

// Show pharmacy tab content
function showPharmacyTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.pharmacy-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(`pharmacy-${tabName}`).classList.add('active');
  
  // Activate button
  event.target.classList.add('active');
}

// Export
window.showPharmacyTab = showPharmacyTab;