window.CONFIG = {
    APP: {
        name: 'ساعدني',
        version: '3.0.0'
    },
    
    // مصادر البيانات المجانية
    DATA_SOURCES: {
        // 1. OpenStreetMap (مجاني ومفتوح)
        OSM: {
            endpoint: 'https://overpass-api.de/api/interpreter',
            queryTemplate: `
                [out:json][timeout:25];
                area["ISO3166-1"="DZ"]["admin_level"=2]->.algeria;
                (
                    node["amenity"~"hospital|clinic|doctors|pharmacy|dentist|laboratory"](area.algeria);
                    way["amenity"~"hospital|clinic|doctors|pharmacy|dentist|laboratory"](area.algeria);
                    relation["amenity"~"hospital|clinic|doctors|pharmacy|dentist|laboratory"](area.algeria);
                );
                out center;
            `
        },
        
        // 2. Nominatim للجيو-كودينج العكسي
        NOMINATIM: 'https://nominatim.openstreetmap.org/search',
        
        // 3. قاعدة بيانات محلية من المجتمع
        COMMUNITY: 'data/community-data.json',
        
        // 4. بيانات من الحكومة الجزائرية (إن وجدت)
        GOVERNMENT: [
            'https://data.gov.dz/api/records/1.0/search/',
            'https://sanad.dz/api/health-facilities'
        ]
    },
    
    // المدن الجزائرية مع إحداثياتها
    ALGERIAN_CITIES: [
        {name: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588},
        {name: 'وهران', lat: 35.6971, lng: -0.6359},
        {name: 'قسنطينة', lat: 36.3650, lng: 6.6147},
        // ... إضافة جميع المدن
    ],
    
    MAP: {
        defaultCenter: [36.7538, 3.0588],
        defaultZoom: 12,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
};


/**
 * إعدادات التطبيق - ملف منفصل
 */
const CONFIG = {
    ALGERIAN_CITIES: [
        { name: "الجزائر العاصمة" },
        { name: "وهران" },
        { name: "قسنطينة" },
        { name: "عنابة" },
        { name: "باتنة" },
        { name: "بليدة" },
        { name: "سطيف" },
        { name: "تيارت" },
        { name: "البويرة" },
        { name: "بجاية" },
        { name: "سيدي بلعباس" },
        { name: "البيض" },
        { name: "تيزي وزو" },
        { name: "غرداية" },
        { name: "ورقلة" },
        { name: "تمنراست" }
    ],
    
    SEARCH: {
        DEFAULT_RADIUS: 5, // كيلومترات
        MAX_RESULTS: 100,
        AUTOCOMPLETE_MIN_CHARS: 2,
        DEBOUNCE_DELAY: 300 // مللي ثانية
    },
    
    MAP: {
        DEFAULT_ZOOM: 12,
        MAX_ZOOM: 18,
        MIN_ZOOM: 6
    },
    
    STORAGE: {
        BUSINESSES_KEY: 'businesses_database',
        SEARCH_HISTORY_KEY: 'search_history',
        MAX_HISTORY_ITEMS: 10
    }
};

// تصدير للاستخدام العالمي
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}