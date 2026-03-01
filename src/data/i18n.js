/**
 * Bilingual string helper.
 * All UI strings live here with { en, ar } shape.
 */
export const t = (strings, lang = 'ar') => {
  if (typeof strings === 'string') return strings
  return strings?.[lang] ?? strings?.en ?? ''
}

export const ui = {
  // Platform
  platformName:     { en: 'Saqr Platform', ar: 'منظومة صقر' },
  madaniTech:       { en: 'Madani Tech', ar: 'مدني تك' },
  tagline:          { en: 'Transforming Saudi Arabia\'s Building Safety', ar: 'تحويل منظومة السلامة في المملكة العربية السعودية' },
  subTagline:       { en: 'AI-powered fire & life safety intelligence connecting building owners, Civil Defense, and insurance companies.', ar: 'منظومة استخباراتية للسلامة الحياتية مدعومة بالذكاء الاصطناعي تربط أصحاب المباني والدفاع المدني وشركات التأمين.' },
  enterPortal:      { en: 'Enter Portal', ar: 'الدخول إلى البوابة' },
  learnMore:        { en: 'Learn More', ar: 'اعرف أكثر' },
  backToHome:       { en: 'Back to Home', ar: 'العودة للرئيسية' },
  language:         { en: 'English', ar: 'عربي' },

  // Portals
  commercialPortal:    { en: 'Commercial Portal', ar: 'البوابة التجارية' },
  cdPortal:            { en: 'Civil Defense Portal', ar: 'بوابة الدفاع المدني' },
  insurancePortal:     { en: 'Insurance Intelligence Portal', ar: 'بوابة استخبارات التأمين' },
  commercialDesc:      { en: 'For building owners & property managers', ar: 'لأصحاب المباني ومديري العقارات' },
  cdDesc:              { en: 'For Civil Defense officers & commanders', ar: 'لضباط وقادة الدفاع المدني' },
  insuranceDesc:       { en: 'For insurance underwriters & actuaries', ar: 'للمكتتبين والاكتواريين' },

  // Nav
  dashboard:     { en: 'Dashboard', ar: 'لوحة التحكم' },
  buildings:     { en: 'Buildings', ar: 'المباني' },
  alerts:        { en: 'Alerts', ar: 'التنبيهات' },
  marketplace:   { en: 'Marketplace', ar: 'السوق' },
  reports:       { en: 'Reports', ar: 'التقارير' },
  operations:    { en: 'Operations Center', ar: 'مركز العمليات' },
  inspection:    { en: 'Digital Inspection', ar: 'الفحص الرقمي' },
  surveillance:  { en: 'Surveillance', ar: 'المراقبة' },
  licensing:     { en: 'Digital Licensing', ar: 'الترخيص الرقمي' },
  policyEngine:  { en: 'Policy Engine', ar: 'محرك السياسات' },
  training:      { en: 'Training & Simulation', ar: 'التدريب والمحاكاة' },
  awareness:     { en: 'Awareness Platform', ar: 'منصة التوعية' },
  portfolio:     { en: 'Portfolio Overview', ar: 'نظرة عامة على المحفظة' },
  pricing:       { en: 'Risk-Based Pricing', ar: 'التسعير المبني على المخاطر' },
  lossData:      { en: 'Loss Data', ar: 'بيانات الخسائر' },

  // Risk labels
  riskScore:    { en: 'Risk Score', ar: 'درجة المخاطر' },
  low:          { en: 'LOW', ar: 'منخفض' },
  medium:       { en: 'MEDIUM', ar: 'متوسط' },
  high:         { en: 'HIGH', ar: 'مرتفع' },
  critical:     { en: 'CRITICAL', ar: 'حرج' },

  // Status
  active:       { en: 'Active', ar: 'نشط' },
  expiring:     { en: 'Expiring', ar: 'ينتهي قريباً' },
  expired:      { en: 'Expired', ar: 'منتهي' },
  pending:      { en: 'Pending', ar: 'قيد الانتظار' },
  slaActive:    { en: 'SLA Active', ar: 'SLA نشط' },
  resolved:     { en: 'Resolved', ar: 'تم الحل' },
  underReview:  { en: 'Under Review', ar: 'قيد المراجعة' },
  assessing:    { en: 'Assessing', ar: 'قيد التقييم' },
  settled:      { en: 'Settled', ar: 'تم التسوية' },

  // KPIs Landing
  buildingsMonitored: { en: 'Buildings Monitored', ar: 'مبنى تحت المراقبة' },
  insuredValue:       { en: 'Total Insured Value', ar: 'إجمالي القيمة المؤمنة' },
  activeCDUnits:      { en: 'Active CD Units', ar: 'وحدة دفاع مدني نشطة' },
  citiesCovered:      { en: 'Cities Covered', ar: 'مدن مشمولة' },

  // Actions
  requestInspection:    { en: 'Request Inspection', ar: 'طلب فحص' },
  submitMaintenance:    { en: 'Submit Maintenance Report', ar: 'تقديم تقرير صيانة' },
  viewMarketplace:      { en: 'View Marketplace', ar: 'عرض السوق' },
  contactSupport:       { en: 'Contact Support', ar: 'تواصل مع الدعم' },
  dispatch:             { en: 'Dispatch', ar: 'إرسال' },
  viewDetails:          { en: 'View Details', ar: 'عرض التفاصيل' },
  manage:               { en: 'Manage', ar: 'إدارة' },
  approve:              { en: 'Approve', ar: 'موافقة' },
  reject:               { en: 'Reject', ar: 'رفض' },
  issueViolation:       { en: 'Issue Violation', ar: 'إصدار مخالفة' },
  launchDrone:          { en: 'Launch Drone', ar: 'إطلاق الطائرة' },
  simulateEvent:        { en: 'Simulate Risk Event', ar: 'محاكاة حدث مخاطر' },
  subscribe:            { en: 'Subscribe', ar: 'اشتراك' },
  requestQuote:         { en: 'Request Quote', ar: 'طلب عرض سعر' },
  downloadReport:       { en: 'Download Report', ar: 'تحميل التقرير' },

  // Misc
  search:    { en: 'Search...', ar: 'بحث...' },
  filter:    { en: 'Filter', ar: 'تصفية' },
  all:       { en: 'All', ar: 'الكل' },
  loading:   { en: 'Loading...', ar: 'جاري التحميل...' },
  noData:    { en: 'No data available', ar: 'لا توجد بيانات' },
  floors:    { en: 'Floors', ar: 'طوابق' },
  area:      { en: 'Area', ar: 'المساحة' },
  lastUpdated: { en: 'Last Updated', ar: 'آخر تحديث' },
  sensors:   { en: 'Sensors', ar: 'المستشعرات' },
  alerts2:   { en: 'Active Alerts', ar: 'التنبيهات النشطة' },
  license:   { en: 'License', ar: 'الترخيص' },
  vendor:    { en: 'Vendor', ar: 'المورد' },
  inspectionHistory: { en: 'Inspection History', ar: 'سجل الفحوصات' },
  annualPremium: { en: 'Annual Premium', ar: 'القسط السنوي' },
  recommendedPremium: { en: 'Recommended Premium', ar: 'القسط الموصى به' },
  lossRatio:  { en: 'Loss Ratio', ar: 'نسبة الخسارة' },
  pricingGap: { en: 'Pricing Gap', ar: 'فجوة التسعير' },
  insuredValueLabel: { en: 'Insured Value', ar: 'القيمة المؤمنة' },
  portfolioRisk: { en: 'Avg. Portfolio Risk', ar: 'متوسط مخاطر المحفظة' },
  highRiskPolicies: { en: 'High-Risk Policies', ar: 'بوالص عالية المخاطر' },
  totalPolicies: { en: 'Total Policies', ar: 'إجمالي البوالص' },
  vision2030: { en: 'Vision 2030', ar: 'رؤية 2030' },
  sbc201:     { en: 'SBC 201', ar: 'كود البناء السعودي 201' },
  sbc801:     { en: 'SBC 801', ar: 'كود البناء السعودي 801' },
  sdaia:      { en: 'SDAIA', ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي' },
}
