// ==========================================
// DATABASE.JS - Data Management
// ==========================================

// Drug Database (Sample - can be expanded)
const DRUG_DATABASE = {
  // Cardiovascular Drugs
  warfarin: {
    name: "Warfarin",
    category: "Anticoagulant",
    interactions: ["aspirin", "clopidogrel", "ibuprofen", "amiodarone", "metronidazole"],
    renalDose: false,
    hepaticDose: true
  },
  aspirin: {
    name: "Aspirin",
    category: "Antiplatelet",
    interactions: ["warfarin", "clopidogrel", "ibuprofen", "heparin"],
    renalDose: false,
    hepaticDose: false
  },
  clopidogrel: {
    name: "Clopidogrel",
    category: "Antiplatelet",
    interactions: ["warfarin", "aspirin", "omeprazole"],
    renalDose: false,
    hepaticDose: true
  },
  amiodarone: {
    name: "Amiodarone",
    category: "Antiarrhythmic",
    interactions: ["warfarin", "digoxin", "simvastatin", "diltiazem"],
    renalDose: false,
    hepaticDose: true
  },
  
  // Antibiotics
  vancomycin: {
    name: "Vancomycin",
    category: "Antibiotic",
    interactions: ["gentamicin", "tobramycin", "furosemide"],
    renalDose: true,
    hepaticDose: false,
    tdm: true // Therapeutic Drug Monitoring required
  },
  gentamicin: {
    name: "Gentamicin",
    category: "Aminoglycoside",
    interactions: ["vancomycin", "furosemide", "amphotericin"],
    renalDose: true,
    hepaticDose: false,
    tdm: true
  },
  metronidazole: {
    name: "Metronidazole",
    category: "Antibiotic",
    interactions: ["warfarin", "phenytoin", "lithium"],
    renalDose: false,
    hepaticDose: true
  },
  
  // NSAIDs
  ibuprofen: {
    name: "Ibuprofen",
    category: "NSAID",
    interactions: ["warfarin", "aspirin", "lisinopril", "furosemide"],
    renalDose: true,
    hepaticDose: false
  },
  
  // Diuretics
  furosemide: {
    name: "Furosemide",
    category: "Loop Diuretic",
    interactions: ["gentamicin", "vancomycin", "digoxin", "lithium"],
    renalDose: true,
    hepaticDose: false
  },
  
  // Cardiac Glycosides
  digoxin: {
    name: "Digoxin",
    category: "Cardiac Glycoside",
    interactions: ["amiodarone", "verapamil", "quinidine", "furosemide"],
    renalDose: true,
    hepaticDose: false,
    tdm: true
  },
  
  // ACE Inhibitors
  lisinopril: {
    name: "Lisinopril",
    category: "ACE Inhibitor",
    interactions: ["ibuprofen", "spironolactone", "potassium"],
    renalDose: true,
    hepaticDose: false
  },
  
  // Anticonvulsants
  phenytoin: {
    name: "Phenytoin",
    category: "Anticonvulsant",
    interactions: ["warfarin", "metronidazole", "omeprazole", "carbamazepine"],
    renalDose: false,
    hepaticDose: true,
    tdm: true
  },
  
  // Proton Pump Inhibitors
  omeprazole: {
    name: "Omeprazole",
    category: "PPI",
    interactions: ["clopidogrel", "phenytoin", "warfarin"],
    renalDose: false,
    hepaticDose: true
  }
};

// Drug Interaction Details
const DRUG_INTERACTIONS = {
  "warfarin-aspirin": {
    severity: "major",
    risk: "Increased bleeding risk",
    mechanism: "Both drugs affect coagulation; aspirin inhibits platelet aggregation while warfarin inhibits clotting factors.",
    management: "Monitor INR closely. Consider alternative antiplatelet if possible. Watch for signs of bleeding.",
    alternatives: ["Consider proton pump inhibitor for GI protection"]
  },
  "warfarin-amiodarone": {
    severity: "major",
    risk: "Significantly increased INR and bleeding risk",
    mechanism: "Amiodarone inhibits CYP2C9, reducing warfarin metabolism.",
    management: "Reduce warfarin dose by 30-50%. Monitor INR closely (every 3-7 days initially).",
    alternatives: []
  },
  "warfarin-metronidazole": {
    severity: "major",
    risk: "Increased INR and bleeding risk",
    mechanism: "Metronidazole inhibits CYP2C9, reducing warfarin metabolism.",
    management: "Monitor INR closely. May need to reduce warfarin dose temporarily.",
    alternatives: ["Consider alternative antibiotic if appropriate"]
  },
  "vancomycin-gentamicin": {
    severity: "major",
    risk: "Increased nephrotoxicity and ototoxicity",
    mechanism: "Additive toxic effects on kidneys and auditory system.",
    management: "Avoid combination if possible. If necessary, monitor renal function closely and perform TDM.",
    alternatives: ["Use alternative antibiotic if feasible"]
  },
  "clopidogrel-omeprazole": {
    severity: "moderate",
    risk: "Reduced antiplatelet effect",
    mechanism: "Omeprazole inhibits CYP2C19, reducing clopidogrel activation.",
    management: "Consider alternative PPI (pantoprazole) or H2 blocker.",
    alternatives: ["Pantoprazole", "Famotidine"]
  },
  "digoxin-amiodarone": {
    severity: "major",
    risk: "Increased digoxin levels and toxicity",
    mechanism: "Amiodarone reduces digoxin clearance and increases absorption.",
    management: "Reduce digoxin dose by 50%. Monitor digoxin levels closely.",
    alternatives: []
  },
  "lisinopril-ibuprofen": {
    severity: "moderate",
    risk: "Reduced antihypertensive effect, increased renal impairment risk",
    mechanism: "NSAIDs reduce prostaglandin synthesis, affecting renal blood flow and blood pressure.",
    management: "Monitor blood pressure and renal function. Use lowest NSAID dose for shortest duration.",
    alternatives: ["Acetaminophen for pain relief"]
  }
};

// Calculator Results Storage
class CalculatorStorage {
  constructor() {
    this.storageKey = 'medcalc_history';
    this.favoritesKey = 'medcalc_favorites';
  }

  // Save calculation to history
  saveCalculation(calculatorId, data, result) {
    const history = this.getHistory();
    const entry = {
      id: Date.now(),
      calculatorId: calculatorId,
      calculatorName: data.name || calculatorId,
      data: data,
      result: result,
      timestamp: new Date().toISOString(),
      user: getCurrentUser()?.name || 'Unknown'
    };
    
    history.unshift(entry); // Add to beginning
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history.pop();
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(history));
    return entry;
  }

  // Get calculation history
  getHistory(limit = 50) {
    const history = localStorage.getItem(this.storageKey);
    if (!history) return [];
    
    const parsed = JSON.parse(history);
    return limit ? parsed.slice(0, limit) : parsed;
  }

  // Clear history
  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }

  // Toggle favorite calculator
  toggleFavorite(calculatorId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(calculatorId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(calculatorId);
    }
    
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    return favorites;
  }

  // Get favorites
  getFavorites() {
    const favorites = localStorage.getItem(this.favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  // Check if calculator is favorite
  isFavorite(calculatorId) {
    return this.getFavorites().includes(calculatorId);
  }
}

// PDF Storage
class PDFStorage {
  constructor() {
    this.storageKey = 'medcalc_pdfs';
  }

  // Save PDF metadata
  savePDF(pdfData) {
    const pdfs = this.getPDFs();
    const entry = {
      id: Date.now(),
      title: pdfData.title,
      category: pdfData.category,
      description: pdfData.description,
      fileName: pdfData.fileName,
      fileSize: pdfData.fileSize,
      uploadedBy: getCurrentUser()?.name || 'Unknown',
      uploadDate: new Date().toISOString()
    };
    
    pdfs.unshift(entry);
    localStorage.setItem(this.storageKey, JSON.stringify(pdfs));
    return entry;
  }

  // Get all PDFs
  getPDFs(category = null) {
    const pdfs = localStorage.getItem(this.storageKey);
    if (!pdfs) return this.getDefaultPDFs();
    
    const parsed = JSON.parse(pdfs);
    
    if (category && category !== 'all') {
      return parsed.filter(pdf => pdf.category === category);
    }
    
    return parsed;
  }

  // Get default PDFs (sample data)
  getDefaultPDFs() {
    return [
      {
        id: 1,
        title: "Hospital Formulary 2024",
        category: "formulary",
        description: "Complete drug list with dosing guidelines",
        fileName: "formulary2024.pdf",
        fileSize: "2.4 MB",
        uploadedBy: "Admin",
        uploadDate: "2024-01-15",
        pages: 245
      },
      {
        id: 2,
        title: "Sepsis Management Protocol",
        category: "protocols",
        description: "ICU sepsis treatment guidelines",
        fileName: "sepsis-protocol.pdf",
        fileSize: "856 KB",
        uploadedBy: "Admin",
        uploadDate: "2023-12-10",
        pages: 18
      },
      {
        id: 3,
        title: "Drug Interaction Tables",
        category: "interactions",
        description: "Major drug-drug interactions reference",
        fileName: "interactions.pdf",
        fileSize: "1.2 MB",
        uploadedBy: "Pharmacy Dept",
        uploadDate: "2023-11-20",
        pages: 52
      }
    ];
  }

  // Delete PDF
  deletePDF(id) {
    const pdfs = this.getPDFs();
    const filtered = pdfs.filter(pdf => pdf.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}

// Notification Storage
class NotificationStorage {
  constructor() {
    this.storageKey = 'medcalc_notifications';
  }

  // Add notification
  addNotification(type, title, message) {
    const notifications = this.getNotifications();
    const entry = {
      id: Date.now(),
      type: type, // 'warning', 'info', 'success', 'error'
      title: title,
      message: message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(entry);
    
    // Keep only last 50
    if (notifications.length > 50) {
      notifications.pop();
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    this.updateBadge();
    return entry;
  }

  // Get notifications
  getNotifications(unreadOnly = false) {
    const notifications = localStorage.getItem(this.storageKey);
    if (!notifications) return this.getDefaultNotifications();
    
    const parsed = JSON.parse(notifications);
    
    if (unreadOnly) {
      return parsed.filter(n => !n.read);
    }
    
    return parsed;
  }

  // Mark as read
  markAsRead(id) {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
      this.updateBadge();
    }
  }

  // Clear all
  clearAll() {
    localStorage.removeItem(this.storageKey);
    this.updateBadge();
  }

  // Update badge count
  updateBadge() {
    const unread = this.getNotifications(true).length;
    const badge = document.getElementById('notification-count');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'block' : 'none';
    }
  }

  // Default notifications
  getDefaultNotifications() {
    return [
      {
        id: 1,
        type: 'warning',
        title: 'Drug Interaction Alert',
        message: 'Warfarin + Aspirin - High risk detected',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New Calculator Added',
        message: 'SOFA Score Calculator is now available',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'PDF Uploaded Successfully',
        message: 'Hospital Formulary 2024.pdf',
        timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
        read: false
      }
    ];
  }
}

// Initialize storage instances
const calcStorage = new CalculatorStorage();
const pdfStorage = new PDFStorage();
const notificationStorage = new NotificationStorage();

// Export for use in other files
window.DRUG_DATABASE = DRUG_DATABASE;
window.DRUG_INTERACTIONS = DRUG_INTERACTIONS;
window.calcStorage = calcStorage;
window.pdfStorage = pdfStorage;
window.notificationStorage = notificationStorage;