// ===========================================
// ملف إعدادات التطبيق (مُحسّن ومُصحّح)
// ===========================================
const CONFIG = {
    // =======================================
    // إعدادات التطبيق
    // =======================================
    APP: {
        name: 'ساعدني',
        version: '2.0.0',
        language: 'ar',
        country: 'الجزائر',
        direction: 'rtl',
        theme: 'light', // light | dark | auto
        enableNotifications: true,
        enableAnalytics: false,
        debugMode: false
    },
    
    // =======================================
    // إعدادات API (استبدل بمفاتيحك الفعلية)
    // =======================================
    APIS: {
        GOOGLE: {
            key: 'AIzaSyDfJHn5jLQmH0ZkXyV6b8nT7cR9pA2wB3C', // استبدل بمفتاحك الفعلي
            places: 'https://maps.googleapis.com/maps/api/place',
            geocode: 'https://maps.googleapis.com/maps/api/geocode',
            timeout: 10000,
            retryAttempts: 3
        },
        
        OPENSTREETMAP: {
            nominatim: 'https://nominatim.openstreetmap.org/search',
            overpass: 'https://overpass-api.de/api/interpreter',
            timeout: 15000,
            rateLimit: 1000 // مللي ثانية بين الطلبات
        },
        
        GEOAPIFY: {
            key: '', // احصل على مفتاح مجاني من geoapify.com
            reverseGeocode: 'https://api.geoapify.com/v1/geocode/reverse'
        }
    },
    
    // =======================================
    // إعدادات الموقع الجغرافي
    // =======================================
    LOCATION: {
        // الموقع الافتراضي (الجزائر العاصمة)
        DEFAULT: {
            lat: 36.7538,
            lng: 3.0588,
            name: 'الجزائر العاصمة, الجزائر',
            zoom: 12
        },
        
        // حدود الجزائر للتحقق
        ALGERIA_BOUNDS: {
            north: 37.0939,
            south: 18.9600,
            west: -8.6739,
            east: 11.9798
        },
        
        // إعدادات تحديد الموقع
        GEOLOCATION: {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000, // استخدام موقع مخزن لأقل من دقيقة
            watch: false, // تتبع الموقع المستمر
            minimumDistance: 10, // الحد الأدنى للمسافة بالمتر للتحديث
            circleRadius: 50, // نصف قطر دائرة الدقة بالمتر
            circleOpacity: 0.2
        }
    },
    
    // =======================================
    // المدن الجزائرية الرئيسية مع إحداثياتها
    // =======================================
    CITIES: [
        {
            name: 'الجزائر العاصمة',
            lat: 36.7538,
            lng: 3.0588,
            population: 3415811,
            wilaya: 'الجزائر'
        },
        {
            name: 'وهران',
            lat: 35.6971,
            lng: -0.6359,
            population: 803329,
            wilaya: 'وهران'
        },
        {
            name: 'قسنطينة',
            lat: 36.3650,
            lng: 6.6147,
            population: 448374,
            wilaya: 'قسنطينة'
        },
        {
            name: 'عنابة',
            lat: 36.9000,
            lng: 7.7667,
            population: 257359,
            wilaya: 'عنابة'
        },
        {
            name: 'باتنة',
            lat: 35.5560,
            lng: 6.1746,
            population: 290645,
            wilaya: 'باتنة'
        },
        {
            name: 'بليدة',
            lat: 36.4700,
            lng: 2.8300,
            population: 163586,
            wilaya: 'بليدة'
        },
        {
            name: 'سطيف',
            lat: 36.1914,
            lng: 5.4136,
            population: 288461,
            wilaya: 'سطيف'
        },
        {
            name: 'تيارت',
            lat: 35.3789,
            lng: 1.3175,
            population: 201263,
            wilaya: 'تيارت'
        },
        {
            name: 'البويرة',
            lat: 36.3763,
            lng: 3.9000,
            population: 68545,
            wilaya: 'البويرة'
        },
        {
            name: 'بجاية',
            lat: 36.7500,
            lng: 5.0667,
            population: 176139,
            wilaya: 'بجاية'
        },
        {
            name: 'سيدي بلعباس',
            lat: 35.2000,
            lng: -0.6333,
            population: 212935,
            wilaya: 'سيدي بلعباس'
        },
        {
            name: 'البيض',
            lat: 33.6833,
            lng: 1.0192,
            population: 134000,
            wilaya: 'البيض'
        },
        {
            name: 'تيزي وزو',
            lat: 36.7167,
            lng: 4.0500,
            population: 135088,
            wilaya: 'تيزي وزو'
        },
        {
            name: 'غرداية',
            lat: 32.4833,
            lng: 3.6667,
            population: 120000,
            wilaya: 'غرداية'
        },
        {
            name: 'ورقلة',
            lat: 31.9500,
            lng: 5.3167,
            population: 133024,
            wilaya: 'ورقلة'
        },
        {
            name: 'تمنراست',
            lat: 22.7850,
            lng: 5.5228,
            population: 92635,
            wilaya: 'تمنراست'
        },
        {
            name: 'أدرار',
            lat: 27.8744,
            lng: -0.2936,
            population: 68071,
            wilaya: 'أدرار'
        },
        {
            name: 'الشلف',
            lat: 36.1667,
            lng: 1.3333,
            population: 179768,
            wilaya: 'الشلف'
        },
        {
            name: 'المسيلة',
            lat: 35.7000,
            lng: 4.5417,
            population: 156647,
            wilaya: 'المسيلة'
        }
    ],
    
    // =======================================
    // إعدادات الخريطة
    // =======================================
    MAP: {
        // طبقات الخريطة المتاحة
        TILES: {
            OPENSTREETMAP: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                subdomains: ['a', 'b', 'c']
            },
            OPENSTREETMAP_HOT: {
                url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team',
                maxZoom: 19
            },
            OSM_ARABIC: {
                url: 'https://tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap France',
                maxZoom: 20
            },
            CARTO: {
                url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                attribution: '© OpenStreetMap contributors, © CartoDB',
                maxZoom: 20
            }
        },
        
        // إعدادات عامة
        SETTINGS: {
            defaultTileLayer: 'OPENSTREETMAP',
            defaultZoom: 12,
            maxZoom: 18,
            minZoom: 6,
            zoomControl: true,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            boxZoom: true,
            keyboard: true,
            fadeAnimation: true,
            zoomAnimation: true
        },
        
        // إعدادات العلامات
        MARKERS: {
            userIcon: {
                html: '<div class="user-location-icon"><i class="fas fa-location-arrow"></i></div>',
                className: 'user-location-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            },
            accuracyCircle: {
                color: '#4285f4',
                fillColor: '#4285f4',
                fillOpacity: 0.2,
                weight: 2
            },
            businessIconSize: {
                small: [30, 30],
                medium: [40, 40],
                large: [50, 50]
            }
        }
    },
    
    // =======================================
    // إعدادات البحث
    // =======================================
    SEARCH: {
        // نصف قطر البحث بالكيلومتر
        RADIUS_OPTIONS: [
            { value: 1, label: '1 كم', icon: 'fas fa-walking' },
            { value: 3, label: '3 كم', icon: 'fas fa-bicycle' },
            { value: 5, label: '5 كم', icon: 'fas fa-car' },
            { value: 10, label: '10 كم', icon: 'fas fa-bus' },
            { value: 20, label: '20 كم', icon: 'fas fa-truck' },
            { value: 50, label: '50 كم', icon: 'fas fa-plane' }
        ],
        
        // فئات البحث
        CATEGORIES: [
            { value: '', label: 'جميع الفئات', icon: 'fas fa-list' },
            { value: 'hospital', label: 'مستشفى', icon: 'fas fa-hospital' },
            { value: 'clinic', label: 'عيادة', icon: 'fas fa-clinic-medical' },
            { value: 'pharmacy', label: 'صيدلية', icon: 'fas fa-prescription-bottle-alt' },
            { value: 'doctor', label: 'طبيب', icon: 'fas fa-user-md' },
            { value: 'association', label: 'جمعية', icon: 'fas fa-hands-helping' },
            { value: 'company', label: 'شركة', icon: 'fas fa-building' },
            { value: 'pharmacist', label: 'صيدلي', icon: 'fas fa-mortar-pestle' }
        ],
        
        // خيارات الترتيب
        SORT_OPTIONS: [
            { value: 'distance', label: 'الأقرب أولاً', icon: 'fas fa-map-marker-alt' },
            { value: 'rating', label: 'الأعلى تقييماً', icon: 'fas fa-star' },
            { value: 'name', label: 'الاسم (أ-ي)', icon: 'fas fa-sort-alpha-down' },
            { value: 'reviewCount', label: 'الأكثر تقييماً', icon: 'fas fa-comments' }
        ],
        
        // إعدادات البحث
        SETTINGS: {
            debounceDelay: 500, // تأخير البحث التلقائي بالمللي ثانية
            minQueryLength: 2, // الحد الأدنى لطول استعلام البحث
            maxResults: 50, // الحد الأقصى للنتائج
            enableAutocomplete: true,
            enableRecentSearches: true,
            maxRecentSearches: 10,
            searchHistoryDuration: 7 // أيام
        }
    },
    
    // =======================================
    // إعدادات التخزين
    // =======================================
    STORAGE: {
        KEYS: {
            USER_LOCATION: 'user_location',
            RECENT_SEARCHES: 'recent_searches',
            FAVORITES: 'favorite_businesses',
            SETTINGS: 'app_settings',
            SEARCH_HISTORY: 'search_history'
        },
        
        SETTINGS: {
            expiration: {
                userLocation: 3600000, // ساعة واحدة بالمللي ثانية
                recentSearches: 604800000 // أسبوع واحد
            },
            encryption: false
        }
    },
    
    // =======================================
    // إعدادات واجهة المستخدم
    // =======================================
    UI: {
        // الإطارات الزمنية للرسائل
        MESSAGE_TIMEOUTS: {
            success: 3000,
            error: 5000,
            warning: 4000,
            info: 3000
        },
        
        // الرسائل الافتراضية
        MESSAGES: {
            LOCATION_SUCCESS: 'تم تحديد موقعك بنجاح!',
            LOCATION_ERROR: 'تعذر تحديد موقعك. يرجى التأكد من تفعيل خدمة الموقع.',
            LOCATION_TIMEOUT: 'انتهت المهلة في انتظار الموقع. يرجى المحاولة مرة أخرى.',
            LOCATION_PERMISSION_DENIED: 'تم رفض الإذن بالوصول إلى الموقع. يرجى السماح بالوصول إلى الموقع في إعدادات المتصفح.',
            SEARCH_NO_RESULTS: 'لا توجد نتائج للبحث. حاول بكلمات أخرى أو وسع نطاق البحث.',
            NETWORK_ERROR: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.'
        },
        
        // الألوان
        COLORS: {
            primary: '#4285f4',
            secondary: '#34a853',
            danger: '#ea4335',
            warning: '#fbbc05',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40',
            success: '#28a745'
        },
        
        // أحجام الشاشات
        BREAKPOINTS: {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400
        }
    },
    
    // =======================================
    // إعدادات التطوير
    // =======================================
    DEVELOPMENT: {
        logLevel: 'warn', // debug | info | warn | error
        enableMockData: true,
        mockDelay: 300, // تأخير محاكاة الشبكة بالمللي ثانية
        apiCaching: true,
        cacheDuration: 300000 // 5 دقائق بالمللي ثانية
    }
};

// ===========================================
// دوال المساعدة
// ===========================================
CONFIG.helpers = {
    // التحقق من صحة المفتاح
    validateApiKey: function(key) {
        return key && key.length > 20 && key !== 'YOUR_GOOGLE_API_KEY';
    },
    
    // الحصول على إحداثيات المدينة
    getCityCoordinates: function(cityName) {
        const city = CONFIG.CITIES.find(c => c.name === cityName);
        if (city) {
            return {
                lat: city.lat,
                lng: city.lng,
                name: city.name,
                wilaya: city.wilaya
            };
        }
        return CONFIG.LOCATION.DEFAULT;
    },
    
    // البحث عن مدينة بواسطة جزء من الاسم
    searchCities: function(query) {
        if (!query || query.length < 2) return [];
        const searchTerm = query.toLowerCase();
        return CONFIG.CITIES
            .filter(city => 
                city.name.toLowerCase().includes(searchTerm) ||
                city.wilaya.toLowerCase().includes(searchTerm)
            )
            .slice(0, 10); // الحد الأقصى 10 نتائج
    },
    
    // التحقق من أن الإحداثيات داخل حدود الجزائر
    isInAlgeriaBounds: function(lat, lng) {
        const bounds = CONFIG.LOCATION.ALGERIA_BOUNDS;
        return (
            lat >= bounds.south &&
            lat <= bounds.north &&
            lng >= bounds.west &&
            lng <= bounds.east
        );
    },
    
    // الحصول على المسافة بين موقعين
    calculateDistance: function(lat1, lng1, lat2, lng2) {
        const R = 6371; // نصف قطر الأرض بالكيلومتر
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },
    
    // تحويل الدرجات إلى راديان
    toRad: function(degrees) {
        return degrees * Math.PI / 180;
    },
    
    // تنسيق المسافة
    formatDistance: function(distanceKm) {
        if (distanceKm < 1) {
            return Math.round(distanceKm * 1000) + ' متر';
        } else if (distanceKm < 10) {
            return distanceKm.toFixed(1) + ' كم';
        } else {
            return Math.round(distanceKm) + ' كم';
        }
    },
    
    // الحصول على اسم الفئة
    getCategoryLabel: function(categoryValue) {
        const category = CONFIG.SEARCH.CATEGORIES.find(c => c.value === categoryValue);
        return category ? category.label : 'غير معروف';
    },
    
    // الحصول على أيقونة الفئة
    getCategoryIcon: function(categoryValue) {
        const category = CONFIG.SEARCH.CATEGORIES.find(c => c.value === categoryValue);
        return category ? category.icon : 'fas fa-map-marker-alt';
    },
    
    // الحصول على خيارات نصف القرض بناءً على النوع
    getRadiusOptionsForType: function(type = 'mobile') {
        if (type === 'mobile') {
            return CONFIG.SEARCH.RADIUS_OPTIONS.slice(0, 4); // أول 4 خيارات للجوال
        }
        return CONFIG.SEARCH.RADIUS_OPTIONS;
    }
};

// ===========================================
// إضافة وظائف للموقع الجغرافي
// ===========================================
CONFIG.location = {
    // الحصول على الموقع الحالي للمستخدم
    getCurrentLocation: function(options = {}) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('المتصفح لا يدعم خدمة تحديد الموقع.'));
                return;
            }
            
            const geolocationOptions = {
                ...CONFIG.LOCATION.GEOLOCATION,
                ...options
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy || 50,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp
                    };
                    
                    // التحقق من أن الموقع داخل الجزائر
                    if (!CONFIG.helpers.isInAlgeriaBounds(location.lat, location.lng)) {
                        reject(new Error('يبدو أنك خارج الجزائر. تم استخدام الموقع الافتراضي.'));
                        resolve(CONFIG.LOCATION.DEFAULT);
                        return;
                    }
                    
                    // حفظ الموقع في التخزين المحلي
                    this.saveLocationToStorage(location);
                    resolve(location);
                },
                (error) => {
                    const errorMessage = this.getGeolocationError(error);
                    reject(new Error(errorMessage));
                },
                geolocationOptions
            );
        });
    },
    
    // الحصول على رسالة الخطأ المناسبة
    getGeolocationError: function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                return CONFIG.UI.MESSAGES.LOCATION_PERMISSION_DENIED;
            case error.POSITION_UNAVAILABLE:
                return CONFIG.UI.MESSAGES.LOCATION_ERROR;
            case error.TIMEOUT:
                return CONFIG.UI.MESSAGES.LOCATION_TIMEOUT;
            default:
                return CONFIG.UI.MESSAGES.LOCATION_ERROR;
        }
    },
    
    // حفظ الموقع في التخزين المحلي
    saveLocationToStorage: function(location) {
        try {
            const locationData = {
                ...location,
                savedAt: Date.now(),
                expiresAt: Date.now() + CONFIG.STORAGE.SETTINGS.expiration.userLocation
            };
            
            localStorage.setItem(
                CONFIG.STORAGE.KEYS.USER_LOCATION,
                JSON.stringify(locationData)
            );
        } catch (error) {
            console.warn('فشل حفظ الموقع:', error);
        }
    },
    
    // استرجاع الموقع من التخزين المحلي
    getLocationFromStorage: function() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE.KEYS.USER_LOCATION);
            if (!stored) return null;
            
            const location = JSON.parse(stored);
            
            // التحقق من صلاحية البيانات
            if (location.expiresAt && location.expiresAt > Date.now()) {
                return location;
            }
            
            // البيانات منتهية الصلاحية
            localStorage.removeItem(CONFIG.STORAGE.KEYS.USER_LOCATION);
            return null;
        } catch (error) {
            console.warn('فشل استرجاع الموقع:', error);
            return null;
        }
    },
    
    // الحصول على أقرب مدينة للموقع
    getNearestCity: function(lat, lng) {
        let nearestCity = null;
        let minDistance = Infinity;
        
        for (const city of CONFIG.CITIES) {
            const distance = CONFIG.helpers.calculateDistance(lat, lng, city.lat, city.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city;
            }
        }
        
        return nearestCity ? {
            ...nearestCity,
            distance: minDistance
        } : null;
    },
    
    // الحصول على العنوان من الإحداثيات (Geocoding)
    getAddressFromCoords: async function(lat, lng) {
        try {
            // محاولة استخدام Google Geocoding أولاً
            if (CONFIG.helpers.validateApiKey(CONFIG.APIS.GOOGLE.key)) {
                const url = `${CONFIG.APIS.GOOGLE.geocode}/json?latlng=${lat},${lng}&key=${CONFIG.APIS.GOOGLE.key}&language=ar`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.status === 'OK' && data.results.length > 0) {
                    return {
                        address: data.results[0].formatted_address,
                        provider: 'google'
                    };
                }
            }
            
            // استخدام Nominatim كبديل
            const nominatimUrl = `${CONFIG.APIS.OPENSTREETMAP.nominatim}/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`;
            const response = await fetch(nominatimUrl);
            const data = await response.json();
            
            if (data.display_name) {
                return {
                    address: data.display_name,
                    provider: 'nominatim'
                };
            }
            
            return null;
        } catch (error) {
            console.error('خطأ في الحصول على العنوان:', error);
            return null;
        }
    }
};

// ===========================================
// إضافة وظائف للخريطة
// ===========================================
CONFIG.map = {
    // إنشاء خريطة Leaflet
    createMap: function(containerId, options = {}) {
        const defaultOptions = {
            center: CONFIG.LOCATION.DEFAULT,
            zoom: CONFIG.MAP.SETTINGS.defaultZoom,
            layers: [this.getTileLayer()],
            ...CONFIG.MAP.SETTINGS,
            ...options
        };
        
        return L.map(containerId, defaultOptions);
    },
    
    // الحصول على طبقة الخريطة
    getTileLayer: function(layerName = CONFIG.MAP.SETTINGS.defaultTileLayer) {
        const tileConfig = CONFIG.MAP.TILES[layerName] || CONFIG.MAP.TILES.OPENSTREETMAP;
        return L.tileLayer(tileConfig.url, {
            attribution: tileConfig.attribution,
            maxZoom: tileConfig.maxZoom,
            subdomains: tileConfig.subdomains || ['a', 'b', 'c']
        });
    },
    
    // إنشاء علامة موقع المستخدم
    createUserMarker: function(location, options = {}) {
        const iconOptions = {
            ...CONFIG.MAP.MARKERS.userIcon,
            ...options.icon
        };
        
        const icon = L.divIcon(iconOptions);
        
        const marker = L.marker([location.lat, location.lng], {
            icon: icon,
            zIndexOffset: 1000,
            title: 'موقعك الحالي',
            draggable: false
        });
        
        // إضافة دائرة الدقة إذا كانت متوفرة
        if (location.accuracy) {
            const circleOptions = {
                ...CONFIG.MAP.MARKERS.accuracyCircle,
                radius: location.accuracy
            };
            
            const accuracyCircle = L.circle([location.lat, location.lng], circleOptions);
            marker.accuracyCircle = accuracyCircle;
        }
        
        return marker;
    },
    
    // إنشاء علامة المؤسسة
    createBusinessMarker: function(business, options = {}) {
        const iconSize = options.size || 'medium';
        const icon = L.divIcon({
            html: `<div class="business-marker ${business.category}" title="${business.name}">
                      <i class="${CONFIG.helpers.getCategoryIcon(business.category)}"></i>
                   </div>`,
            className: 'business-marker-icon',
            iconSize: CONFIG.MAP.MARKERS.businessIconSize[iconSize],
            iconAnchor: [CONFIG.MAP.MARKERS.businessIconSize[iconSize][0] / 2, CONFIG.MAP.MARKERS.businessIconSize[iconSize][1]]
        });
        
        return L.marker([business.lat, business.lng], {
            icon: icon,
            title: business.name
        });
    }
};

// ===========================================
// التصدير والتهيئة
// ===========================================
// تسجيل الإصدار
console.log(`${CONFIG.APP.name} - الإصدار ${CONFIG.APP.version}`);

// تصدير الإعدادات للاستخدام العالمي
window.CONFIG = CONFIG;

// التصدير للاستخدام في الوحدات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// التحقق من مفاتيح API
if (CONFIG.DEVELOPMENT.logLevel === 'debug') {
    console.debug('مفتاح Google API:', CONFIG.helpers.validateApiKey(CONFIG.APIS.GOOGLE.key) ? 'صالحة' : 'غير صالحة أو غير موجود');
}

// إضافة listener لتفعيل وضع الظلام تلقائياً
if (CONFIG.UI.theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}