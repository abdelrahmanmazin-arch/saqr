/**
 * Civil Defense Portal — Comprehensive Seed Data
 * Matches the CD Portal deep-dive spec exactly.
 */

// ─── Active Incidents (6: 2 CRITICAL, 2 HIGH, 1 MEDIUM, 1 LOW) ───────────────
export const cdIncidents = [
  {
    id: 'INC-CD-001',
    buildingId: 'bld-009',
    buildingName: { en: 'Al Jubail Industrial Facility', ar: 'منشأة الجبيل الصناعية' },
    sbcType: 'F/H',
    type: { en: 'Chemical Storage MAQ Breach', ar: 'خرق الحد الأقصى للمواد الكيميائية' },
    severity: 'critical',
    status: 'dispatched',
    layer: 4,
    startTime: '02:14',
    elapsed: '1h 42m',
    assignedUnit: 'UNIT-05',
    bsoResponse: 'escalated',
    volunteersEnRoute: 1,
    sensorData: { co2: '8.2%', temp: '58°C', pressure: '42 PSI' },
    escalationHistory: [
      { layer: 1, time: '02:14:00', action: { en: 'Multi-sensor cross-validation confirmed — CO₂, temp, and pressure simultaneously anomalous', ar: 'تم تأكيد التحقق المتقاطع للمستشعرات — شذوذ متزامن في CO₂ والحرارة والضغط' } },
      { layer: 2, time: '02:14:03', action: { en: 'BSO Ali Al-Qahtani notified. No response within 60 seconds.', ar: 'تم إخطار BSO علي القحطاني. لا استجابة خلال 60 ثانية.' } },
      { layer: 3, time: '02:15:05', action: { en: 'Volunteer VOL-003 alerted (2.1 km). Suppression auto-activated — foam system engaged.', ar: 'تنبيه المتطوع VOL-003 (2.1 كم). تفعيل الإطفاء التلقائي — تشغيل نظام الرغوة.' } },
      { layer: 4, time: '02:16:10', action: { en: 'UNIT-05 (HAZMAT) auto-dispatched. ETA 18 min. HAZMAT perimeter alert issued.', ar: 'إرسال آلي لوحدة UNIT-05 (مواد خطرة). وقت الوصول 18 دقيقة. صدر تنبيه المحيط.' } },
    ],
    cameraSnapshot: true,
  },
  {
    id: 'INC-CD-002',
    buildingId: 'bld-005',
    buildingName: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' },
    sbcType: 'M/R/B',
    type: { en: 'Blocked Fire Exit + Expired License', ar: 'مخرج طوارئ مسدود + ترخيص منتهي' },
    severity: 'critical',
    status: 'on-scene',
    layer: 4,
    startTime: '08:32',
    elapsed: '3h 15m',
    assignedUnit: 'UNIT-01',
    bsoResponse: 'responded',
    volunteersEnRoute: 0,
    sensorData: { exits: '2 of 6 blocked', licenseExpired: '410 days', riskScore: 82 },
    escalationHistory: [
      { layer: 1, time: '08:32:00', action: { en: 'AI camera AV-002 detected blocked exit Level 22 (87% confidence). Cross-validated with sensor data.', ar: 'كاميرا AI AV-002 اكتشفت مخرجاً مسدوداً في الطابق 22 (ثقة 87%). تم التحقق المتقاطع.' } },
      { layer: 2, time: '08:32:04', action: { en: 'BSO Mahmoud Al-Rashid notified. Responded: "I am addressing."', ar: 'تم إخطار BSO محمود الراشد. ردّ: "أعالج الأمر."' } },
      { layer: 4, time: '08:42:00', action: { en: 'BSO reported unable to resolve. UNIT-01 dispatched for enforcement inspection.', ar: 'BSO أفاد بعجزه عن الحل. تم إرسال UNIT-01 لفحص التطبيق.' } },
    ],
    cameraSnapshot: true,
  },
  {
    id: 'INC-CD-003',
    buildingId: 'bld-001',
    buildingName: { en: 'Al Faisaliah Complex', ar: 'مجمع الفيصلية' },
    sbcType: 'M',
    type: { en: 'Sprinkler Pressure Drop — Zone B4', ar: 'انخفاض ضغط الرشاشات — المنطقة B4' },
    severity: 'high',
    status: 'deployed',
    layer: 4,
    startTime: '10:05',
    elapsed: '45m',
    assignedUnit: 'UNIT-02',
    bsoResponse: 'false-alarm-overridden',
    volunteersEnRoute: 1,
    sensorData: { pressure: '38 PSI (normal: 120 PSI)', zone: 'B4 Parking Level' },
    escalationHistory: [
      { layer: 1, time: '10:05:00', action: { en: 'Pressure sensor PS-B4-07 detected drop to 38 PSI. Confirmed by PS-B4-08.', ar: 'مستشعر الضغط PS-B4-07 رصد انخفاضاً إلى 38 PSI. تأكد من PS-B4-08.' } },
      { layer: 2, time: '10:05:03', action: { en: 'BSO notified. Dismissed as "false alarm". Sensors continued dropping.', ar: 'تم إخطار BSO. رفضه كـ"إنذار كاذب". استمر انخفاض المستشعرات.' } },
      { layer: 3, time: '10:06:10', action: { en: 'System overrode BSO dismissal (rising sensor trajectory). VOL-001 alerted.', ar: 'تجاوز النظام رفض BSO (مسار مستشعر متصاعد). تنبيه VOL-001.' } },
      { layer: 4, time: '10:07:15', action: { en: 'UNIT-02 dispatched. Vendor Al Sager Fire Protection also notified.', ar: 'إرسال UNIT-02. تنبيه المورد شركة الصاقر أيضاً.' } },
    ],
    cameraSnapshot: false,
  },
  {
    id: 'INC-CD-004',
    buildingId: 'bld-002',
    buildingName: { en: 'Burj Rafal Hotel Tower', ar: 'برج رافال للفنادق' },
    sbcType: 'R',
    type: { en: 'Electrical Panel Overheat — Floor 15 HVAC', ar: 'ارتفاع حرارة لوحة كهرباء — مكيف الطابق 15' },
    severity: 'high',
    status: 'bso-resolving',
    layer: 2,
    startTime: '11:18',
    elapsed: '22m',
    assignedUnit: null,
    bsoResponse: 'responding',
    volunteersEnRoute: 0,
    sensorData: { temp: '51°C (normal: 30°C)', panel: 'HVAC-15-DB-03' },
    escalationHistory: [
      { layer: 1, time: '11:18:00', action: { en: 'Thermal camera TH-039 flagged HVAC room at 51°C. No secondary sensor yet.', ar: 'الكاميرا الحرارية TH-039 رصدت غرفة المكيف بـ 51°C. لا مستشعر ثانوي بعد.' } },
      { layer: 2, time: '11:18:04', action: { en: 'BSO Sara Al-Mansouri notified. Responded: "I am responding — engineer dispatched."', ar: 'تم إخطار BSO سارة المنصوري. ردّت: "أستجيب — تم إرسال مهندس."' } },
    ],
    cameraSnapshot: true,
  },
  {
    id: 'INC-CD-005',
    buildingId: 'bld-003',
    buildingName: { en: 'Granada Mall', ar: 'غرناطة مول' },
    sbcType: 'M/A',
    type: { en: 'Smoke Detector Offline — Zone 3 Food Court', ar: 'كاشف دخان معطل — المنطقة 3 منطقة المطاعم' },
    severity: 'medium',
    status: 'watch',
    layer: 1,
    startTime: '09:44',
    elapsed: '1h 06m',
    assignedUnit: null,
    bsoResponse: 'notified',
    volunteersEnRoute: 0,
    sensorData: { detectors: '3 offline of 18 in Zone 3' },
    escalationHistory: [
      { layer: 1, time: '09:44:00', action: { en: 'Watch event: 3 smoke detectors went offline simultaneously. No secondary anomaly. Re-checking every 30s.', ar: 'حدث مراقبة: 3 كاشفات دخان أُغلقت في آن واحد. لا شذوذ ثانوي. إعادة فحص كل 30 ث.' } },
    ],
    cameraSnapshot: false,
  },
  {
    id: 'INC-CD-006',
    buildingId: 'bld-006',
    buildingName: { en: 'Riyadh Park Mall', ar: 'الرياض بارك مول' },
    sbcType: 'M/A',
    type: { en: 'Emergency Lighting Failure — 3 Zones', ar: 'عطل إضاءة طارئة — 3 مناطق' },
    severity: 'low',
    status: 'pending-bso',
    layer: 2,
    startTime: '07:30',
    elapsed: '4h 20m',
    assignedUnit: null,
    bsoResponse: 'not-responded',
    volunteersEnRoute: 0,
    sensorData: { zones: 'Zones B, C, G — 3 of 14 offline' },
    escalationHistory: [
      { layer: 1, time: '07:30:00', action: { en: 'SBC 801 90-min emergency lighting test failed in Zones B, C, G. Sensor confirmed.', ar: 'فشل اختبار الإضاءة الطارئة 90 دقيقة في المناطق B وC وG. تأكيد المستشعر.' } },
      { layer: 2, time: '07:30:05', action: { en: 'BSO Hassan Al-Ghamdi notified. No response in 60s. Monitoring at watch status.', ar: 'تم إخطار BSO حسن الغامدي. لا استجابة خلال 60 ث. مراقبة في وضع الترقب.' } },
    ],
    cameraSnapshot: false,
  },
]

// ─── Volunteers (3 — visible in Ops Center) ───────────────────────────────────
export const volunteers = [
  { id: 'VOL-001', name: { en: 'Faisal Al-Ghamdi', ar: 'فيصل الغامدي' }, cert: { en: 'Fire Safety Certified', ar: 'معتمد سلامة حريق' }, distanceKm: 0.8, nearestIncident: 'INC-CD-003', status: 'en-route' },
  { id: 'VOL-002', name: { en: 'Hind Al-Otaibi', ar: 'هند العتيبي' }, cert: { en: 'First Aid + Fire', ar: 'إسعاف أولي + حريق' }, distanceKm: 1.2, nearestIncident: 'INC-CD-002', status: 'active' },
  { id: 'VOL-003', name: { en: 'Tariq Al-Shamrani', ar: 'طارق الشمراني' }, cert: { en: 'Fire Safety Certified', ar: 'معتمد سلامة حريق' }, distanceKm: 2.1, nearestIncident: 'INC-CD-001', status: 'en-route' },
]

// ─── Field Units (7) ──────────────────────────────────────────────────────────
export const cdFieldUnits = [
  { id: 'UNIT-01', name: { en: 'Unit 01 — Al Olaya Station', ar: 'وحدة 01 — محطة العليا' }, status: 'on-scene', cert: ['high-rise', 'hazmat'], crew: 8, incidentId: 'INC-CD-002', eta: null, base: { en: 'Al Olaya District', ar: 'حي العليا' } },
  { id: 'UNIT-02', name: { en: 'Unit 02 — King Fahd Station', ar: 'وحدة 02 — محطة الملك فهد' }, status: 'deployed', cert: ['standard'], crew: 6, incidentId: 'INC-CD-003', eta: '4 min', base: { en: 'King Fahd Road', ar: 'طريق الملك فهد' } },
  { id: 'UNIT-03', name: { en: 'Unit 03 — Nakheel Station', ar: 'وحدة 03 — محطة النخيل' }, status: 'returning', cert: ['standard'], crew: 5, incidentId: null, eta: '12 min to base', base: { en: 'Al Nakheel', ar: 'النخيل' } },
  { id: 'UNIT-04', name: { en: 'Unit 04 — Medical + Rescue', ar: 'وحدة 04 — طبية وإنقاذ' }, status: 'available', cert: ['medical', 'rescue'], crew: 7, incidentId: null, eta: null, base: { en: 'Base — Al Olaya', ar: 'قاعدة — العليا' } },
  { id: 'UNIT-05', name: { en: 'Unit 05 — HAZMAT Jubail', ar: 'وحدة 05 — المواد الخطرة الجبيل' }, status: 'on-scene', cert: ['hazmat', 'industrial'], crew: 10, incidentId: 'INC-CD-001', eta: null, base: { en: 'Al Jubail Industrial', ar: 'الجبيل الصناعية' } },
  { id: 'UNIT-06', name: { en: 'Unit 06 — Granada Station', ar: 'وحدة 06 — محطة غرناطة' }, status: 'available', cert: ['standard'], crew: 6, incidentId: null, eta: null, base: { en: 'Granada District', ar: 'حي غرناطة' } },
  { id: 'UNIT-07', name: { en: 'Unit 07 — North Riyadh Station', ar: 'وحدة 07 — محطة شمال الرياض' }, status: 'available', cert: ['high-rise'], crew: 7, incidentId: null, eta: null, base: { en: 'North Riyadh', ar: 'شمال الرياض' } },
]

// ─── Drones (5) ───────────────────────────────────────────────────────────────
export const cdDrones = [
  { id: 'UAV-01', name: 'Falcon UAV-01', status: 'airborne', altitude: 120, battery: 78, thermal: true, assignment: { en: 'Kingdom Centre — Active fire support', ar: 'برج المملكة — دعم الحريق النشط' } },
  { id: 'UAV-02', name: 'Falcon UAV-02', status: 'airborne', altitude: 85, battery: 61, thermal: true, assignment: { en: 'Al Jubail Industrial — Thermal patrol', ar: 'الجبيل الصناعية — دورية حرارية' } },
  { id: 'UAV-03', name: 'Falcon UAV-03', status: 'airborne', altitude: 95, battery: 54, thermal: true, assignment: { en: 'Burj Rafal — Smoke detection support', ar: 'برج رافال — دعم كشف الدخان' } },
  { id: 'UAV-04', name: 'Falcon UAV-04', status: 'charging', altitude: 0, battery: 23, thermal: true, assignment: { en: 'Base Station — Al Olaya district', ar: 'محطة القاعدة — حي العليا' } },
  { id: 'UAV-05', name: 'Falcon UAV-05', status: 'standby', altitude: 0, battery: 100, thermal: true, assignment: { en: 'Base Station — Ready for immediate launch', ar: 'محطة القاعدة — جاهز للإطلاق الفوري' } },
]

// ─── Thermal Alerts (6) ───────────────────────────────────────────────────────
export const thermalAlerts = [
  { id: 'TH-041', buildingId: 'bld-005', location: { en: 'Kingdom Centre — Roof Electrical Plant', ar: 'برج المملكة — محطة كهرباء السطح' }, reading: '78°C', normal: '35°C', type: { en: 'Electrical Overload', ar: 'حمل زائد كهربائي' }, severity: 'critical' },
  { id: 'TH-038', buildingId: 'bld-001', location: { en: 'Al Faisaliah — B2 Electrical Panel', ar: 'الفيصلية — لوحة كهرباء B2' }, reading: '62°C', normal: '28°C', type: { en: 'Panel Heat Anomaly', ar: 'شذوذ حرارة اللوحة' }, severity: 'high' },
  { id: 'TH-039', buildingId: 'bld-002', location: { en: 'Burj Rafal — Floor 15 HVAC Room', ar: 'برج رافال — غرفة مكيف الطابق 15' }, reading: '51°C', normal: '30°C', type: { en: 'HVAC Overheating', ar: 'ارتفاع حرارة نظام التكييف' }, severity: 'high' },
  { id: 'TH-040', buildingId: 'bld-009', location: { en: 'Al Jubail Industrial — Generator Bay', ar: 'الجبيل الصناعية — حظيرة المولّد' }, reading: '43°C', normal: '32°C', type: { en: 'Minor Elevation', ar: 'ارتفاع طفيف' }, severity: 'medium' },
  { id: 'TH-042', buildingId: 'bld-003', location: { en: 'Granada Mall — Kitchen Exhaust Zone', ar: 'غرناطة مول — منطقة عادم المطبخ' }, reading: '38°C', normal: '22°C', type: { en: 'Exhaust Thermal', ar: 'حرارة العادم' }, severity: 'low' },
  { id: 'TH-043', buildingId: 'bld-006', location: { en: 'Riyadh Park — Server Room Level 2', ar: 'الرياض بارك — غرفة الخوادم الطابق 2' }, reading: '45°C', normal: '25°C', type: { en: 'Server Thermal', ar: 'حرارة الخادم' }, severity: 'medium' },
]

// ─── AI Auto-Violations (6) ───────────────────────────────────────────────────
export const aiViolations = [
  { id: 'AV-001', camera: 'CAM-F-04', buildingId: 'bld-001', buildingName: { en: 'Al Faisaliah Complex', ar: 'مجمع الفيصلية' }, type: { en: 'Blocked Fire Exit', ar: 'مخرج طوارئ مسدود' }, confidence: 94, issuanceMethod: 'AUTO', status: 'issued', severity: 'critical', location: { en: 'Level 8 — East Exit', ar: 'الطابق 8 — المخرج الشرقي' } },
  { id: 'AV-002', camera: 'CAM-K-11', buildingId: 'bld-005', buildingName: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' }, type: { en: 'Missing Fire Extinguisher', ar: 'طفاية حريق مفقودة' }, confidence: 87, issuanceMethod: 'REVIEW', status: 'pending', severity: 'high', location: { en: 'Level 22 — Corridor B', ar: 'الطابق 22 — الممر B' } },
  { id: 'AV-003', camera: 'CAM-R-07', buildingId: 'bld-002', buildingName: { en: 'Burj Rafal Hotel Tower', ar: 'برج رافال للفنادق' }, type: { en: 'Unsafe Electrical Installation', ar: 'تركيب كهربائي غير آمن' }, confidence: 91, issuanceMethod: 'AUTO', status: 'issued', severity: 'high', location: { en: 'Level 34 — Maintenance Shaft', ar: 'الطابق 34 — فتحة الصيانة' } },
  { id: 'AV-004', camera: 'CAM-G-02', buildingId: 'bld-003', buildingName: { en: 'Granada Mall', ar: 'غرناطة مول' }, type: { en: 'Expired Safety Signage', ar: 'لافتات سلامة منتهية الصلاحية' }, confidence: 78, issuanceMethod: 'REVIEW', status: 'pending', severity: 'advisory', location: { en: 'Zone C — Emergency Stair', ar: 'المنطقة C — درج الطوارئ' } },
  { id: 'AV-005', camera: 'CAM-K-03', buildingId: 'bld-005', buildingName: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' }, type: { en: 'Obstructed Sprinkler Head', ar: 'رأس رشاش محجوب' }, confidence: 96, issuanceMethod: 'AUTO', status: 'issued', severity: 'high', location: { en: 'Level 55 — Storage Area', ar: 'الطابق 55 — منطقة التخزين' } },
  { id: 'AV-006', camera: 'CAM-J-01', buildingId: 'bld-009', buildingName: { en: 'Al Jubail Industrial', ar: 'الجبيل الصناعية' }, type: { en: 'Chemical Storage MAQ Breach', ar: 'خرق MAQ لتخزين المواد الكيميائية' }, confidence: 89, issuanceMethod: 'REVIEW', status: 'escalated', severity: 'life-safety', location: { en: 'Zone H-3 Chemical Storage', ar: 'مخزن المواد الكيميائية H-3' } },
]

// ─── Inspection Queue (10 items) ──────────────────────────────────────────────
export const inspectionQueue = [
  { id: 'INS-001', buildingId: 'bld-009', buildingName: { en: 'Al Jubail Industrial Facility', ar: 'منشأة الجبيل الصناعية' }, sbcType: 'F/H', riskScore: 88, daysSince: 84, inspector: 'Capt. Ahmad Al-Zahrani', scheduledDate: '2025-02-01', status: 'upcoming', priority: 1 },
  { id: 'INS-002', buildingId: 'bld-005', buildingName: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' }, sbcType: 'M/R/B', riskScore: 82, daysSince: 161, inspector: 'Lt. Khalid Al-Harbi', scheduledDate: '2025-02-02', status: 'overdue', priority: 2 },
  { id: 'INS-003', buildingId: 'bld-001', buildingName: { en: 'Al Faisaliah Complex', ar: 'مجمع الفيصلية' }, sbcType: 'M', riskScore: 74, daysSince: 72, inspector: 'Sgt. Nasser Al-Dosari', scheduledDate: '2025-02-03', status: 'upcoming', priority: 3 },
  { id: 'INS-004', buildingId: 'bld-002', buildingName: { en: 'Burj Rafal Hotel Tower', ar: 'برج رافال للفنادق' }, sbcType: 'R', riskScore: 68, daysSince: 118, inspector: 'Lt. Khalid Al-Harbi', scheduledDate: '2025-02-03', status: 'upcoming', priority: 4 },
  { id: 'INS-005', buildingId: 'bld-007', buildingName: { en: 'Al Nakheel Medical Center', ar: 'المركز الطبي النخيل' }, sbcType: 'I', riskScore: 61, daysSince: 60, inspector: 'Capt. Ahmad Al-Zahrani', scheduledDate: '2025-02-04', status: 'upcoming', priority: 5 },
  { id: 'INS-006', buildingId: 'bld-006', buildingName: { en: 'Riyadh Park Mall', ar: 'الرياض بارك مول' }, sbcType: 'M/A', riskScore: 58, daysSince: 135, inspector: 'Sgt. Nasser Al-Dosari', scheduledDate: '2025-02-05', status: 'upcoming', priority: 6 },
  { id: 'INS-007', buildingId: 'bld-003', buildingName: { en: 'Granada Mall', ar: 'غرناطة مول' }, sbcType: 'M/A', riskScore: 45, daysSince: 15, inspector: 'Sgt. Nasser Al-Dosari', scheduledDate: '2025-01-15', status: 'completed', priority: 7, outcome: { violations: 1, passed: true } },
  { id: 'INS-008', buildingId: 'bld-004', buildingName: { en: 'Al Olaya Business Park', ar: 'مجمع العليا التجاري' }, sbcType: 'B', riskScore: 42, daysSince: 22, inspector: 'Lt. Khalid Al-Harbi', scheduledDate: '2025-01-10', status: 'completed', priority: 8, outcome: { violations: 0, passed: true } },
  { id: 'INS-009', buildingId: 'bld-008', buildingName: { en: 'Riyadh International School', ar: 'مدرسة الرياض الدولية' }, sbcType: 'E', riskScore: 38, daysSince: 10, inspector: 'Capt. Ahmad Al-Zahrani', scheduledDate: '2025-01-22', status: 'completed', priority: 9, outcome: { violations: 0, passed: true } },
  { id: 'INS-010', buildingId: 'bld-004', buildingName: { en: 'Al Olaya Business Park (Follow-up)', ar: 'مجمع العليا التجاري (متابعة)' }, sbcType: 'B', riskScore: 42, daysSince: 35, inspector: 'Sgt. Nasser Al-Dosari', scheduledDate: '2025-01-05', status: 'completed', priority: 10, outcome: { violations: 0, passed: true } },
]

// ─── License Applications (2 pending) ────────────────────────────────────────
export const licenseApplications = [
  {
    id: 'APP-001', buildingName: { en: 'Riyadh International School (Expansion)', ar: 'مدرسة الرياض الدولية (توسعة)' }, sbcType: 'E',
    stage: 'site-inspection', submittedDate: '2025-01-10', officer: 'Lt. Khalid Al-Harbi',
    stages: [
      { id: 'doc-review',      label: { en: 'Document Review', ar: 'مراجعة المستندات' }, status: 'complete' },
      { id: 'site-inspection', label: { en: 'Site Inspection', ar: 'فحص الموقع' }, status: 'active' },
      { id: 'compliance',      label: { en: 'Compliance Check', ar: 'فحص الامتثال' }, status: 'pending' },
      { id: 'approval',        label: { en: 'Final Approval', ar: 'الموافقة النهائية' }, status: 'pending' },
      { id: 'issued',          label: { en: 'License Issued', ar: 'إصدار الترخيص' }, status: 'pending' },
    ],
  },
  {
    id: 'APP-002', buildingName: { en: 'NEOM Riyadh Logistics Hub', ar: 'مركز لوجستيات نيوم الرياض' }, sbcType: 'S',
    stage: 'doc-review', submittedDate: '2025-01-22', officer: 'Capt. Ahmad Al-Zahrani',
    stages: [
      { id: 'doc-review',      label: { en: 'Document Review', ar: 'مراجعة المستندات' }, status: 'active' },
      { id: 'site-inspection', label: { en: 'Site Inspection', ar: 'فحص الموقع' }, status: 'pending' },
      { id: 'compliance',      label: { en: 'Compliance Check', ar: 'فحص الامتثال' }, status: 'pending' },
      { id: 'approval',        label: { en: 'Final Approval', ar: 'الموافقة النهائية' }, status: 'pending' },
      { id: 'issued',          label: { en: 'License Issued', ar: 'إصدار الترخيص' }, status: 'pending' },
    ],
  },
]

// ─── CD License Registry (8) ──────────────────────────────────────────────────
export const cdLicenses = [
  { id: 'LIC-0021', buildingId: 'bld-004', buildingName: { en: 'Al Olaya Business Park', ar: 'مجمع العليا التجاري' }, type: { en: 'Commercial Safety', ar: 'سلامة تجارية' }, status: 'active', expiry: '2026-03-01', daysLeft: 382, officer: 'Maj. Faisal Al-Dossari', vendorOk: true },
  { id: 'LIC-0019', buildingId: 'bld-003', buildingName: { en: 'Granada Mall', ar: 'غرناطة مول' }, type: { en: 'Retail Safety', ar: 'سلامة التجزئة' }, status: 'active', expiry: '2026-01-15', daysLeft: 278, officer: 'Lt. Khalid Al-Harbi', vendorOk: true },
  { id: 'LIC-0022', buildingId: 'bld-002', buildingName: { en: 'Burj Rafal Hotel Tower', ar: 'برج رافال للفنادق' }, type: { en: 'Hotel Fire Safety', ar: 'سلامة حريق الفنادق' }, status: 'expiring', expiry: '2025-08-14', daysLeft: 198, officer: 'Capt. Saad Al-Mutairi', vendorOk: true },
  { id: 'LIC-0018', buildingId: 'bld-006', buildingName: { en: 'Riyadh Park Mall', ar: 'الرياض بارك مول' }, type: { en: 'Retail Safety', ar: 'سلامة التجزئة' }, status: 'expiring', expiry: '2025-05-20', daysLeft: 114, officer: 'Lt. Khalid Al-Harbi', vendorOk: false },
  { id: 'LIC-0017', buildingId: 'bld-001', buildingName: { en: 'Al Faisaliah Complex', ar: 'مجمع الفيصلية' }, type: { en: 'Commercial Safety', ar: 'سلامة تجارية' }, status: 'expiring', expiry: '2025-05-30', daysLeft: 124, officer: 'Maj. Faisal Al-Dossari', vendorOk: true },
  { id: 'LIC-0014', buildingId: 'bld-005', buildingName: { en: 'Kingdom Centre Tower', ar: 'برج المملكة' }, type: { en: 'Mixed-Use Safety', ar: 'سلامة متعدد الاستخدام' }, status: 'expired', expiry: '2024-01-01', daysLeft: -410, officer: 'Capt. Saad Al-Mutairi', vendorOk: false },
  { id: 'LIC-0025', buildingId: 'bld-007', buildingName: { en: 'Al Nakheel Medical Center', ar: 'المركز الطبي النخيل' }, type: { en: 'Healthcare Safety', ar: 'سلامة الرعاية الصحية' }, status: 'active', expiry: '2025-11-14', daysLeft: 290, officer: 'Maj. Faisal Al-Dossari', vendorOk: true },
  { id: 'LIC-0026', buildingId: 'bld-009', buildingName: { en: 'Al Jubail Industrial Facility', ar: 'منشأة الجبيل الصناعية' }, type: { en: 'Industrial HAZMAT Permit', ar: 'تصريح المواد الخطرة الصناعية' }, status: 'sla-breach', expiry: '2025-06-30', daysLeft: 150, officer: 'Capt. Saad Al-Mutairi', vendorOk: true },
]

// ─── Policy Rules (10) ────────────────────────────────────────────────────────
export const cdPolicyRules = [
  { id: 'RULE-001', name: { en: 'Fire Exit Clearance — 1.2m Minimum', ar: 'إخلاء مخرج الطوارئ — 1.2م حداً أدنى' }, domain: 'fire-safety', sbcRef: 'SBC 801 Ch.10', aiStatus: 'active', severity: 'critical', violations: 12, affectedBuildings: 4, approvalStage: 'published' },
  { id: 'RULE-002', name: { en: 'Smoke Detector Density per Zone', ar: 'كثافة كاشفات الدخان لكل منطقة' }, domain: 'detection', sbcRef: 'SBC 801 Ch.9', aiStatus: 'active', severity: 'high', violations: 7, affectedBuildings: 3, approvalStage: 'published' },
  { id: 'RULE-003', name: { en: 'Fire Extinguisher Placement & Tagging', ar: 'موضع وبطاقة طفاية الحريق' }, domain: 'equipment', sbcRef: 'SBC 801 Ch.9', aiStatus: 'active', severity: 'high', violations: 19, affectedBuildings: 6, approvalStage: 'published' },
  { id: 'RULE-004', name: { en: 'Electrical Panel Access Control', ar: 'التحكم في دخول لوحة الكهرباء' }, domain: 'electrical', sbcRef: 'SBC 801 Ch.6', aiStatus: 'in-development', severity: 'medium', violations: 0, affectedBuildings: 0, approvalStage: 'ai-encoding' },
  { id: 'RULE-005', name: { en: 'Emergency Lighting 90-Minute Test', ar: 'اختبار الإضاءة الطارئة 90 دقيقة' }, domain: 'evacuation', sbcRef: 'SBC 801 Ch.7', aiStatus: 'active', severity: 'medium', violations: 4, affectedBuildings: 2, approvalStage: 'published' },
  { id: 'RULE-006', name: { en: 'Sprinkler System Pressure Minimum', ar: 'الحد الأدنى لضغط نظام الرشاشات' }, domain: 'fire-safety', sbcRef: 'SBC 801 Ch.9', aiStatus: 'active', severity: 'critical', violations: 3, affectedBuildings: 2, approvalStage: 'published' },
  { id: 'RULE-007', name: { en: 'Evacuation Drill Frequency', ar: 'تكرار تدريبات الإخلاء' }, domain: 'evacuation', sbcRef: 'SBC 801 Ch.4', aiStatus: 'draft', severity: 'low', violations: 0, affectedBuildings: 0, approvalStage: 'draft' },
  { id: 'RULE-008', name: { en: 'Hazardous Material Storage Zones', ar: 'مناطق تخزين المواد الخطرة' }, domain: 'hazmat', sbcRef: 'SBC 201 Ch.H', aiStatus: 'active', severity: 'high', violations: 2, affectedBuildings: 1, approvalStage: 'published' },
  { id: 'RULE-009', name: { en: 'MAQ Threshold Monitoring — Group H', ar: 'مراقبة حد MAQ — المجموعة H' }, domain: 'hazmat', sbcRef: 'SBC 201 H-3', aiStatus: 'active', severity: 'life-safety', violations: 1, affectedBuildings: 1, approvalStage: 'published' },
  { id: 'RULE-010', name: { en: 'BSO Certification Currency', ar: 'حداثة اعتماد BSO' }, domain: 'compliance', sbcRef: 'CDA Reg. 2023', aiStatus: 'active', severity: 'minor', violations: 8, affectedBuildings: 5, approvalStage: 'published' },
]

// ─── Training Programs (5) ────────────────────────────────────────────────────
export const cdTrainingPrograms = [
  { id: 'TRN-001', name: { en: 'High-Rise Fire Response', ar: 'الاستجابة لحريق الأبراج' }, modality: 'VR', target: { en: 'CD Officers + High-Rise BSOs', ar: 'ضباط CD + BSOs الأبراج' }, enrolled: 48, completed: 41, certValidity: { en: '2 years — CD jointly issued', ar: 'سنتان — بالاشتراك مع CD' }, nextSession: '2025-02-15' },
  { id: 'TRN-002', name: { en: 'Chemical Hazard Management', ar: 'إدارة المخاطر الكيميائية' }, modality: 'AR', target: { en: 'CD HAZMAT + Group H BSOs', ar: 'فريق HAZMAT + BSOs المجموعة H' }, enrolled: 32, completed: 27, certValidity: { en: '1 year — mandatory for H-type BSOs', ar: 'سنة — إلزامي لـ BSOs نوع H' }, nextSession: '2025-02-22' },
  { id: 'TRN-003', name: { en: 'Mass Evacuation Command', ar: 'قيادة الإخلاء الجماعي' }, modality: 'SIM', target: { en: 'CD Commanders', ar: 'قادة الدفاع المدني' }, enrolled: 24, completed: 24, certValidity: { en: '3 years — national commander sign-off', ar: 'ثلاث سنوات — موافقة القائد الوطني' }, nextSession: '2025-03-10' },
  { id: 'TRN-004', name: { en: 'Building Safety Officer Foundation', ar: 'أساسيات ضابط سلامة المبنى' }, modality: 'AI', target: { en: 'All BSOs — mandatory onboarding', ar: 'جميع BSOs — تأهيل إلزامي' }, enrolled: 38, completed: 31, certValidity: { en: '1 year — required for registration', ar: 'سنة — مطلوب للتسجيل' }, nextSession: '2025-02-10' },
  { id: 'TRN-005', name: { en: 'AI Risk Assessment Reading', ar: 'قراءة تقييم المخاطر بالذكاء الاصطناعي' }, modality: 'AI', target: { en: 'BSOs + CD Inspectors', ar: 'BSOs + مفتشو CD' }, enrolled: 20, completed: 10, certValidity: { en: '2 years — joint certification', ar: 'سنتان — شهادة مشتركة' }, nextSession: '2025-03-01' },
]

// ─── Team Leaderboard (5) ────────────────────────────────────────────────────
export const leaderboard = [
  { rank: 1, team: { en: 'Station 7 — North Riyadh', ar: 'المحطة 7 — شمال الرياض' }, score: 94, drills: 18, improvement: 'up' },
  { rank: 2, team: { en: 'Station 2 — King Fahd Road', ar: 'المحطة 2 — طريق الملك فهد' }, score: 91, drills: 15, improvement: 'stable' },
  { rank: 3, team: { en: 'Station 4 — HAZMAT Unit', ar: 'المحطة 4 — وحدة المواد الخطرة' }, score: 88, drills: 22, improvement: 'up' },
  { rank: 4, team: { en: 'Station 1 — Al Olaya', ar: 'المحطة 1 — العليا' }, score: 82, drills: 12, improvement: 'stable' },
  { rank: 5, team: { en: 'Station 6 — Granada', ar: 'المحطة 6 — غرناطة' }, score: 79, drills: 10, improvement: 'up' },
]

// ─── Awareness Campaigns (5) ─────────────────────────────────────────────────
export const cdCampaigns = [
  { id: 'CAM-001', name: { en: 'Fire Safety Week 2025', ar: 'أسبوع السلامة من الحرائق 2025' }, status: 'active', target: { en: 'General public + businesses', ar: 'العامة والأعمال' }, reach: 840000, channels: ['Social Media', 'TV', 'In-Building Screens'] },
  { id: 'CAM-002', name: { en: 'School Safety Drive', ar: 'حملة سلامة المدارس' }, status: 'active', target: { en: 'Schools, parents, students', ar: 'المدارس وأولياء الأمور والطلاب' }, reach: 230000, channels: ['School Portals', 'Parent Apps', 'CD Visits'] },
  { id: 'CAM-003', name: { en: 'Emergency Evacuation Guides', ar: 'أدلة الإخلاء الطارئ' }, status: 'completed', target: { en: 'Building owners, BSOs, public', ar: 'أصحاب المباني وBSOs والعامة' }, reach: 520000, channels: ['Saqr Platform', 'Print Distribution'] },
  { id: 'CAM-004', name: { en: 'Ramadan Safety Campaign 2025', ar: 'حملة سلامة رمضان 2025' }, status: 'planned', target: { en: 'General public, restaurants, mosques', ar: 'العامة والمطاعم والمساجد' }, reach: 0, targetReach: 1200000, channels: ['Social Media', 'TV', 'Mosque Announcements'] },
  { id: 'CAM-005', name: { en: 'Group H Industry Safety Alert', ar: 'تنبيه سلامة الصناعات الخطرة' }, status: 'active', target: { en: 'Industrial facility owners + BSOs', ar: 'أصحاب المنشآت الصناعية + BSOs' }, reach: 12000, channels: ['Saqr Direct Notification'] },
]

// ─── Lessons Learned (4) ─────────────────────────────────────────────────────
export const lessonsLearned = [
  {
    id: 'LL-001', incidentRef: 'INC-2024-002', severity: 'critical', published: 'public',
    title: { en: 'Electrical Arc Flash Prevention — Group R High-Rise', ar: 'الوقاية من ومضة القوس الكهربائي — مجموعة R للأبراج' },
    whys: [
      { en: 'Why was there an arc flash? → Distribution panel MCCB was 22 years old with no thermal protection.', ar: 'لماذا حدثت الومضة؟ → قاطع MCCB في لوحة التوزيع عمره 22 عاماً بلا حماية حرارية.' },
      { en: 'Why was the panel not replaced? → No proactive replacement schedule existed.', ar: 'لماذا لم تُستبدل اللوحة؟ → لا توجد جدولة استباقية للاستبدال.' },
      { en: 'Why no schedule? → SBC 801 did not mandate age-based replacement cycles.', ar: 'لماذا لا جدولة؟ → SBC 801 لم يُلزم بدورات استبدال مبنية على العمر.' },
    ],
    riskFactorsBefore: { electrical: 88, fireSuppression: 72 },
    correctiveAction: { en: 'Mandatory AFCI upgrade for all Group R buildings above 30 floors. New policy rule RULE-011 drafted.', ar: 'ترقية AFCI إلزامية لجميع مباني المجموعة R فوق 30 طابقاً. تم صياغة قاعدة RULE-011.' },
    policyUpdateTriggered: true,
  },
  {
    id: 'LL-002', incidentRef: 'INC-2024-005', severity: 'critical', published: 'public',
    title: { en: 'After-Hours Vendor Contract Monitoring', ar: 'مراقبة عقود الموردين بعد أوقات العمل' },
    whys: [
      { en: 'Why did score spike to 96? → Vendor contract lapsed + simultaneous sprinkler pressure drop at 2AM Friday.', ar: 'لماذا ارتفع المؤشر إلى 96؟ → انتهاء عقد المورد + انخفاض ضغط الرشاشات في آنٍ واحد في الساعة 2 صباحاً يوم الجمعة.' },
      { en: 'Why no earlier alert on contract lapse? → Salamah API was not checked on weekends.', ar: 'لماذا لا إنذار مبكر عن انتهاء العقد؟ → لم تُفحص واجهة Salamah في عطل نهاية الأسبوع.' },
    ],
    riskFactorsBefore: { fireSuppression: 92, inspectionComp: 31 },
    correctiveAction: { en: 'MDRE now queries Salamah API every 15 minutes, 24/7. Vendor contract expiry triggers 72h warning.', ar: 'MDRE يستعلم واجهة Salamah كل 15 دقيقة، 24/7. انتهاء عقد المورد يُفعّل تحذير 72 ساعة.' },
    policyUpdateTriggered: false,
  },
  {
    id: 'LL-003', incidentRef: 'INC-CD-001', severity: 'critical', published: 'internal',
    title: { en: 'Group H MAQ Breach Response Protocol Gaps', ar: 'ثغرات بروتوكول الاستجابة لخرق MAQ المجموعة H' },
    whys: [
      { en: 'Why was MAQ exceeded? → Delivery of additional chemical stock without updating inventory log.', ar: 'لماذا تجاوز MAQ؟ → توصيل مخزون كيميائي إضافي دون تحديث سجل المخزون.' },
      { en: 'Why no inventory alert? → BMS not integrated with chemical inventory system.', ar: 'لماذا لا تنبيه للمخزون؟ → نظام إدارة المبنى غير مدمج مع نظام المخزون الكيميائي.' },
    ],
    riskFactorsBefore: { fireSuppression: 88, sensorCoverage: 92 },
    correctiveAction: { en: 'Group H facilities now require mandatory BMS-inventory integration. RULE-009 SLA compressed to 2 hours.', ar: 'منشآت المجموعة H الآن تتطلب تكامل إلزامي بين BMS والمخزون. SLA للقاعدة RULE-009 خُفّض إلى ساعتين.' },
    policyUpdateTriggered: true,
  },
  {
    id: 'LL-004', incidentRef: 'INC-CD-002', severity: 'high', published: 'public',
    title: { en: 'License Expiry Enforcement Gap — Mixed-Use Tower', ar: 'ثغرة تطبيق انتهاء الترخيص — برج متعدد الاستخدام' },
    whys: [
      { en: 'Why did license expire without renewal? → No automated escalation after 30-day final warning.', ar: 'لماذا انتهى الترخيص دون تجديد؟ → لا تصعيد آلي بعد التحذير النهائي لمدة 30 يوماً.' },
      { en: 'Why no closure order at 90 days post-expiry? → Manual enforcement workflow dependent on inspector availability.', ar: 'لماذا لا أمر إغلاق بعد 90 يوماً من الانتهاء؟ → سير العمل اليدوي يعتمد على توافر المفتش.' },
    ],
    riskFactorsBefore: { inspectionComp: 30, fireSuppression: 80 },
    correctiveAction: { en: 'MDRE now auto-generates closure order after 45 days post-expiry with no renewal. No manual step required.', ar: 'MDRE يُنشئ أمر إغلاق تلقائياً بعد 45 يوماً من الانتهاء دون تجديد. لا خطوة يدوية مطلوبة.' },
    policyUpdateTriggered: true,
  },
]

// ─── Content Library Summary (103 items) ─────────────────────────────────────
export const contentLibrary = [
  { type: 'safety-guide', label: { en: 'Safety Guides (PDF)', ar: 'أدلة السلامة (PDF)' }, count: 24, access: 'public', icon: 'FileText' },
  { type: 'video', label: { en: 'Training Videos', ar: 'مقاطع التدريب' }, count: 18, access: 'mixed', icon: 'Video' },
  { type: 'infographic', label: { en: 'Infographics', ar: 'إنفوغرافيك' }, count: 31, access: 'public', icon: 'Image' },
  { type: 'course', label: { en: 'Training Courses (SCORM)', ar: 'دورات التدريب (SCORM)' }, count: 9, access: 'restricted', icon: 'BookOpen' },
  { type: 'newsletter', label: { en: 'Newsletters', ar: 'النشرات الإخبارية' }, count: 14, access: 'subscribers', icon: 'Mail' },
  { type: 'emergency-plan', label: { en: 'Emergency Plan Templates', ar: 'قوالب خطط الطوارئ' }, count: 7, access: 'public', icon: 'FileCheck' },
]
