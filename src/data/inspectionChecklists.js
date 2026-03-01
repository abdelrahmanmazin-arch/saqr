/**
 * SBC 201 Occupancy-Specific Inspection Checklists
 * Each building type gets a tailored set of checkpoints per the business spec.
 */

export const inspectionChecklists = {
  A: {
    label: { en: 'Assembly', ar: 'تجمعات' },
    checkpoints: [
      { id: 'A1', text: { en: 'All fire exits clear and signposted', ar: 'جميع مخارج الحريق واضحة ومُعلَّمة' }, severity: 'critical' },
      { id: 'A2', text: { en: 'Occupancy load within permitted limit', ar: 'حمل الإشغال ضمن الحد المسموح' }, severity: 'high' },
      { id: 'A3', text: { en: 'Smoke detectors functional across all zones', ar: 'كاشفات الدخان تعمل في جميع المناطق' }, severity: 'high' },
      { id: 'A4', text: { en: 'Suppression system pressure within spec', ar: 'ضغط نظام الإطفاء ضمن المعايير' }, severity: 'critical' },
      { id: 'A5', text: { en: 'Emergency evacuation plan posted and current', ar: 'خطة الإخلاء الطارئ منشورة ومحدّثة' }, severity: 'high' },
      { id: 'A6', text: { en: 'Crowd management equipment present (barriers, PA system)', ar: 'معدات إدارة الحشود موجودة (حواجز، نظام مكبرات الصوت)' }, severity: 'medium' },
      { id: 'A7', text: { en: 'All aisle paths unobstructed', ar: 'جميع ممرات الممشى غير مسدودة' }, severity: 'critical' },
    ],
  },
  B: {
    label: { en: 'Business / Office', ar: 'أعمال / مكاتب' },
    checkpoints: [
      { id: 'B1', text: { en: 'Fire extinguishers present and tagged (within service date)', ar: 'طفايات الحريق موجودة ومُعلَّمة (ضمن تاريخ الخدمة)' }, severity: 'high' },
      { id: 'B2', text: { en: 'Emergency lighting functional', ar: 'الإضاءة الطارئة تعمل' }, severity: 'medium' },
      { id: 'B3', text: { en: 'Server/electrical rooms have appropriate suppression', ar: 'غرف الخوادم/الكهرباء لديها إطفاء مناسب' }, severity: 'high' },
      { id: 'B4', text: { en: 'All stairwell fire doors self-closing', ar: 'جميع أبواب الحريق في السلالم تُغلَق ذاتياً' }, severity: 'high' },
      { id: 'B5', text: { en: 'Smoke detectors in all offices and common areas', ar: 'كاشفات دخان في جميع المكاتب والمناطق المشتركة' }, severity: 'high' },
    ],
  },
  E: {
    label: { en: 'Educational', ar: 'تعليمي' },
    checkpoints: [
      { id: 'E1', text: { en: 'All classroom exits clear and unlocked during occupied hours', ar: 'جميع مخارج الفصول واضحة وغير مقفلة خلال ساعات الإشغال' }, severity: 'critical' },
      { id: 'E2', text: { en: 'Evacuation drill record current (within 6 months)', ar: 'سجل تدريب الإخلاء حديث (خلال 6 أشهر)' }, severity: 'high' },
      { id: 'E3', text: { en: 'Fire alarm audible in all zones including outdoor play areas', ar: 'إنذار الحريق مسموع في جميع المناطق بما فيها الملاعب الخارجية' }, severity: 'critical' },
      { id: 'E4', text: { en: 'Hazardous materials (lab chemicals) stored per SBC 801', ar: 'المواد الخطرة (كيماويات المختبر) مخزّنة وفق SBC 801' }, severity: 'high' },
      { id: 'E5', text: { en: 'Adequate supervision ratio confirmed for evacuation', ar: 'تم تأكيد نسبة الإشراف الكافية للإخلاء' }, severity: 'high' },
      { id: 'E6', text: { en: 'Emergency contact list posted and current', ar: 'قائمة جهات الاتصال الطارئة منشورة ومحدّثة' }, severity: 'medium' },
    ],
  },
  F: {
    label: { en: 'Industrial', ar: 'صناعي' },
    checkpoints: [
      { id: 'F1', text: { en: 'Combustible material storage within permitted zones', ar: 'تخزين المواد القابلة للاشتعال ضمن المناطق المسموحة' }, severity: 'critical' },
      { id: 'F2', text: { en: 'Heat-generating equipment has required separation clearance', ar: 'المعدات المولّدة للحرارة لديها فجوة فصل مطلوبة' }, severity: 'high' },
      { id: 'F3', text: { en: 'Sprinkler heads unobstructed', ar: 'رؤوس الرشاشات غير محجوبة' }, severity: 'high' },
      { id: 'F4', text: { en: 'All emergency shutoffs labeled and accessible', ar: 'جميع مفاتيح الطوارئ مُعلَّمة وميسّرة' }, severity: 'critical' },
      { id: 'F5', text: { en: 'Electrical panels accessible only to authorized personnel', ar: 'لوحات الكهرباء متاحة للأفراد المخوّلين فقط' }, severity: 'high' },
      { id: 'F6', text: { en: 'Safety data sheets present for all process chemicals', ar: 'صحائف بيانات السلامة موجودة لجميع مواد العمليات الكيميائية' }, severity: 'medium' },
    ],
  },
  H: {
    label: { en: 'High Hazard', ar: 'خطر مرتفع' },
    checkpoints: [
      { id: 'H1', text: { en: 'Maximum Allowable Quantities (MAQ) per control area within limits', ar: 'الكميات المسموحة القصوى (MAQ) لكل منطقة تحكم ضمن الحدود' }, severity: 'life-safety' },
      { id: 'H2', text: { en: 'HAZMAT storage zones have appropriate suppression type (foam/dry chemical)', ar: 'مناطق تخزين HAZMAT لديها نوع إطفاء مناسب (رغوة/مادة جافة)' }, severity: 'critical' },
      { id: 'H3', text: { en: 'All chemical containers labeled and sealed', ar: 'جميع حاويات المواد الكيميائية مُعلَّمة ومختومة' }, severity: 'critical' },
      { id: 'H4', text: { en: 'Ventilation system functional in all chemical storage areas', ar: 'نظام التهوية يعمل في جميع مناطق تخزين المواد الكيميائية' }, severity: 'critical' },
      { id: 'H5', text: { en: 'Emergency HAZMAT response plan posted and current', ar: 'خطة الاستجابة لطوارئ HAZMAT منشورة ومحدّثة' }, severity: 'high' },
      { id: 'H6', text: { en: 'Personnel protective equipment (PPE) available and inspected', ar: 'معدات الحماية الشخصية (PPE) متوفرة وتم فحصها' }, severity: 'high' },
      { id: 'H7', text: { en: 'Spill containment systems intact', ar: 'أنظمة احتواء الانسكاب سليمة' }, severity: 'critical' },
      { id: 'H8', text: { en: 'Secondary containment barriers in place', ar: 'حواجز الاحتواء الثانوية في مكانها' }, severity: 'critical' },
    ],
  },
  I: {
    label: { en: 'Healthcare', ar: 'رعاية صحية' },
    checkpoints: [
      { id: 'I1', text: { en: 'All exits accessible for non-ambulatory patients (wheelchair clearance)', ar: 'جميع المخارج متاحة لغير القادرين على المشي (إخلاء الكراسي المتحركة)' }, severity: 'critical' },
      { id: 'I2', text: { en: 'Medical gas systems inspected and within pressure spec', ar: 'أنظمة الغاز الطبي مفحوصة وضمن مواصفات الضغط' }, severity: 'critical' },
      { id: 'I3', text: { en: 'Backup power (generator) tested within 30 days', ar: 'الطاقة الاحتياطية (مولّد) اختُبرت خلال 30 يوماً' }, severity: 'high' },
      { id: 'I4', text: { en: 'Fire compartmentation doors functional (corridor fire doors)', ar: 'أبواب التقسيم من الحريق تعمل (أبواب الحريق في الممرات)' }, severity: 'high' },
      { id: 'I5', text: { en: 'Staff fire response training current (within 12 months)', ar: 'تدريب الكادر على الاستجابة للحريق حديث (خلال 12 شهراً)' }, severity: 'high' },
      { id: 'I6', text: { en: 'Evacuation plan accounts for ICU and bed-bound patients', ar: 'خطة الإخلاء تراعي مرضى العناية المركزة والمقيّدين بالسرير' }, severity: 'critical' },
    ],
  },
  M: {
    label: { en: 'Mercantile / Retail', ar: 'تجاري / تجزئة' },
    checkpoints: [
      { id: 'M1', text: { en: 'Display merchandise not blocking fire exits or suppression heads', ar: 'البضائع المعروضة لا تسد مخارج الحريق أو رؤوس الإطفاء' }, severity: 'critical' },
      { id: 'M2', text: { en: 'Storage areas within combustible load limits', ar: 'مناطق التخزين ضمن حدود الحمل القابل للاشتعال' }, severity: 'high' },
      { id: 'M3', text: { en: 'All checkout lanes have clear egress path', ar: 'جميع ممرات الدفع لديها مسار خروج واضح' }, severity: 'high' },
      { id: 'M4', text: { en: 'Cold storage: refrigerant type compliant with current code', ar: 'التبريد: نوع المبرّد متوافق مع الكود الحالي' }, severity: 'medium' },
      { id: 'M5', text: { en: 'Fire suppression system tested per SBC 801 schedule', ar: 'نظام الإطفاء اختُبر وفق جدول SBC 801' }, severity: 'high' },
    ],
  },
  R: {
    label: { en: 'Residential / Hospitality', ar: 'سكني / ضيافة' },
    checkpoints: [
      { id: 'R1', text: { en: 'Smoke detectors present and functional in all units and corridors', ar: 'كاشفات الدخان موجودة وتعمل في جميع الوحدات والممرات' }, severity: 'high' },
      { id: 'R2', text: { en: 'Fire doors on all stairwells (self-closing, rated)', ar: 'أبواب الحريق في جميع السلالم (تُغلَق ذاتياً، مُصنَّفة)' }, severity: 'high' },
      { id: 'R3', text: { en: 'Building-wide fire alarm tested within 12 months', ar: 'إنذار الحريق للمبنى بالكامل اختُبر خلال 12 شهراً' }, severity: 'high' },
      { id: 'R4', text: { en: 'Cooking suppression in commercial kitchen areas', ar: 'إطفاء الطبخ في مناطق المطابخ التجارية' }, severity: 'high' },
      { id: 'R5', text: { en: 'Guest/resident evacuation instructions posted in each unit', ar: 'تعليمات إخلاء النزلاء/السكان منشورة في كل وحدة' }, severity: 'medium' },
      { id: 'R6', text: { en: 'All floors accessible by fire hose connection', ar: 'جميع الطوابق ميسّرة بواسطة توصيل خرطوم الحريق' }, severity: 'high' },
    ],
  },
  S: {
    label: { en: 'Storage / Warehouse', ar: 'مخازن / مستودعات' },
    checkpoints: [
      { id: 'S1', text: { en: 'Racking height within permitted limit for sprinkler design', ar: 'ارتفاع الرفوف ضمن الحد المسموح لتصميم الرشاشات' }, severity: 'high' },
      { id: 'S2', text: { en: 'Flammable materials separated from ignition sources per SBC 801', ar: 'المواد القابلة للاشتعال مفصولة عن مصادر الإشعال وفق SBC 801' }, severity: 'critical' },
      { id: 'S3', text: { en: 'All fire doors to loading areas self-closing', ar: 'جميع أبواب الحريق لمناطق التحميل تُغلَق ذاتياً' }, severity: 'high' },
      { id: 'S4', text: { en: 'Forklift charging areas have appropriate ventilation', ar: 'مناطق شحن الرافعات الشوكية لديها تهوية مناسبة' }, severity: 'medium' },
      { id: 'S5', text: { en: 'Commodity class consistent with license (S-1 vs S-2 materials)', ar: 'فئة البضائع متوافقة مع الترخيص (مواد S-1 مقابل S-2)' }, severity: 'high' },
    ],
  },
}

// Helper: get checklist by SBC type string (handles combined types like "M/A", "F/H")
export const getChecklistForSBC = (sbcType) => {
  const primary = sbcType.split('/')[0].trim()
  return inspectionChecklists[primary] ?? inspectionChecklists.B
}
