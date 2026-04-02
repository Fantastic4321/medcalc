// ==========================================
// PHARMACY.JS - SESSION 3
// Pharmacy + ICU infusion calculators
// ==========================================

Object.assign(CALCULATORS, {
  // ------------------------------
  // DOSING
  // ------------------------------
  drugDose: {
    name: 'Standard Dose',
    category: 'pharmacy',
    subType: 'dosing',
    icon: 'fa-pills',
    description: 'Weight-based dose',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'dose', label: 'Dose', type: 'number', unit: 'mg/kg', required: true }
    ],
    calculate: d => {
      const total = +d.weight * +d.dose;
      return { value: total.toFixed(1), unit: 'mg', interpretation: `Required dose: ${total.toFixed(1)} mg` };
    }
  },

  doseByBsa: {
    name: 'Dose by BSA',
    category: 'pharmacy',
    subType: 'dosing',
    icon: 'fa-user',
    description: 'mg/m² dosing',
    inputs: [
      { id: 'bsa', label: 'BSA', type: 'number', unit: 'm²', required: true },
      { id: 'dose', label: 'Dose', type: 'number', unit: 'mg/m²', required: true }
    ],
    calculate: d => {
      const total = +d.bsa * +d.dose;
      return { value: total.toFixed(1), unit: 'mg', interpretation: `Dose by BSA: ${total.toFixed(1)} mg` };
    }
  },

  totalDailyDose: {
    name: 'Total Daily Dose',
    category: 'pharmacy',
    subType: 'dosing',
    icon: 'fa-calendar-day',
    description: 'Dose × frequency',
    inputs: [
      { id: 'singleDose', label: 'Single Dose', type: 'number', unit: 'mg', required: true },
      { id: 'frequency', label: 'Frequency/day', type: 'number', unit: 'times/day', required: true }
    ],
    calculate: d => {
      const tdd = +d.singleDose * +d.frequency;
      return { value: tdd.toFixed(2), unit: 'mg/day', interpretation: `Total daily dose: ${tdd.toFixed(2)} mg/day` };
    }
  },

  tabletDose: {
    name: 'Tablet Count',
    category: 'pharmacy',
    subType: 'dosing',
    icon: 'fa-tablets',
    description: 'Number of tablets needed',
    inputs: [
      { id: 'requiredDose', label: 'Required Dose', type: 'number', unit: 'mg', required: true },
      { id: 'tabletStrength', label: 'Tablet Strength', type: 'number', unit: 'mg/tablet', required: true }
    ],
    calculate: d => {
      const tabs = +d.requiredDose / +d.tabletStrength;
      return { value: tabs.toFixed(2), unit: 'tablets', interpretation: `Required tablets: ${tabs.toFixed(2)}` };
    }
  },

  oralLiquidVolume: {
    name: 'Oral Liquid Volume',
    category: 'pharmacy',
    subType: 'dosing',
    icon: 'fa-spoon',
    description: 'mL for oral suspension dose',
    inputs: [
      { id: 'requiredDose', label: 'Required Dose', type: 'number', unit: 'mg', required: true },
      { id: 'strength', label: 'Suspension Strength', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const ml = +d.requiredDose / +d.strength;
      return { value: ml.toFixed(2), unit: 'mL', interpretation: `Give ${ml.toFixed(2)} mL` };
    }
  },

  mgPerDoseFromSolution: {
    name: 'mL from Solution',
    category: 'pharmacy',
    subType: 'dosing',
    icon: 'fa-syringe',
    description: 'How many mL for a dose',
    inputs: [
      { id: 'requiredDose', label: 'Required Dose', type: 'number', unit: 'mg', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const ml = +d.requiredDose / +d.concentration;
      return { value: ml.toFixed(2), unit: 'mL', interpretation: `Administer ${ml.toFixed(2)} mL` };
    }
  },

  // ------------------------------
  // IV / COMPOUNDING / CONVERSION
  // ------------------------------
  dripRate: {
    name: 'IV Drip Rate',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-tint',
    description: 'mL/hr and gtt/min',
    inputs: [
      { id: 'volume', label: 'Volume', type: 'number', unit: 'mL', required: true },
      { id: 'time', label: 'Time', type: 'number', unit: 'hr', required: true },
      { id: 'dropFactor', label: 'Drop Factor', type: 'number', unit: 'gtt/mL', required: true }
    ],
    calculate: d => {
      const mlhr = +d.volume / +d.time;
      const gtt = (+d.volume * +d.dropFactor) / (+d.time * 60);
      return {
        value: mlhr.toFixed(1),
        unit: 'mL/hr',
        interpretation: `Infusion rate: ${mlhr.toFixed(1)} mL/hr`,
        details: [`Drop rate: ${gtt.toFixed(0)} gtt/min`]
      };
    }
  },

  infusionDuration: {
    name: 'Infusion Duration',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-clock',
    description: 'Volume / Rate',
    inputs: [
      { id: 'volume', label: 'Volume', type: 'number', unit: 'mL', required: true },
      { id: 'rate', label: 'Rate', type: 'number', unit: 'mL/hr', required: true }
    ],
    calculate: d => {
      const hours = +d.volume / +d.rate;
      return { value: hours.toFixed(2), unit: 'hr', interpretation: `Infusion duration: ${hours.toFixed(2)} hours` };
    }
  },

  concentration: {
    name: 'Concentration',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-flask',
    description: 'mg/mL',
    inputs: [
      { id: 'drug', label: 'Drug amount', type: 'number', unit: 'mg', required: true },
      { id: 'volume', label: 'Volume', type: 'number', unit: 'mL', required: true }
    ],
    calculate: d => {
      const c = +d.drug / +d.volume;
      return { value: c.toFixed(2), unit: 'mg/mL', interpretation: `Concentration: ${c.toFixed(2)} mg/mL` };
    }
  },

  dilution: {
    name: 'Dilution',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-fill-drip',
    description: 'C1V1 = C2V2',
    inputs: [
      { id: 'c1', label: 'Initial Concentration', type: 'number', unit: 'mg/mL', required: true },
      { id: 'c2', label: 'Final Concentration', type: 'number', unit: 'mg/mL', required: true },
      { id: 'v2', label: 'Final Volume', type: 'number', unit: 'mL', required: true }
    ],
    calculate: d => {
      const v1 = (+d.c2 * +d.v2) / +d.c1;
      const diluent = +d.v2 - v1;
      return {
        value: v1.toFixed(2),
        unit: 'mL stock',
        interpretation: `Use ${v1.toFixed(2)} mL stock + ${diluent.toFixed(2)} mL diluent`
      };
    }
  },

  alligation: {
    name: 'Alligation',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-balance-scale',
    description: 'Mixture concentration ratio',
    inputs: [
      { id: 'high', label: 'High %', type: 'number', unit: '%', required: true },
      { id: 'low', label: 'Low %', type: 'number', unit: '%', required: true },
      { id: 'desired', label: 'Desired %', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const high = +d.high, low = +d.low, desired = +d.desired;
      const partsHigh = desired - low;
      const partsLow = high - desired;
      return {
        value: `${partsHigh.toFixed(1)} : ${partsLow.toFixed(1)}`,
        unit: '',
        interpretation: `Alligation ratio (high : low): ${partsHigh.toFixed(1)} : ${partsLow.toFixed(1)}`
      };
    }
  },

  alligationVolume: {
    name: 'Alligation with Total Volume',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-scale-balanced',
    description: 'Volumes needed from high/low solution',
    inputs: [
      { id: 'high', label: 'High %', type: 'number', unit: '%', required: true },
      { id: 'low', label: 'Low %', type: 'number', unit: '%', required: true },
      { id: 'desired', label: 'Desired %', type: 'number', unit: '%', required: true },
      { id: 'totalVolume', label: 'Total Volume', type: 'number', unit: 'mL', required: true }
    ],
    calculate: d => {
      const high = +d.high, low = +d.low, desired = +d.desired, total = +d.totalVolume;
      const partsHigh = desired - low;
      const partsLow = high - desired;
      const totalParts = partsHigh + partsLow;
      const volHigh = (partsHigh / totalParts) * total;
      const volLow = (partsLow / totalParts) * total;

      return {
        value: `${volHigh.toFixed(2)} / ${volLow.toFixed(2)}`,
        unit: 'mL',
        interpretation: `Use ${volHigh.toFixed(2)} mL high + ${volLow.toFixed(2)} mL low`
      };
    }
  },

  percentStrength: {
    name: 'Percent Strength',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-percent',
    description: '% w/v',
    inputs: [
      { id: 'grams', label: 'Drug amount', type: 'number', unit: 'g', required: true },
      { id: 'volume', label: 'Volume', type: 'number', unit: 'mL', required: true }
    ],
    calculate: d => {
      const pct = (+d.grams / +d.volume) * 100;
      return { value: pct.toFixed(2), unit: '% w/v', interpretation: `Percent strength: ${pct.toFixed(2)}% w/v` };
    }
  },

  percentToMgMl: {
    name: '% to mg/mL',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-arrows-left-right',
    description: 'Convert percent to mg/mL',
    inputs: [
      { id: 'percent', label: 'Percent', type: 'number', unit: '%', required: true }
    ],
    calculate: d => {
      const mgml = +d.percent * 10;
      return { value: mgml.toFixed(2), unit: 'mg/mL', interpretation: `${d.percent}% = ${mgml.toFixed(2)} mg/mL` };
    }
  },

  mgMlToPercent: {
    name: 'mg/mL to %',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-arrows-left-right',
    description: 'Convert mg/mL to percent',
    inputs: [
      { id: 'mgml', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const pct = +d.mgml / 10;
      return { value: pct.toFixed(2), unit: '%', interpretation: `${d.mgml} mg/mL = ${pct.toFixed(2)}%` };
    }
  },

  ppm: {
    name: 'PPM',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-vial-circle-check',
    description: 'Parts per million',
    inputs: [
      { id: 'mg', label: 'Amount', type: 'number', unit: 'mg', required: true },
      { id: 'liters', label: 'Volume', type: 'number', unit: 'L', required: true }
    ],
    calculate: d => {
      const ppm = +d.mg / +d.liters;
      return { value: ppm.toFixed(2), unit: 'ppm', interpretation: `PPM: ${ppm.toFixed(2)}` };
    }
  },

  stockVolumeNeeded: {
    name: 'Stock Volume Needed',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-bottle-water',
    description: 'Volume from stock solution',
    inputs: [
      { id: 'requiredDose', label: 'Required Dose', type: 'number', unit: 'mg', required: true },
      { id: 'stockConc', label: 'Stock Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const vol = +d.requiredDose / +d.stockConc;
      return { value: vol.toFixed(2), unit: 'mL', interpretation: `Withdraw ${vol.toFixed(2)} mL from stock` };
    }
  },

  mlHrFromDose: {
    name: 'mL/hr from Ordered Dose',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-gauge-high',
    description: 'Convert mg/hr to mL/hr',
    inputs: [
      { id: 'orderedDose', label: 'Ordered Dose', type: 'number', unit: 'mg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const rate = +d.orderedDose / +d.concentration;
      return { value: rate.toFixed(2), unit: 'mL/hr', interpretation: `Set infusion to ${rate.toFixed(2)} mL/hr` };
    }
  },

  mcgKgMinToMlHr: {
    name: 'mcg/kg/min to mL/hr',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-sliders',
    description: 'Infusion pump setting',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose Rate', type: 'number', unit: 'mcg/kg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mcgPerMin = +d.weight * +d.doseRate;
      const mlHr = (mcgPerMin * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  unitsHrToMlHr: {
    name: 'Units/hr to mL/hr',
    category: 'pharmacy',
    subType: 'iv',
    icon: 'fa-droplet',
    description: 'Common for insulin/heparin',
    inputs: [
      { id: 'unitsHr', label: 'Dose', type: 'number', unit: 'units/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'units/mL', required: true }
    ],
    calculate: d => {
      const rate = +d.unitsHr / +d.concentration;
      return { value: rate.toFixed(2), unit: 'mL/hr', interpretation: `Pump rate: ${rate.toFixed(2)} mL/hr` };
    }
  },

  // ------------------------------
  // PK / TDM
  // ------------------------------
  loadingDose: {
    name: 'Loading Dose',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-syringe',
    description: 'LD = Vd × Cp / F',
    inputs: [
      { id: 'vd', label: 'Vd', type: 'number', unit: 'L', required: true },
      { id: 'cp', label: 'Target Cp', type: 'number', unit: 'mg/L', required: true },
      { id: 'f', label: 'Bioavailability', type: 'number', unit: 'fraction', required: true }
    ],
    calculate: d => {
      const ld = (+d.vd * +d.cp) / +d.f;
      return { value: ld.toFixed(1), unit: 'mg', interpretation: `Loading dose: ${ld.toFixed(1)} mg` };
    }
  },

  maintenanceDose: {
    name: 'Maintenance Dose',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-capsules',
    description: 'MD = CL × Css × τ / F',
    inputs: [
      { id: 'cl', label: 'Clearance', type: 'number', unit: 'L/hr', required: true },
      { id: 'css', label: 'Target Css', type: 'number', unit: 'mg/L', required: true },
      { id: 'tau', label: 'Interval', type: 'number', unit: 'hr', required: true },
      { id: 'f', label: 'Bioavailability', type: 'number', unit: 'fraction', required: true }
    ],
    calculate: d => {
      const md = (+d.cl * +d.css * +d.tau) / +d.f;
      return { value: md.toFixed(1), unit: 'mg', interpretation: `Maintenance dose: ${md.toFixed(1)} mg per interval` };
    }
  },

  halfLife: {
    name: 'Half-Life',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-hourglass-half',
    description: 't1/2 = 0.693 × Vd / CL',
    inputs: [
      { id: 'vd', label: 'Vd', type: 'number', unit: 'L', required: true },
      { id: 'cl', label: 'Clearance', type: 'number', unit: 'L/hr', required: true }
    ],
    calculate: d => {
      const t = 0.693 * (+d.vd) / (+d.cl);
      return { value: t.toFixed(2), unit: 'hr', interpretation: `Half-life: ${t.toFixed(2)} hr` };
    }
  },

  steadyState: {
    name: 'Steady State Time',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-chart-line',
    description: '~5 half-lives',
    inputs: [
      { id: 'halfLife', label: 'Half-life', type: 'number', unit: 'hr', required: true }
    ],
    calculate: d => {
      const ss = 5 * +d.halfLife;
      return { value: ss.toFixed(1), unit: 'hr', interpretation: `Approx steady state: ${ss.toFixed(1)} hr` };
    }
  },

  vdCalc: {
    name: 'Volume of Distribution',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-flask-vial',
    description: 'Vd = Dose / Cp',
    inputs: [
      { id: 'dose', label: 'Dose', type: 'number', unit: 'mg', required: true },
      { id: 'cp', label: 'Plasma concentration', type: 'number', unit: 'mg/L', required: true }
    ],
    calculate: d => {
      const vd = +d.dose / +d.cp;
      return { value: vd.toFixed(2), unit: 'L', interpretation: `Vd: ${vd.toFixed(2)} L` };
    }
  },

  clearanceCalc: {
    name: 'Clearance',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-filter',
    description: 'CL = 0.693 × Vd / t1/2',
    inputs: [
      { id: 'vd', label: 'Vd', type: 'number', unit: 'L', required: true },
      { id: 'halfLife', label: 'Half-life', type: 'number', unit: 'hr', required: true }
    ],
    calculate: d => {
      const cl = (0.693 * +d.vd) / +d.halfLife;
      return { value: cl.toFixed(2), unit: 'L/hr', interpretation: `Clearance: ${cl.toFixed(2)} L/hr` };
    }
  },

  eliminationRateConstant: {
    name: 'Elimination Rate Constant',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-wave-square',
    description: 'Ke = 0.693 / t1/2',
    inputs: [
      { id: 'halfLife', label: 'Half-life', type: 'number', unit: 'hr', required: true }
    ],
    calculate: d => {
      const ke = 0.693 / +d.halfLife;
      return { value: ke.toFixed(4), unit: 'hr⁻¹', interpretation: `Ke: ${ke.toFixed(4)} hr⁻¹` };
    }
  },

  phenytoinCorrection: {
    name: 'Phenytoin Correction',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-brain',
    description: 'Albumin-corrected phenytoin',
    inputs: [
      { id: 'level', label: 'Measured Phenytoin', type: 'number', unit: 'mcg/mL', required: true },
      { id: 'albumin', label: 'Albumin', type: 'number', unit: 'g/dL', required: true }
    ],
    calculate: d => {
      const corrected = (+d.level) / ((0.2 * +d.albumin) + 0.1);
      return { value: corrected.toFixed(2), unit: 'mcg/mL', interpretation: `Corrected phenytoin: ${corrected.toFixed(2)} mcg/mL` };
    }
  },

  vancoBasic: {
    name: 'Vancomycin Basic Dose',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-syringe',
    description: '15-20 mg/kg estimate',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'dosePerKg', label: 'Dose', type: 'number', unit: 'mg/kg', required: true }
    ],
    calculate: d => {
      const dose = +d.weight * +d.dosePerKg;
      return { value: dose.toFixed(0), unit: 'mg', interpretation: `Basic vancomycin dose: ${dose.toFixed(0)} mg` };
    }
  },

  aminoBasic: {
    name: 'Aminoglycoside Basic Dose',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-vial',
    description: 'Weight-based estimate',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'dosePerKg', label: 'Dose', type: 'number', unit: 'mg/kg', required: true }
    ],
    calculate: d => {
      const dose = +d.weight * +d.dosePerKg;
      return { value: dose.toFixed(0), unit: 'mg', interpretation: `Estimated aminoglycoside dose: ${dose.toFixed(0)} mg` };
    }
  },

  creatinineNormalizedDose: {
    name: 'Renal Dose Factor',
    category: 'pharmacy',
    subType: 'pk',
    icon: 'fa-kidneys',
    description: 'Simple dose fraction from CrCl',
    inputs: [
      { id: 'crcl', label: 'CrCl', type: 'number', unit: 'mL/min', required: true },
      { id: 'normalDose', label: 'Normal Dose', type: 'number', unit: 'mg', required: true }
    ],
    calculate: d => {
      let factor = 1;
      const crcl = +d.crcl;
      if (crcl < 15) factor = 0.25;
      else if (crcl < 30) factor = 0.5;
      else if (crcl < 60) factor = 0.75;
      const adjusted = +d.normalDose * factor;
      return { value: adjusted.toFixed(1), unit: 'mg', interpretation: `Estimated renal-adjusted dose: ${adjusted.toFixed(1)} mg` };
    }
  },

  // ------------------------------
  // ICU DRIP / INFUSION SECTION
  // category = icu
  // ------------------------------

  norepiInfusion: {
    name: 'Norepinephrine Infusion',
    category: 'icu',
    icon: 'fa-syringe',
    description: 'mcg/min to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Ordered Dose', type: 'number', unit: 'mcg/min', required: true },
      { id: 'concentration', label: 'Bag Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const rate = +d.ordered / +d.concentration * 60;
      return { value: rate.toFixed(2), unit: 'mL/hr', interpretation: `Norepinephrine pump rate: ${rate.toFixed(2)} mL/hr` };
    }
  },

  norepiKgInfusion: {
    name: 'Norepinephrine mcg/kg/min',
    category: 'icu',
    icon: 'fa-syringe',
    description: 'mcg/kg/min to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mcg/kg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mcgMin = +d.weight * +d.doseRate;
      const mlHr = (mcgMin * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Norepinephrine: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  epiInfusion: {
    name: 'Epinephrine Infusion',
    category: 'icu',
    icon: 'fa-heart-pulse',
    description: 'mcg/min to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Ordered Dose', type: 'number', unit: 'mcg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const rate = (+d.ordered * 60) / +d.concentration;
      return { value: rate.toFixed(2), unit: 'mL/hr', interpretation: `Epinephrine pump rate: ${rate.toFixed(2)} mL/hr` };
    }
  },

  dopamineInfusion: {
    name: 'Dopamine Infusion',
    category: 'icu',
    icon: 'fa-droplet',
    description: 'mcg/kg/min to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mcg/kg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = ((+d.weight * +d.doseRate) * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Dopamine pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  dobutamineInfusion: {
    name: 'Dobutamine Infusion',
    category: 'icu',
    icon: 'fa-heart',
    description: 'mcg/kg/min to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mcg/kg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = ((+d.weight * +d.doseRate) * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Dobutamine pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  vasopressinInfusion: {
    name: 'Vasopressin Infusion',
    category: 'icu',
    icon: 'fa-water',
    description: 'units/min to mL/hr',
    inputs: [
      { id: 'unitsMin', label: 'Dose', type: 'number', unit: 'units/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'units/mL', required: true }
    ],
    calculate: d => {
      const mlHr = (+d.unitsMin * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Vasopressin pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  nitroglycerinInfusion: {
    name: 'Nitroglycerin Infusion',
    category: 'icu',
    icon: 'fa-bolt',
    description: 'mcg/min to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Ordered Dose', type: 'number', unit: 'mcg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = (+d.ordered * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Nitroglycerin pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  nitroprussideInfusion: {
    name: 'Nitroprusside Infusion',
    category: 'icu',
    icon: 'fa-bolt-lightning',
    description: 'mcg/kg/min to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mcg/kg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = ((+d.weight * +d.doseRate) * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Nitroprusside pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  amiodaroneInfusion: {
    name: 'Amiodarone Infusion',
    category: 'icu',
    icon: 'fa-wave-square',
    description: 'mg/min to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = (+d.ordered * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Amiodarone pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  insulinInfusion: {
    name: 'Insulin Infusion',
    category: 'icu',
    icon: 'fa-syringe',
    description: 'units/hr to mL/hr',
    inputs: [
      { id: 'unitsHr', label: 'Dose', type: 'number', unit: 'units/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'units/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.unitsHr / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Insulin infusion rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  heparinInfusion: {
    name: 'Heparin Infusion',
    category: 'icu',
    icon: 'fa-droplet',
    description: 'units/hr to mL/hr',
    inputs: [
      { id: 'unitsHr', label: 'Dose', type: 'number', unit: 'units/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'units/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.unitsHr / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Heparin infusion rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  propofolInfusion: {
    name: 'Propofol Infusion',
    category: 'icu',
    icon: 'fa-bed',
    description: 'mcg/kg/min to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mcg/kg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      // convert mg/mL to mcg/mL
      const concMcgMl = +d.concentration * 1000;
      const mlHr = ((+d.weight * +d.doseRate) * 60) / concMcgMl;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Propofol pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  dexmedetomidineInfusion: {
    name: 'Dexmedetomidine Infusion',
    category: 'icu',
    icon: 'fa-moon',
    description: 'mcg/kg/hr to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mcg/kg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const totalMcgHr = +d.weight * +d.doseRate;
      const mlHr = totalMcgHr / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Dexmedetomidine pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  midazolamInfusion: {
    name: 'Midazolam Infusion',
    category: 'icu',
    icon: 'fa-bed-pulse',
    description: 'mg/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Midazolam pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  fentanylInfusion: {
    name: 'Fentanyl Infusion',
    category: 'icu',
    icon: 'fa-lungs',
    description: 'mcg/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mcg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mcg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Fentanyl pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  ketamineInfusion: {
    name: 'Ketamine Infusion',
    category: 'icu',
    icon: 'fa-brain',
    description: 'mg/kg/hr to mL/hr',
    inputs: [
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', required: true },
      { id: 'doseRate', label: 'Dose', type: 'number', unit: 'mg/kg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const totalMgHr = +d.weight * +d.doseRate;
      const mlHr = totalMgHr / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Ketamine pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  morphineInfusion: {
    name: 'Morphine Infusion',
    category: 'icu',
    icon: 'fa-bed',
    description: 'mg/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Morphine pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  labetalolInfusion: {
    name: 'Labetalol Infusion',
    category: 'icu',
    icon: 'fa-heart-circle-minus',
    description: 'mg/min to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mg/min', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = (+d.ordered * 60) / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Labetalol pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  diltiazemInfusion: {
    name: 'Diltiazem Infusion',
    category: 'icu',
    icon: 'fa-heart-circle-bolt',
    description: 'mg/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mg/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mg/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Diltiazem pump rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  magnesiumSulfateInfusion: {
    name: 'Magnesium Sulfate Infusion',
    category: 'icu',
    icon: 'fa-vial',
    description: 'g/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'g/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'g/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Magnesium sulfate rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  potassiumInfusion: {
    name: 'Potassium Infusion Rate',
    category: 'icu',
    icon: 'fa-bolt',
    description: 'mEq/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mEq/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mEq/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Potassium infusion rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  calciumGluconateInfusion: {
    name: 'Calcium Gluconate Infusion',
    category: 'icu',
    icon: 'fa-flask',
    description: 'g/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'g/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'g/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Calcium gluconate rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  sodiumBicarbInfusion: {
    name: 'Sodium Bicarbonate Infusion',
    category: 'icu',
    icon: 'fa-prescription-bottle-medical',
    description: 'mEq/hr to mL/hr',
    inputs: [
      { id: 'ordered', label: 'Dose', type: 'number', unit: 'mEq/hr', required: true },
      { id: 'concentration', label: 'Concentration', type: 'number', unit: 'mEq/mL', required: true }
    ],
    calculate: d => {
      const mlHr = +d.ordered / +d.concentration;
      return { value: mlHr.toFixed(2), unit: 'mL/hr', interpretation: `Sodium bicarbonate rate: ${mlHr.toFixed(2)} mL/hr` };
    }
  },

  maintenanceBagRate: {
    name: 'Bag Rate from Total Time',
    category: 'icu',
    icon: 'fa-bottle-droplet',
    description: 'mL/hr for IV bag',
    inputs: [
      { id: 'bagVolume', label: 'Bag Volume', type: 'number', unit: 'mL', required: true },
      { id: 'hours', label: 'Time', type: 'number', unit: 'hr', required: true }
    ],
    calculate: d => {
      const rate = +d.bagVolume / +d.hours;
      return { value: rate.toFixed(2), unit: 'mL/hr', interpretation: `Set bag at ${rate.toFixed(2)} mL/hr` };
    }
  },

  drugBagConcentration: {
    name: 'Drug Bag Concentration',
    category: 'icu',
    icon: 'fa-prescription-bottle',
    description: 'Total amount in bag / volume',
    inputs: [
      { id: 'drugAmount', label: 'Drug Amount', type: 'number', unit: 'mg', required: true },
      { id: 'bagVolume', label: 'Bag Volume', type: 'number', unit: 'mL', required: true }
    ],
    calculate: d => {
      const conc = +d.drugAmount / +d.bagVolume;
      return { value: conc.toFixed(2), unit: 'mg/mL', interpretation: `Bag concentration: ${conc.toFixed(2)} mg/mL` };
    }
  }
});