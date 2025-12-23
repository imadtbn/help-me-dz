// ملف إعدادات التطبيق
const CONFIG = {
    // إعدادات API - استبدل بمفتاحك الفعلي
    GOOGLE_API_KEY: 'AIzaSyDfJHn5jLQmH0ZkXyV6b8nT7cR9pA2wB3C',
    
    // إعدادات البحث
    DEFAULT_LOCATION: {
        lat: 36.7538,
        lng: 3.0588,
        name: 'الجزائر العاصمة, الجزائر'
    },
    
    // المدن الجزائرية الرئيسية للإكمال التلقائي
    ALGERIAN_CITIES: [
        'الجزائر العاصمة',
        'وهران',
        'قسنطينة',
        'عنابة',
        'باتنة',
        'بليدة',
        'سطيف',
        'تيارت',
        'البويرة',
        'بجاية',
        'سيدي بلعباس',
        'البيض',
        'تيزي وزو',
        'غرداية',
        'ورقلة',
        'تمنراست'
    ],
    
    // إعدادات الخريطة
    MAP: {
        defaultZoom: 12,
        maxZoom: 18,
        minZoom: 8,
        defaultCenter: [36.7538, 3.0588]
    },
    
    // إعدادات التطبيق
    APP: {
        name: 'ساعدني',
        version: '1.2.0',
        language: 'ar',
        country: 'الجزائر'
    },
    
    // APIs المجانية
    APIS: {
        NOMINATIM: 'https://nominatim.openstreetmap.org/search',
        OVERPASS: 'https://overpass-api.de/api/interpreter',
        LEAFLET_TILES: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
};

// تصدير الإعدادات
window.CONFIG = CONFIG;