/**
 * Saqr Platform — Seed Data
 * All nine SBC occupancy groups represented.
 * All calculations are deterministic from this data layer.
 */

// ─── Buildings ────────────────────────────────────────────────────────────────
export const buildings = [
  {
    id: 'bld-001',
    name: { en: 'Al Faisaliah Complex', ar: 'مجمع الفيصلية' },
    sbcType: 'M',
    sbcGroup: { en: 'Mercantile', ar: 'تجاري' },
    floors: 44,
    areaSqm: 120000,
    licenseNo: 'CR-2024-4421',
    riskScore: 74,
    activeAlerts: 3,
    status: 'active',
    region: { en: 'Riyadh – Al Olaya', ar: 'الرياض – العليا' },
    lat: 24.6883, lng: 46.6855,
    sensors: { total: 124, normal: 108, warning: 12, critical: 4 },
    licenseStatus: 'active',
    licenseExpiry: '2025-09-15',
    lastInspection: '2024-11-20',
    vendor: { en: 'Al Sager Fire Protection', ar: 'شركة الصاقر للحماية من الحرائق' },
    baseSeverity: 3,
  },
  {
    id: 'bld-002',
    name: { en: 'Burj Rafal Hotel Tower', ar: 'برج رافال للفنادق' },
    sbcType: 'R',
    sbcGroup: { en: 'Residential / Hospitality', ar: 'سكني / ضيافة' },
    floors: 71,
    areaSqm: 85000,
    licenseNo: 'CR-2024-7835',
    riskScore: 68,
    activeAlerts: 4,
    status: 'active',
    region: { en: 'Riyadh – King Fahd Road', ar: 'الرياض – طريق الملك فهد' },
    lat: 24.7136, lng: 46.6753,
    sensors: { total: 98, normal: 82, warning: 10, critical: 6 },
    licenseStatus: 'expiring',
    licenseExpiry: '2025-03-10',
    lastInspection: '2024-10-05',
    vendor: { en: 'National Safety Solutions', ar: 'حلول السلامة الوطنية' },
    baseSeverity: 4,
  },
  {
    id: 'bld-003',
    name: { en: 'Granada Mall', ar: 'غرناطة مول' },
    sbcType: 'M/A',
    sbcGroup: { en: 'Mercantile / Assembly', ar: 'تجاري / تجمعات' },
    floors: 3,
    areaSqm: 180000,
    licenseNo: 'CR-2024-3312',
    riskScore: 45,
    activeAlerts: 1,
    status: 'active',
    region: { en: 'Riyadh – Granada', ar: 'الرياض – غرناطة' },
    lat: 24.7580, lng: 46.7270,
    sensors: { total: 212, normal: 205, warning: 6, critical: 1 },
    licenseStatus: 'active',
    licenseExpiry: '2025-11-22',
    lastInspection: '2025-01-15',
    vendor: { en: 'SafeGuard Arabia', ar: 'سيف جارد العربية' },
    baseSeverity: 4,
  },
  {
    id: 'bld-004',
    name: { en: 'Al Olaya Business Park', ar: 'مجمع العليا التجاري' },
    sbcType: 'B',
    sbcGroup: { en: 'Business / Office', ar: 'أعمال / مكاتب' },
    floors: 12,
    areaSqm: 55000,
    licenseNo: 'CR-2024-9901',
    riskScore: 42,
    activeAlerts: 0,
    status: 'active',
    region: { en: 'Riyadh – Al Olaya', ar: 'الرياض – العليا' },
    lat: 24.6940, lng: 46.6860,
    sensors: { total: 64, normal: 64, warning: 0, critical: 0 },
    licenseStatus: 'active',
    licenseExpiry: '2026-01-30',
    lastInspection: '2025-01-10',
    vendor: { en: 'Al Sager Fire Protection', ar: 'شركة الصاقر للحماية من الحرائق' },
    baseSeverity: 2,
  },
  {
    id: 'bld-005',
    name: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' },
    sbcType: 'M/R/B',
    sbcGroup: { en: 'Mixed Use', ar: 'متعدد الاستخدام' },
    floors: 99,
    areaSqm: 230000,
    licenseNo: 'Insured Only',
    riskScore: 82,
    activeAlerts: 5,
    status: 'license-expired',
    region: { en: 'Riyadh – Al Olaya', ar: 'الرياض – العليا' },
    lat: 24.7110, lng: 46.6740,
    sensors: { total: 286, normal: 240, warning: 28, critical: 18 },
    licenseStatus: 'expired',
    licenseExpiry: '2024-12-01',
    lastInspection: '2024-08-22',
    vendor: { en: 'National Safety Solutions', ar: 'حلول السلامة الوطنية' },
    baseSeverity: 5,
  },
  {
    id: 'bld-006',
    name: { en: 'Riyadh Park Mall', ar: 'الرياض بارك مول' },
    sbcType: 'M/A',
    sbcGroup: { en: 'Mercantile / Assembly', ar: 'تجاري / تجمعات' },
    floors: 4,
    areaSqm: 220000,
    licenseNo: 'Insured Only',
    riskScore: 58,
    activeAlerts: 2,
    status: 'license-expiring',
    region: { en: 'Riyadh – North', ar: 'الرياض – الشمال' },
    lat: 24.7730, lng: 46.6600,
    sensors: { total: 248, normal: 232, warning: 14, critical: 2 },
    licenseStatus: 'expiring',
    licenseExpiry: '2025-02-28',
    lastInspection: '2024-09-18',
    vendor: { en: 'SafeGuard Arabia', ar: 'سيف جارد العربية' },
    baseSeverity: 4,
  },
  {
    id: 'bld-007',
    name: { en: 'Al Nakheel Medical Center', ar: 'المركز الطبي النخيل' },
    sbcType: 'I',
    sbcGroup: { en: 'Healthcare', ar: 'رعاية صحية' },
    floors: 8,
    areaSqm: 42000,
    licenseNo: 'CR-2024-1102',
    riskScore: 61,
    activeAlerts: 2,
    status: 'active',
    region: { en: 'Riyadh – Al Nakheel', ar: 'الرياض – النخيل' },
    lat: 24.7900, lng: 46.6850,
    sensors: { total: 88, normal: 76, warning: 10, critical: 2 },
    licenseStatus: 'active',
    licenseExpiry: '2025-08-14',
    lastInspection: '2024-12-03',
    vendor: { en: 'MediSafe Systems', ar: 'ميدي سيف للأنظمة' },
    baseSeverity: 5,
  },
  {
    id: 'bld-008',
    name: { en: 'Riyadh International School', ar: 'مدرسة الرياض الدولية' },
    sbcType: 'E',
    sbcGroup: { en: 'Educational', ar: 'تعليمي' },
    floors: 5,
    areaSqm: 28000,
    licenseNo: 'CR-2024-5521',
    riskScore: 38,
    activeAlerts: 0,
    status: 'active',
    region: { en: 'Riyadh – Diplomatic Quarter', ar: 'الرياض – الحي الدبلوماسي' },
    lat: 24.6870, lng: 46.6290,
    sensors: { total: 56, normal: 56, warning: 0, critical: 0 },
    licenseStatus: 'active',
    licenseExpiry: '2026-03-20',
    lastInspection: '2025-01-22',
    vendor: { en: 'SafeGuard Arabia', ar: 'سيف جارد العربية' },
    baseSeverity: 4,
  },
  {
    id: 'bld-009',
    name: { en: 'Al Jubail Industrial Facility', ar: 'منشأة الجبيل الصناعية' },
    sbcType: 'F/H',
    sbcGroup: { en: 'Industrial / High Hazard', ar: 'صناعي / خطر مرتفع' },
    floors: 3,
    areaSqm: 95000,
    licenseNo: 'CR-2024-8834',
    riskScore: 88,
    activeAlerts: 6,
    status: 'sla-active',
    region: { en: 'Al Jubail Industrial City', ar: 'مدينة الجبيل الصناعية' },
    lat: 27.0040, lng: 49.6620,
    sensors: { total: 142, normal: 104, warning: 22, critical: 16 },
    licenseStatus: 'active',
    licenseExpiry: '2025-06-30',
    lastInspection: '2024-11-08',
    vendor: { en: 'Industrial Safety Corp', ar: 'شركة السلامة الصناعية' },
    baseSeverity: 5,
  },
]

// ─── Incidents ────────────────────────────────────────────────────────────────
export const incidents = [
  {
    id: 'INC-2024-001',
    buildingId: 'bld-001',
    type: { en: 'Sprinkler Pressure Drop', ar: 'انخفاض ضغط الرشاشات' },
    severity: 'high',
    status: 'resolved',
    date: '2024-11-15',
    estimatedLoss: 0,
    confirmedLoss: 0,
    description: { en: 'Main riser pressure dropped to 45 PSI. Vendor dispatched within 3 hours.', ar: 'انخفض ضغط الرافعة الرئيسية إلى 45 PSI. تم إرسال المورد خلال 3 ساعات.' },
  },
  {
    id: 'INC-2024-002',
    buildingId: 'bld-002',
    type: { en: 'Electrical Fault — Level 34', ar: 'عطل كهربائي — الطابق 34' },
    severity: 'critical',
    status: 'settled',
    date: '2024-09-22',
    estimatedLoss: 850000,
    confirmedLoss: 720000,
    description: { en: 'Electrical arc flash in main distribution panel. Partial floor evacuation.', ar: 'ومضة قوس كهربائي في لوحة التوزيع الرئيسية. إخلاء جزئي للطابق.' },
  },
  {
    id: 'INC-2024-003',
    buildingId: 'bld-005',
    type: { en: 'Blocked Fire Exit — Level 22', ar: 'مخرج طوارئ مسدود — الطابق 22' },
    severity: 'high',
    status: 'under-review',
    date: '2025-01-08',
    estimatedLoss: 50000,
    confirmedLoss: null,
    description: { en: 'AI camera detected fire exit obstruction on level 22. Violation notice issued.', ar: 'رصدت الكاميرا بالذكاء الاصطناعي عائقاً أمام مخرج الطوارئ في الطابق 22.' },
  },
  {
    id: 'INC-2024-004',
    buildingId: 'bld-005',
    type: { en: 'License Expiry Risk Penalty', ar: 'غرامة مخاطر انتهاء الترخيص' },
    severity: 'critical',
    status: 'assessing',
    date: '2024-12-01',
    estimatedLoss: 200000,
    confirmedLoss: null,
    description: { en: 'Safety license expired. MDRE applied risk penalty, score elevated to 82.', ar: 'انتهى صلاحية ترخيص السلامة. طبّق MDRE غرامة مخاطر، ارتفع المؤشر إلى 82.' },
  },
  {
    id: 'INC-2024-005',
    buildingId: 'bld-009',
    type: { en: 'Sprinkler Pressure & Contract Lapse', ar: 'انخفاض الضغط وانتهاء العقد' },
    severity: 'critical',
    status: 'resolved',
    date: '2025-01-24',
    estimatedLoss: 0,
    confirmedLoss: 0,
    description: { en: 'Friday 2AM: sprinkler pressure 120→60 PSI, vendor contract lapsed. Score 31→96. Resolved in 2.5h.', ar: 'الجمعة 2 صباحاً: ضغط الرشاشات 120→60 PSI، انتهاء عقد المورد. المؤشر 31→96. تم الحل في 2.5 ساعة.' },
  },
  {
    id: 'INC-2024-006',
    buildingId: 'bld-007',
    type: { en: 'Smoke Detector Failure — ICU Wing', ar: 'عطل كاشف الدخان — جناح العناية المركزة' },
    severity: 'medium',
    status: 'resolved',
    date: '2024-12-18',
    estimatedLoss: 0,
    confirmedLoss: 0,
    description: { en: 'Three smoke detectors offline in ICU wing. Replaced within 6 hours.', ar: 'ثلاثة كاشفات دخان معطلة في جناح العناية المركزة. تم الاستبدال خلال 6 ساعات.' },
  },
  {
    id: 'INC-2024-007',
    buildingId: 'bld-003',
    type: { en: 'Food Court Thermal Anomaly', ar: 'شذوذ حراري في منطقة المطاعم' },
    severity: 'medium',
    status: 'resolved',
    date: '2024-10-30',
    estimatedLoss: 15000,
    confirmedLoss: 12000,
    description: { en: 'Drone thermal camera detected elevated temperature near food court exhaust ducts.', ar: 'رصدت كاميرا الطائرة المسيّرة الحرارية ارتفاع درجة الحرارة بالقرب من مجاري عادم المطاعم.' },
  },
  {
    id: 'INC-2024-008',
    buildingId: 'bld-006',
    type: { en: 'Fire Suppression Test Failure', ar: 'فشل اختبار نظام الإطفاء' },
    severity: 'high',
    status: 'under-review',
    date: '2025-01-14',
    estimatedLoss: 80000,
    confirmedLoss: null,
    description: { en: 'Annual SBC 801 suppression test failed on two zones. Re-test scheduled.', ar: 'فشل اختبار الإطفاء السنوي وفق SBC 801 في منطقتين. تم جدولة اختبار إعادة.' },
  },
]

// ─── Insurance Policies ───────────────────────────────────────────────────────
export const policies = [
  {
    id: 'POL-2024-001',
    buildingId: 'bld-001',
    insuredValue: 680000000,
    currentPremium: 1950000,
    riskScore: 74,
    lossRatio: 0,
    trend: 'up',
    riskFactors: {
      fireSuppression: { score: 72, weight: 0.30 },
      electrical:      { score: 78, weight: 0.25 },
      sensorCoverage:  { score: 85, weight: 0.20 },
      inspectionComp:  { score: 68, weight: 0.15 },
      evacuation:      { score: 70, weight: 0.10 },
    },
  },
  {
    id: 'POL-2024-002',
    buildingId: 'bld-002',
    insuredValue: 520000000,
    currentPremium: 1430000,
    riskScore: 68,
    lossRatio: 55,
    trend: 'up',
    riskFactors: {
      fireSuppression: { score: 65, weight: 0.30 },
      electrical:      { score: 88, weight: 0.25 },
      sensorCoverage:  { score: 74, weight: 0.20 },
      inspectionComp:  { score: 60, weight: 0.15 },
      evacuation:      { score: 55, weight: 0.10 },
    },
  },
  {
    id: 'POL-2024-003',
    buildingId: 'bld-005',
    insuredValue: 1200000000,
    currentPremium: 2800000,
    riskScore: 82,
    lossRatio: 62,
    trend: 'up',
    riskFactors: {
      fireSuppression: { score: 80, weight: 0.30 },
      electrical:      { score: 88, weight: 0.25 },
      sensorCoverage:  { score: 75, weight: 0.20 },
      inspectionComp:  { score: 30, weight: 0.15 },
      evacuation:      { score: 65, weight: 0.10 },
    },
  },
  {
    id: 'POL-2024-004',
    buildingId: 'bld-006',
    insuredValue: 980000000,
    currentPremium: 2200000,
    riskScore: 58,
    lossRatio: 38,
    trend: 'stable',
    riskFactors: {
      fireSuppression: { score: 55, weight: 0.30 },
      electrical:      { score: 62, weight: 0.25 },
      sensorCoverage:  { score: 70, weight: 0.20 },
      inspectionComp:  { score: 52, weight: 0.15 },
      evacuation:      { score: 48, weight: 0.10 },
    },
  },
  {
    id: 'POL-2024-005',
    buildingId: 'bld-007',
    insuredValue: 310000000,
    currentPremium: 780000,
    riskScore: 61,
    lossRatio: 12,
    trend: 'stable',
    riskFactors: {
      fireSuppression: { score: 60, weight: 0.30 },
      electrical:      { score: 55, weight: 0.25 },
      sensorCoverage:  { score: 72, weight: 0.20 },
      inspectionComp:  { score: 65, weight: 0.15 },
      evacuation:      { score: 58, weight: 0.10 },
    },
  },
  {
    id: 'POL-2024-006',
    buildingId: 'bld-009',
    insuredValue: 230000000,
    currentPremium: 680000,
    riskScore: 88,
    lossRatio: 8,
    trend: 'down',
    riskFactors: {
      fireSuppression: { score: 92, weight: 0.30 },
      electrical:      { score: 82, weight: 0.25 },
      sensorCoverage:  { score: 88, weight: 0.20 },
      inspectionComp:  { score: 78, weight: 0.15 },
      evacuation:      { score: 75, weight: 0.10 },
    },
  },
]

// ─── Civil Defense Units ──────────────────────────────────────────────────────
export const cdUnits = [
  { id: 'UNIT-01', name: { en: 'Unit 01 — Al Olaya Station', ar: 'وحدة 01 — محطة العليا' }, status: 'available', crew: 6, specialization: 'general', incidentId: null, eta: null },
  { id: 'UNIT-02', name: { en: 'Unit 02 — King Fahd Station', ar: 'وحدة 02 — محطة الملك فهد' }, status: 'on-scene', crew: 8, specialization: 'high-rise', incidentId: 'INC-2024-003', eta: null },
  { id: 'UNIT-03', name: { en: 'Unit 03 — Nakheel Station', ar: 'وحدة 03 — محطة النخيل' }, status: 'deployed', crew: 5, specialization: 'general', incidentId: 'INC-2024-006', eta: '12 min' },
  { id: 'UNIT-04', name: { en: 'Unit 04 — HAZMAT Unit', ar: 'وحدة 04 — وحدة المواد الخطرة' }, status: 'available', crew: 10, specialization: 'hazmat', incidentId: null, eta: null },
  { id: 'UNIT-05', name: { en: 'Unit 05 — Jubail Station', ar: 'وحدة 05 — محطة الجبيل' }, status: 'returning', crew: 6, specialization: 'industrial', incidentId: null, eta: '8 min' },
  { id: 'UNIT-06', name: { en: 'Unit 06 — Granada Station', ar: 'وحدة 06 — محطة غرناطة' }, status: 'available', crew: 7, specialization: 'general', incidentId: null, eta: null },
  { id: 'UNIT-07', name: { en: 'Unit 07 — North Riyadh Station', ar: 'وحدة 07 — محطة شمال الرياض' }, status: 'deployed', crew: 6, specialization: 'general', incidentId: 'INC-2024-008', eta: '22 min' },
]

// ─── AI-Detected Violations ───────────────────────────────────────────────────
export const violations = [
  { id: 'VIO-001', buildingId: 'bld-005', type: { en: 'Blocked Fire Exit', ar: 'مخرج طوارئ مسدود' }, confidence: 94, location: { en: 'Level 22 — East Corridor', ar: 'الطابق 22 — الممر الشرقي' }, severity: 'critical', status: 'pending' },
  { id: 'VIO-002', buildingId: 'bld-001', type: { en: 'Missing Fire Extinguisher', ar: 'طفاية حريق مفقودة' }, confidence: 88, location: { en: 'Level 8 — Parking Lobby', ar: 'الطابق 8 — بهو المواقف' }, severity: 'high', status: 'pending' },
  { id: 'VIO-003', buildingId: 'bld-009', type: { en: 'Unsafe Electrical Installation', ar: 'تركيب كهربائي غير آمن' }, confidence: 91, location: { en: 'Warehouse Zone C', ar: 'منطقة المستودع C' }, severity: 'critical', status: 'pending' },
  { id: 'VIO-004', buildingId: 'bld-002', type: { en: 'Expired Safety Signage', ar: 'لافتات سلامة منتهية الصلاحية' }, confidence: 79, location: { en: 'Level 34 — Emergency Stairwell', ar: 'الطابق 34 — درج الطوارئ' }, severity: 'medium', status: 'pending' },
  { id: 'VIO-005', buildingId: 'bld-006', type: { en: 'Obstructed Sprinkler Head', ar: 'رأس رشاش محجوب' }, confidence: 86, location: { en: 'Zone B — Storage Room 12', ar: 'المنطقة B — غرفة التخزين 12' }, severity: 'high', status: 'pending' },
]

// ─── Licenses ─────────────────────────────────────────────────────────────────
export const licenses = [
  { id: 'LIC-001', buildingId: 'bld-001', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'active', issueDate: '2024-09-15', expiryDate: '2025-09-15', officer: 'Lt. Khalid Al-Harbi', stage: null },
  { id: 'LIC-002', buildingId: 'bld-002', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'expiring', issueDate: '2024-03-10', expiryDate: '2025-03-10', officer: 'Capt. Saad Al-Mutairi', stage: 'renewal-pending' },
  { id: 'LIC-003', buildingId: 'bld-003', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'active', issueDate: '2024-11-22', expiryDate: '2025-11-22', officer: 'Lt. Khalid Al-Harbi', stage: null },
  { id: 'LIC-004', buildingId: 'bld-004', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'active', issueDate: '2025-01-30', expiryDate: '2026-01-30', officer: 'Maj. Faisal Al-Dossari', stage: null },
  { id: 'LIC-005', buildingId: 'bld-005', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'expired', issueDate: '2023-12-01', expiryDate: '2024-12-01', officer: 'Capt. Saad Al-Mutairi', stage: 'enforcement' },
  { id: 'LIC-006', buildingId: 'bld-006', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'expiring', issueDate: '2024-02-28', expiryDate: '2025-02-28', officer: 'Lt. Khalid Al-Harbi', stage: 'renewal-initiated' },
  { id: 'LIC-007', buildingId: 'bld-007', type: { en: 'Fire Safety Certificate', ar: 'شهادة سلامة الحريق' }, status: 'active', issueDate: '2024-08-14', expiryDate: '2025-08-14', officer: 'Maj. Faisal Al-Dossari', stage: null },
  { id: 'LIC-008', buildingId: 'bld-009', type: { en: 'Hazardous Materials Permit', ar: 'تصريح المواد الخطرة' }, status: 'active', issueDate: '2024-06-30', expiryDate: '2025-06-30', officer: 'Capt. Saad Al-Mutairi', stage: null },
]

// ─── Drones ───────────────────────────────────────────────────────────────────
export const drones = [
  { id: 'DRN-001', name: 'Falcon Alpha', status: 'airborne', altitude: 85, battery: 72, thermal: true, area: { en: 'Al Olaya District', ar: 'حي العليا' } },
  { id: 'DRN-002', name: 'Falcon Beta',  status: 'charging', altitude: 0,  battery: 34, thermal: true, area: { en: 'King Fahd Road', ar: 'طريق الملك فهد' } },
  { id: 'DRN-003', name: 'Falcon Gamma', status: 'standby',  altitude: 0,  battery: 98, thermal: false, area: { en: 'Al Jubail Zone', ar: 'منطقة الجبيل' } },
  { id: 'DRN-004', name: 'Falcon Delta', status: 'airborne', altitude: 62, battery: 88, thermal: true, area: { en: 'Granada District', ar: 'حي غرناطة' } },
  { id: 'DRN-005', name: 'Falcon Epsilon', status: 'standby', altitude: 0, battery: 100, thermal: true, area: { en: 'North Riyadh', ar: 'شمال الرياض' } },
]

// ─── Policy Engine Rules ──────────────────────────────────────────────────────
export const policyRules = [
  { id: 'RULE-001', name: { en: 'Sprinkler Pressure Minimum Threshold', ar: 'حد الضغط الأدنى للرشاشات' }, domain: 'fire-safety', aiStatus: 'active', severity: 'critical', violations: 12 },
  { id: 'RULE-002', name: { en: 'Fire Exit Clearance — 1.2m Minimum', ar: 'إخلاء مخرج الطوارئ — 1.2م كحد أدنى' }, domain: 'evacuation', aiStatus: 'active', severity: 'high', violations: 8 },
  { id: 'RULE-003', name: { en: 'Electrical Panel Clearance Zone', ar: 'منطقة إخلاء لوحة الكهرباء' }, domain: 'electrical', aiStatus: 'active', severity: 'high', violations: 5 },
  { id: 'RULE-004', name: { en: 'Group H MAQ Threshold Monitoring', ar: 'مراقبة حد MAQ للمجموعة H' }, domain: 'hazmat', aiStatus: 'active', severity: 'critical', violations: 3 },
  { id: 'RULE-005', name: { en: 'Emergency Lighting — 90-Minute Test', ar: 'اختبار الإضاءة الطارئة — 90 دقيقة' }, domain: 'evacuation', aiStatus: 'active', severity: 'medium', violations: 15 },
  { id: 'RULE-006', name: { en: 'BMS Integration Data Freshness', ar: 'حداثة بيانات تكامل BMS' }, domain: 'fire-safety', aiStatus: 'in-development', severity: 'medium', violations: 0 },
  { id: 'RULE-007', name: { en: 'Vendor Accreditation Auto-Check', ar: 'الفحص التلقائي لاعتماد المورد' }, domain: 'compliance', aiStatus: 'active', severity: 'high', violations: 7 },
  { id: 'RULE-008', name: { en: 'Thermal Camera Coverage Density', ar: 'كثافة تغطية الكاميرا الحرارية' }, domain: 'surveillance', aiStatus: 'draft', severity: 'low', violations: 0 },
]

// ─── Training Programs ────────────────────────────────────────────────────────
export const trainingPrograms = [
  { id: 'TRN-001', name: { en: 'High-Rise Fire Evacuation Simulation', ar: 'محاكاة إخلاء الحريق في الأبراج' }, modality: 'VR', enrolled: 48, completion: 72, nextSession: '2025-02-15' },
  { id: 'TRN-002', name: { en: 'HAZMAT Incident Response', ar: 'الاستجابة لحوادث المواد الخطرة' }, modality: 'SIM', enrolled: 24, completion: 58, nextSession: '2025-02-22' },
  { id: 'TRN-003', name: { en: 'AI-Assisted Inspection Workflow', ar: 'سير عمل الفحص المدعوم بالذكاء الاصطناعي' }, modality: 'AI', enrolled: 82, completion: 91, nextSession: '2025-03-01' },
  { id: 'TRN-004', name: { en: 'Mass Evacuation Coordination', ar: 'تنسيق الإخلاء الجماعي' }, modality: 'AR', enrolled: 36, completion: 44, nextSession: '2025-02-28' },
  { id: 'TRN-005', name: { en: 'Chemical Spill Emergency Protocol', ar: 'بروتوكول طوارئ الانسكاب الكيميائي' }, modality: 'VR', enrolled: 18, completion: 83, nextSession: '2025-03-08' },
]

// ─── Awareness Campaigns ──────────────────────────────────────────────────────
export const campaigns = [
  { id: 'CAM-001', name: { en: 'Home Fire Safety — Ramadan Campaign', ar: 'السلامة من الحريق في المنزل — حملة رمضان' }, reach: 1240000, status: 'active', channels: ['Social Media', 'TV', 'SMS'] },
  { id: 'CAM-002', name: { en: 'Building Owner Compliance Awareness', ar: 'توعية أصحاب المباني بالامتثال' }, reach: 48000, status: 'active', channels: ['Email', 'In-App'] },
  { id: 'CAM-003', name: { en: 'School Safety Drill Program', ar: 'برنامج تدريبات السلامة المدرسية' }, reach: 320000, status: 'planned', channels: ['SMS', 'In-Person'] },
  { id: 'CAM-004', name: { en: 'Industrial Zone Safety Standards', ar: 'معايير السلامة في المناطق الصناعية' }, reach: 85000, status: 'completed', channels: ['Email', 'Print', 'In-Person'] },
]

// ─── Marketplace Products ─────────────────────────────────────────────────────
export const products = [
  {
    id: 'PRD-001',
    name: { en: 'Saqr Platform Subscription', ar: 'الاشتراك بمنظومة صقر' },
    category: { en: 'Platform', ar: 'المنصة' },
    badge: 'OFFICIAL',
    features: [
      { en: 'Centralized safety management', ar: 'إدارة مركزية للسلامة' },
      { en: 'Civil Defense API integration', ar: 'تكامل مع واجهة برمجة الدفاع المدني' },
      { en: 'Real-time compliance tracking', ar: 'تتبع الامتثال في الوقت الفعلي' },
      { en: 'Bilingual dashboard', ar: 'لوحة تحكم ثنائية اللغة' },
    ],
    pricing: { en: 'From SAR 15,000/yr per building', ar: 'من 15,000 ريال/سنة للمبنى' },
    installed: true,
  },
  {
    id: 'PRD-002',
    name: { en: 'Smart Field Sensors', ar: 'المستشعرات الميدانية الذكية' },
    category: { en: 'Hardware', ar: 'الأجهزة' },
    badge: 'CERTIFIED',
    features: [
      { en: 'Temperature & smoke detection', ar: 'كشف الحرارة والدخان' },
      { en: 'Gas & sprinkler pressure sensors', ar: 'مستشعرات الغاز وضغط الرشاشات' },
      { en: 'Instant alerts to MDRE', ar: 'تنبيهات فورية لـ MDRE' },
      { en: 'BMS & MQTT compatible', ar: 'متوافق مع BMS وبروتوكول MQTT' },
    ],
    pricing: { en: 'From SAR 2,500 per sensor', ar: 'من 2,500 ريال للمستشعر' },
    installed: true,
  },
  {
    id: 'PRD-003',
    name: { en: 'Proactive Surveillance', ar: 'الرصد الوقائي' },
    category: { en: 'Surveillance', ar: 'المراقبة' },
    badge: 'NEW',
    features: [
      { en: 'Thermal drone monitoring', ar: 'مراقبة طائرات مسيرة حرارية' },
      { en: 'Perimeter & roof scanning', ar: 'مسح المحيط والسطح' },
      { en: 'AI anomaly detection', ar: 'كشف الشذوذ بالذكاء الاصطناعي' },
      { en: 'Integration with MDRE risk scoring', ar: 'تكامل مع تقييم مخاطر MDRE' },
    ],
    pricing: { en: 'SAR 48,000/yr per site', ar: '48,000 ريال/سنة للموقع' },
    installed: false,
  },
  {
    id: 'PRD-004',
    name: { en: 'Foresight & Prediction', ar: 'الاستشراف والتنبؤ' },
    category: { en: 'AI Analytics', ar: 'التحليلات الذكية' },
    badge: 'AI',
    features: [
      { en: 'AI risk data lake', ar: 'بحيرة بيانات المخاطر بالذكاء الاصطناعي' },
      { en: 'Predictive early warning reports', ar: 'تقارير الإنذار المبكر التنبؤي' },
      { en: 'National risk maps', ar: 'خرائط المخاطر الوطنية' },
      { en: 'Portfolio trend analytics', ar: 'تحليلات اتجاهات المحفظة' },
    ],
    pricing: { en: 'SAR 95,000/yr per portfolio', ar: '95,000 ريال/سنة للمحفظة' },
    installed: false,
  },
  {
    id: 'PRD-005',
    name: { en: 'Automatic Fire Suppression', ar: 'الإطفاء التلقائي' },
    category: { en: 'Hardware', ar: 'الأجهزة' },
    badge: 'CERTIFIED',
    features: [
      { en: 'Multi-technology suppression', ar: 'إطفاء متعدد التقنيات' },
      { en: 'Water sprinkler + foam systems', ar: 'رشاشات مياه + أنظمة رغوة' },
      { en: 'Integrated with Saqr platform', ar: 'متكامل مع منظومة صقر' },
      { en: 'Auto-trigger on MDRE critical alert', ar: 'تفعيل تلقائي عند تنبيه MDRE الحرج' },
    ],
    pricing: { en: 'Custom quote per building', ar: 'عرض سعر مخصص للمبنى' },
    installed: false,
  },
  {
    id: 'PRD-006',
    name: { en: 'Behavioral Risk Detection', ar: 'كشف المخاطر السلوكية' },
    category: { en: 'AI Analytics', ar: 'التحليلات الذكية' },
    badge: 'AI',
    features: [
      { en: 'AI visual behavior analysis', ar: 'تحليل سلوكي مرئي بالذكاء الاصطناعي' },
      { en: 'Unsafe behavior flagging', ar: 'رصد السلوكيات غير الآمنة' },
      { en: 'Compliance pattern tracking', ar: 'تتبع نمط الامتثال' },
      { en: 'Risk score contribution', ar: 'مساهمة في تقييم درجة المخاطر' },
    ],
    pricing: { en: 'SAR 36,000/yr per site', ar: '36,000 ريال/سنة للموقع' },
    installed: false,
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────
export const getRiskBand = (score) => {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

export const getRiskColor = (score) => {
  const band = getRiskBand(score)
  return {
    critical: { bg: '#7F1D1D', text: '#FFFFFF', badge: 'risk-critical' },
    high:     { bg: '#DC2626', text: '#FFFFFF', badge: 'risk-high' },
    medium:   { bg: '#D97706', text: '#FFFFFF', badge: 'risk-medium' },
    low:      { bg: '#16A34A', text: '#FFFFFF', badge: 'risk-low' },
  }[band]
}

export const calcRecommendedPremium = (insuredValue, riskScore) =>
  Math.round(insuredValue * 0.002 * (riskScore / 50))

export const formatSAR = (amount) =>
  new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(amount)

export const formatNum = (n) =>
  new Intl.NumberFormat('en').format(n)

export const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
