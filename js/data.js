// ===========================================
// بيانات الوهمية الاحتياطية
// ===========================================
const backupBusinessesData = [
    {
        id: 1,
        name: "مستشفى مصطفى باشا الجامعي",
        category: "hospital",
        description: "أكبر مستشفى جامعي في العاصمة الجزائرية، يوفر خدمات طبية متكاملة.",
        address: "شارع الاستقلال، بلوزداد، الجزائر العاصمة",
        phone: ["021 63 44 44", "021 63 44 45"],
        email: "contact@chumustapha.dz",
        website: "www.chumustapha.dz",
        lat: 36.7571,
        lng: 3.0588,
        hours: {
            sunday: { open: "08:00", close: "22:00" },
            monday: { open: "08:00", close: "22:00" },
            tuesday: { open: "08:00", close: "22:00" },
            wednesday: { open: "08:00", close: "22:00" },
            thursday: { open: "08:00", close: "22:00" },
            friday: { open: "14:00", close: "22:00" },
            saturday: { open: "08:00", close: "22:00" }
        },
        rating: 4.5,
        reviewCount: 234,
        featured: true,
        services: ["طوارئ 24/24", "جراحة عامة", "أمراض القلب", "أمراض الأطفال"]
    },
    {
        id: 2,
        name: "صيدلية النجاح",
        category: "pharmacy",
        description: "صيدلية توفر جميع الأدوية والمستلزمات الطبية.",
        address: "شارع العربي بن مهيدي، وسط المدينة، الجزائر العاصمة",
        phone: ["021 71 23 45"],
        email: "pharmacie.alnajah@gmail.com",
        lat: 36.7654,
        lng: 3.0499,
        hours: {
            sunday: { open: "08:00", close: "20:00" },
            monday: { open: "08:00", close: "20:00" },
            tuesday: { open: "08:00", close: "20:00" },
            wednesday: { open: "08:00", close: "20:00" },
            thursday: { open: "08:00", close: "20:00" },
            friday: { open: "10:00", close: "18:00" },
            saturday: { open: "08:00", close: "20:00" }
        },
        rating: 4.2,
        reviewCount: 89,
        featured: false
    },
    {
        id: 3,
        name: "عيادة الدكتور خالد",
        category: "doctor",
        description: "عيادة متخصصة في الأمراض الباطنية والجهاز الهضمي.",
        address: "حي حسين داي، الجزائر العاصمة",
        phone: ["0555 12 34 56"],
        lat: 36.7402,
        lng: 3.0789,
        hours: {
            sunday: { open: "09:00", close: "17:00" },
            monday: { open: "09:00", close: "17:00" },
            tuesday: { open: "09:00", close: "17:00" },
            wednesday: { open: "09:00", close: "17:00" },
            thursday: { open: "09:00", close: "17:00" },
            friday: { open: "14:00", close: "18:00" },
            saturday: { open: "09:00", close: "13:00" }
        },
        rating: 4.7,
        reviewCount: 67,
        featured: true,
        specialty: "أمراض باطنية وجهاز هضمي"
    },
    {
        id: 4,
        name: "مستشفى بني مسوس",
        category: "hospital",
        description: "مستشفى عمومي يقدم خدمات صحية متنوعة.",
        address: "بني مسوس، الجزائر العاصمة",
        phone: ["023 45 67 89"],
        lat: 36.7201,
        lng: 3.0123,
        hours: {
            sunday: { open: "00:00", close: "23:59" },
            monday: { open: "00:00", close: "23:59" },
            tuesday: { open: "00:00", close: "23:59" },
            wednesday: { open: "00:00", close: "23:59" },
            thursday: { open: "00:00", close: "23:59" },
            friday: { open: "00:00", close: "23:59" },
            saturday: { open: "00:00", close: "23:59" }
        },
        rating: 4.3,
        reviewCount: 156,
        featured: false
    },
    {
        id: 5,
        name: "صيدلية الصحة",
        category: "pharmacy",
        description: "صيدلية تعمل ليلاً لتلبية الاحتياجات الطبية العاجلة.",
        address: "حي بولوغين، الجزائر العاصمة",
        phone: ["0770 98 76 54"],
        lat: 36.7503,
        lng: 3.0897,
        hours: {
            sunday: { open: "00:00", close: "23:59" },
            monday: { open: "00:00", close: "23:59" },
            tuesday: { open: "00:00", close: "23:59" },
            wednesday: { open: "00:00", close: "23:59" },
            thursday: { open: "00:00", close: "23:59" },
            friday: { open: "00:00", close: "23:59" },
            saturday: { open: "00:00", close: "23:59" }
        },
        rating: 4.0,
        reviewCount: 45,
        featured: true
    }
];

// ===========================================
// الإعدادات والثوابت
// ===========================================
const API_CONFIG = {
    GOOGLE_API_KEY: 'AIzaSyA0s1a7phLN0iaD6-UE7MH4Fs4gSNcVe80', // مفتاح API افتراضي للاختبار
    NOMINATIM_URL: 'https://nominatim.openstreetmap.org/search',
    OVERPASS_API_URL: 'https://overpass-api.de/api/interpreter',
    DEFAULT_LOCATION: '36.7538,3.0588', // الجزائر العاصمة
    DEFAULT_RADIUS: 5000,
    DEFAULT_LIMIT: 10,
    REQUEST_TIMEOUT: 10000,
    CACHE_DURATION: 300000 // 5 دقائق
};

const PLACE_CATEGORIES = {
    'hospital': 'hospital',
    'clinic': 'doctor',
    'pharmacy': 'pharmacy',
    'doctor': 'doctor',
    'association': 'establishment',
    'company': 'establishment'
};

const OSM_TAGS = {
    'hospital': '"amenity"="hospital"',
    'clinic': '"amenity"="clinic"',
    'pharmacy': '"amenity"="pharmacy"',
    'doctor': '"amenity"="doctors"',
    'association': '"office"="association"',
    'company': '"office"="company"'
};

// ===========================================
// نظام التخزين المؤقت
// ===========================================
const CacheManager = {
    cache: new Map(),
    timestamps: new Map(),
    
    // تخزين البيانات مع مهلة
    set(key, data, duration = API_CONFIG.CACHE_DURATION) {
        this.cache.set(key, data);
        this.timestamps.set(key, Date.now() + duration);
        return data;
    },
    
    // الحصول على البيانات المخزنة
    get(key) {
        const timestamp = this.timestamps.get(key);
        if (timestamp && timestamp > Date.now()) {
            return this.cache.get(key);
        }
        // تنظيف البيانات المنتهية
        if (timestamp && timestamp <= Date.now()) {
            this.cache.delete(key);
            this.timestamps.delete(key);
        }
        return null;
    },
    
    // مسح التخزين المؤقت
    clear() {
        this.cache.clear();
        this.timestamps.clear();
    },
    
    // مسح بيانات قديمة
    cleanup() {
        const now = Date.now();
        for (const [key, timestamp] of this.timestamps) {
            if (timestamp <= now) {
                this.cache.delete(key);
                this.timestamps.delete(key);
            }
        }
    }
};

// ===========================================
// دوال المساعدة (Helpers)
// ===========================================
const Helpers = {
    // الحصول على أيقونة الفئة
    getCategoryIcon: (category) => {
        const icons = {
            'hospital': 'fas fa-hospital',
            'clinic': 'fas fa-clinic-medical',
            'pharmacy': 'fas fa-prescription-bottle-alt',
            'doctor': 'fas fa-user-md',
            'association': 'fas fa-hands-helping',
            'company': 'fas fa-building',
            'pharmacist': 'fas fa-mortar-pestle'
        };
        return icons[category] || 'fas fa-map-marker-alt';
    },

    // الحصول على اسم الفئة بالعربية
    getCategoryName: (category) => {
        const names = {
            'hospital': 'مستشفى',
            'clinic': 'عيادة',
            'pharmacy': 'صيدلية',
            'doctor': 'طبيب',
            'association': 'جمعية',
            'company': 'شركة',
            'pharmacist': 'صيدلي'
        };
        return names[category] || 'مؤسسة';
    },

    // توليد نجوم التقييم
    generateRatingStars: (rating) => {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        
        return starsHtml;
    },

    // تنسيق ساعات العمل
    formatBusinessHours: (hours) => {
        const days = {
            sunday: 'الأحد',
            monday: 'الإثنين',
            tuesday: 'الثلاثاء',
            wednesday: 'الأربعاء',
            thursday: 'الخميس',
            friday: 'الجمعة',
            saturday: 'السبت'
        };
        
        let hoursHtml = '';
        for (const day in hours) {
            if (hours[day].open && hours[day].close) {
                hoursHtml += `
                    <div class="hour-row">
                        <span class="day">${days[day]}:</span>
                        <span class="time">${hours[day].open} - ${hours[day].close}</span>
                    </div>
                `;
            } else {
                hoursHtml += `
                    <div class="hour-row">
                        <span class="day">${days[day]}:</span>
                        <span class="time closed">مغلق</span>
                    </div>
                `;
            }
        }
        
        return hoursHtml;
    },

    // تنسيق الوقت
    formatTime: (timeStr) => {
        if (!timeStr || timeStr.length < 4) return '00:00';
        const hour = parseInt(timeStr.substring(0, 2));
        const minute = timeStr.substring(2, 4);
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    },

    // حساب المسافة بين نقطتين (Haversine formula)
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // نصف قطر الأرض بالكيلومتر
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // المسافة بالكيلومتر
    },

    // تنظيف النص من أحرف غير آمنة
    sanitizeText: (text) => {
        if (!text) return '';
        return text.toString()
            .replace(/[<>"'&]/g, '')
            .trim();
    }
};

// ===========================================
// دوال التعامل مع البيانات الوهمية
// ===========================================
const BackupData = {
    // تصفية البيانات الوهمية
    filterBackupData: (query = '', category = '') => {
        let filtered = [...backupBusinessesData];
        
        if (query) {
            const queryLower = Helpers.sanitizeText(query).toLowerCase();
            filtered = filtered.filter(business => 
                business.name.toLowerCase().includes(queryLower) ||
                business.description.toLowerCase().includes(queryLower) ||
                business.address.toLowerCase().includes(queryLower)
            );
        }
        
        if (category) {
            filtered = filtered.filter(business => business.category === category);
        }
        
        return filtered;
    },

    // الحصول على ساعات العمل الافتراضية
    getDefaultHours: () => {
        return {
            sunday: { open: "08:00", close: "22:00" },
            monday: { open: "08:00", close: "22:00" },
            tuesday: { open: "08:00", close: "22:00" },
            wednesday: { open: "08:00", close: "22:00" },
            thursday: { open: "08:00", close: "22:00" },
            friday: { open: "14:00", close: "22:00" },
            saturday: { open: "08:00", close: "22:00" }
        };
    },

    // البحث عن مؤسسة بالمعرف
    getBusinessById: (id) => {
        return backupBusinessesData.find(b => b.id === id);
    }
};

// ===========================================
// دوال Google Places API (مصححة)
// ===========================================
const GooglePlacesAPI = {
    // دالة مساعدة لتنسيق الوقت
    formatTimeForGoogle: (timeStr) => {
        if (!timeStr || timeStr.length < 4) return '00:00';
        const hour = parseInt(timeStr.substring(0, 2));
        const minute = timeStr.substring(2, 4);
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    },

    // البحث في Google Places API مع التخزين المؤقت
    searchPlaces: async (query, location, radius = 5000, type = '') => {
        try {
            if (API_CONFIG.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY') {
                return [];
            }

            const cacheKey = `google_${query}_${location}_${radius}_${type}`;
            const cached = CacheManager.get(cacheKey);
            if (cached) {
                console.log('Using cached Google Places results');
                return cached;
            }

            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
            const params = new URLSearchParams({
                query: query,
                location: location,
                radius: radius,
                key: API_CONFIG.GOOGLE_API_KEY,
                language: 'ar'
            });
            
            if (type) {
                params.set('type', type);
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(`${url}?${params}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (data.status === 'OK' && data.results) {
                const places = data.results;
                const detailedPlaces = await Promise.all(
                    places.slice(0, API_CONFIG.DEFAULT_LIMIT).map(async (place) => {
                        return await GooglePlacesAPI.getPlaceDetails(place.place_id);
                    })
                );
                
                const validPlaces = detailedPlaces.filter(place => place !== null);
                CacheManager.set(cacheKey, validPlaces);
                return validPlaces;
            } else if (data.status === 'ZERO_RESULTS') {
                console.log('No Google Places results found');
                return [];
            }
            
            console.warn('Google Places API error:', data.status, data.error_message);
            return [];
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Google Places API request timed out');
            } else {
                console.error('Error fetching from Google Places:', error);
            }
            return [];
        }
    },

    // الحصول على تفاصيل مكان معين
    getPlaceDetails: async (placeId) => {
        try {
            const cacheKey = `google_details_${placeId}`;
            const cached = CacheManager.get(cacheKey);
            if (cached) return cached;

            const url = `https://maps.googleapis.com/maps/api/place/details/json`;
            const params = new URLSearchParams({
                place_id: placeId,
                fields: 'name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,user_ratings_total,website,types',
                key: API_CONFIG.GOOGLE_API_KEY,
                language: 'ar'
            });
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(`${url}?${params}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (data.status === 'OK' && data.result) {
                const business = GooglePlacesAPI.mapGooglePlaceToBusiness(data.result);
                CacheManager.set(cacheKey, business);
                return business;
            }
            return null;
        } catch (error) {
            console.error('Error fetching place details:', error);
            return null;
        }
    },

    // تحويل بيانات Google Place إلى تنسيق بياناتنا
    mapGooglePlaceToBusiness: (place) => {
        const category = GooglePlacesAPI.determineCategory(place.types || []);
        
        // تنظيف البيانات
        const phone = place.formatted_phone_number ? 
            [place.formatted_phone_number.replace(/[^\d\+]/g, '')] : [];
        
        const website = place.website || '';
        const cleanWebsite = website.startsWith('http') ? website : website;
        
        return {
            id: `google_${place.place_id}`,
            name: Helpers.sanitizeText(place.name) || 'اسم غير معروف',
            category: category,
            description: '',
            address: Helpers.sanitizeText(place.formatted_address) || 'عنوان غير معروف',
            phone: phone,
            email: '',
            website: cleanWebsite,
            lat: place.geometry?.location?.lat || 0,
            lng: place.geometry?.location?.lng || 0,
            hours: GooglePlacesAPI.formatGoogleHours(place.opening_hours),
            rating: parseFloat(place.rating) || 0,
            reviewCount: parseInt(place.user_ratings_total) || 0,
            featured: false,
            services: [],
            types: place.types || [],
            source: 'google'
        };
    },

    // تحديد الفئة بناءً على أنواع Google
    determineCategory: (types) => {
        if (!Array.isArray(types)) return 'company';
        
        if (types.includes('hospital')) return 'hospital';
        if (types.includes('pharmacy')) return 'pharmacy';
        if (types.includes('doctor')) return 'doctor';
        if (types.includes('health') || types.includes('clinic')) return 'clinic';
        if (types.includes('association') || types.includes('nonprofit')) return 'association';
        
        return 'company';
    },

    // تنسيق ساعات العمل من Google
    formatGoogleHours: (openingHours) => {
        if (!openingHours || !Array.isArray(openingHours.periods)) {
            return BackupData.getDefaultHours();
        }
        
        const formattedHours = {};
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        days.forEach((day, index) => {
            const dayPeriod = openingHours.periods.find(p => p.open && p.open.day === index);
            if (dayPeriod && dayPeriod.open && dayPeriod.close) {
                formattedHours[day] = {
                    open: GooglePlacesAPI.formatTimeForGoogle(dayPeriod.open.time),
                    close: GooglePlacesAPI.formatTimeForGoogle(dayPeriod.close.time)
                };
            } else {
                formattedHours[day] = { open: '', close: '' };
            }
        });
        
        return formattedHours;
    }
};

// ===========================================
// دوال Overpass API (مصححة)
// ===========================================
const OverpassAPI = {
    // البحث باستخدام Overpass API مع التخزين المؤقت
    search: async (category, location, radius = 5000) => {
        try {
            const [lat, lon] = location.split(',').map(Number);
            if (isNaN(lat) || isNaN(lon)) {
                console.error('Invalid location format');
                return [];
            }
            
            const cacheKey = `overpass_${category}_${location}_${radius}`;
            const cached = CacheManager.get(cacheKey);
            if (cached) {
                console.log('Using cached Overpass results');
                return cached;
            }
            
            const tags = OSM_TAGS[category] || '"amenity"';
            
            const query = `
                [out:json][timeout:25];
                (
                    node[${tags}](around:${radius},${lat},${lon});
                    way[${tags}](around:${radius},${lat},${lon});
                    relation[${tags}](around:${radius},${lat},${lon});
                );
                out body center;
            `;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(API_CONFIG.OVERPASS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `data=${encodeURIComponent(query)}`,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (data.elements && Array.isArray(data.elements) && data.elements.length > 0) {
                const businesses = data.elements.map(element => 
                    OverpassAPI.mapOSMElementToBusiness(element, category)
                ).filter(b => b !== null);
                
                CacheManager.set(cacheKey, businesses);
                return businesses;
            }
            
            return [];
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Overpass API request timed out');
            } else {
                console.error('Error fetching from Overpass API:', error);
            }
            return [];
        }
    },

    // تحويل عنصر OSM إلى بيانات المؤسسة
    mapOSMElementToBusiness: (element, category) => {
        try {
            const tags = element.tags || {};
            const name = Helpers.sanitizeText(
                tags.name || tags['name:ar'] || tags['name:fr'] || 'مؤسسة بدون اسم'
            );
            
            // تحديد الإحداثيات
            let lat, lng;
            if (element.center) {
                lat = element.center.lat;
                lng = element.center.lon;
            } else if (element.lat && element.lon) {
                lat = element.lat;
                lng = element.lon;
            } else if (element.nodes && element.nodes.length > 0) {
                // للطرق (ways) بدون مركز
                lat = element.lat || 36.7538;
                lng = element.lon || 3.0588;
            } else {
                return null;
            }
            
            // تنظيف رقم الهاتف
            let phone = [];
            if (tags.phone) {
                const cleanPhone = tags.phone.replace(/[^\d\+]/g, '');
                if (cleanPhone) phone = [cleanPhone];
            }
            
            // تنظيف الموقع الإلكتروني
            let website = tags.website || '';
            if (website && !website.startsWith('http')) {
                website = 'https://' + website;
            }
            
            // إنشاء معرف فريد
            const id = `osm_${element.type}_${element.id}`;
            
            return {
                id: id,
                name: name,
                category: category,
                description: Helpers.sanitizeText(tags.description || ''),
                address: Helpers.sanitizeText(
                    tags['addr:full'] || 
                    (tags.addr_housenumber ? 
                     `${tags.addr_street || ''} ${tags.addr_housenumber || ''}, ${tags.addr_city || ''}`.trim() : 
                     'عنوان غير محدد')
                ),
                phone: phone,
                email: Helpers.sanitizeText(tags.email || ''),
                website: website,
                lat: lat,
                lng: lng,
                hours: OverpassAPI.parseOSMOpeningHours(tags.opening_hours),
                rating: 3.5 + (Math.random() * 1.5), // تقييم بين 3.5 و 5
                reviewCount: Math.floor(Math.random() * 100),
                featured: Math.random() > 0.85, // 15% مميزة
                services: OverpassAPI.getServicesFromTags(tags),
                tags: tags,
                source: 'osm'
            };
        } catch (error) {
            console.error('Error mapping OSM element:', error);
            return null;
        }
    },

    // تحليل ساعات العمل من OSM
    parseOSMOpeningHours: (openingHoursStr) => {
        if (!openingHoursStr) return BackupData.getDefaultHours();
        
        try {
            if (openingHoursStr.includes('24/7')) {
                return {
                    sunday: { open: "00:00", close: "23:59" },
                    monday: { open: "00:00", close: "23:59" },
                    tuesday: { open: "00:00", close: "23:59" },
                    wednesday: { open: "00:00", close: "23:59" },
                    thursday: { open: "00:00", close: "23:59" },
                    friday: { open: "00:00", close: "23:59" },
                    saturday: { open: "00:00", close: "23:59" }
                };
            }
            
            // محاولة تحليل التنسيق الأساسي
            const days = {
                'Su': 'sunday',
                'Mo': 'monday',
                'Tu': 'tuesday',
                'We': 'wednesday',
                'Th': 'thursday',
                'Fr': 'friday',
                'Sa': 'saturday'
            };
            
            const hours = BackupData.getDefaultHours();
            
            // تحليل بسيط للفترات
            const periods = openingHoursStr.split(';');
            for (const period of periods) {
                const match = period.match(/([A-Za-z]{2})(\s*-\s*([A-Za-z]{2}))?\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                if (match) {
                    const startDay = match[1];
                    const endDay = match[3] || startDay;
                    const openTime = match[4];
                    const closeTime = match[5];
                    
                    // تطبيق على جميع الأيام في النطاق
                    const dayKeys = Object.keys(days);
                    const startIndex = dayKeys.indexOf(startDay);
                    const endIndex = dayKeys.indexOf(endDay);
                    
                    if (startIndex !== -1 && endIndex !== -1) {
                        for (let i = startIndex; i <= endIndex; i++) {
                            const dayKey = days[dayKeys[i]];
                            if (dayKey) {
                                hours[dayKey] = { open: openTime, close: closeTime };
                            }
                        }
                    }
                }
            }
            
            return hours;
        } catch (error) {
            console.error('Error parsing OSM opening hours:', error);
            return BackupData.getDefaultHours();
        }
    },

    // استخراج الخدمات من تاجات OSM
    getServicesFromTags: (tags) => {
        const services = [];
        
        if (tags.amenity) services.push(tags.amenity);
        if (tags.healthcare) services.push(tags.healthcare);
        if (tags.speciality) services.push(tags.speciality);
        if (tags['healthcare:speciality']) services.push(tags['healthcare:speciality']);
        
        return services.length > 0 ? services : ['خدمات عامة'];
    }
};

// ===========================================
// دوال Nominatim (مطورة)
// ===========================================
const NominatimAPI = {
    // البحث في Nominatim مع التخزين المؤقت
    search: async (query) => {
        try {
            const cacheKey = `nominatim_${query}`;
            const cached = CacheManager.get(cacheKey);
            if (cached) return cached;

            const url = `${API_CONFIG.NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=ar`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(url, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            CacheManager.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching from Nominatim:', error);
            return [];
        }
    },

    // البحث العكسي (Reverse Geocoding)
    reverse: async (lat, lon) => {
        try {
            const cacheKey = `nominatim_reverse_${lat}_${lon}`;
            const cached = CacheManager.get(cacheKey);
            if (cached) return cached;

            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(url, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            CacheManager.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    },

    // الحصول على عنوان من إحداثيات
    getAddressFromCoords: async (lat, lon) => {
        const result = await NominatimAPI.reverse(lat, lon);
        if (result && result.display_name) {
            return result.display_name;
        }
        return 'عنوان غير معروف';
    }
};

// ===========================================
// خدمة البحث الرئيسية (مطورة)
// ===========================================
const SearchService = {
    // دالة البحث الرئيسية مع تحسينات
    searchBusinesses: async (query = '', category = '', location = null, radius = 5000) => {
        try {
            if (!location) {
                location = API_CONFIG.DEFAULT_LOCATION;
            }
            
            // تحقق من صحة الإحداثيات
            const [lat, lon] = location.split(',').map(Number);
            if (isNaN(lat) || isNaN(lon)) {
                location = API_CONFIG.DEFAULT_LOCATION;
            }
            
            let businesses = [];
            
            // محاولة استخدام Google Places أولاً إذا كان المفتاح متاحاً
            const hasGoogleKey = API_CONFIG.GOOGLE_API_KEY && 
                               API_CONFIG.GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY' &&
                               API_CONFIG.GOOGLE_API_KEY !== 'AIzaSyA0s1a7phLN0iaD6-UE7MH4Fs4gSNcVe80';
            
            if (hasGoogleKey) {
                console.log('Using Google Places API...');
                
                let googleQuery = Helpers.sanitizeText(query);
                if (!googleQuery && category) {
                    googleQuery = Helpers.getCategoryName(category);
                }
                
                if (googleQuery) {
                    const googleType = PLACE_CATEGORIES[category] || '';
                    businesses = await GooglePlacesAPI.searchPlaces(googleQuery, location, radius, googleType);
                }
            }
            
            // استخدام Overpass API كخيار ثانٍ
            if (businesses.length === 0 && category) {
                console.log('Using Overpass API...');
                businesses = await OverpassAPI.search(category, location, radius);
                
                // تصفية حسب الاستعلام إذا كان موجودًا
                if (query && businesses.length > 0) {
                    const queryLower = Helpers.sanitizeText(query).toLowerCase();
                    businesses = businesses.filter(business => 
                        business.name.toLowerCase().includes(queryLower) ||
                        business.address.toLowerCase().includes(queryLower)
                    );
                }
            }
            
            // استخدام البيانات الوهمية كملاذ أخير
            if (businesses.length === 0) {
                console.log('Using backup data...');
                businesses = BackupData.filterBackupData(query, category);
                
                // إضافة مسافة للمستخدم إذا كان هناك موقع
                if (location && businesses.length > 0) {
                    const [userLat, userLon] = location.split(',').map(Number);
                    businesses.forEach(business => {
                        if (business.lat && business.lng) {
                            business.distance = Helpers.calculateDistance(
                                userLat, userLon,
                                business.lat, business.lng
                            );
                        }
                    });
                }
            }
            
            // تخزين نتائج البحث الأخيرة مع تمييز المصدر
            window.lastSearchResults = businesses.map(b => ({
                ...b,
                searchTime: new Date().toISOString(),
                searchQuery: query,
                searchCategory: category
            }));
            
            // تنظيف التخزين المؤقت القديم
            setTimeout(() => CacheManager.cleanup(), 1000);
            
            return businesses;
        } catch (error) {
            console.error('Error in searchBusinesses:', error);
            // العودة إلى البيانات الوهمية في حالة الخطأ
            return BackupData.filterBackupData(query, category);
        }
    },

    // دالة الحصول على البيانات المميزة مع تحسينات
    getFeaturedBusinesses: async () => {
        try {
            const cacheKey = 'featured_businesses';
            const cached = CacheManager.get(cacheKey);
            if (cached) return cached;

            // محاولة الحصول على بيانات من APIs
            const featured = await SearchService.searchBusinesses('', 'hospital', API_CONFIG.DEFAULT_LOCATION, 10000);
            
            let result;
            if (featured.length >= 3) {
                result = featured.slice(0, 3).map(business => ({
                    ...business,
                    featured: true,
                    isFeatured: true
                }));
            } else {
                result = backupBusinessesData
                    .filter(business => business.featured)
                    .slice(0, 3)
                    .map(business => ({
                        ...business,
                        isFeatured: true
                    }));
            }
            
            CacheManager.set(cacheKey, result, 600000); // 10 دقائق
            return result;
        } catch (error) {
            console.error('Error getting featured businesses:', error);
            return backupBusinessesData
                .filter(business => business.featured)
                .slice(0, 3);
        }
    },

    // دالة الحصول على تفاصيل مؤسسة مع تحسينات
    getBusinessDetails: async (businessId, source = 'backup') => {
        try {
            const cacheKey = `details_${businessId}_${source}`;
            const cached = CacheManager.get(cacheKey);
            if (cached) return cached;

            // التعامل مع معرفات Google Places
            if (businessId.startsWith('google_') && source === 'google') {
                const placeId = businessId.replace('google_', '');
                const details = await GooglePlacesAPI.getPlaceDetails(placeId);
                if (details) {
                    CacheManager.set(cacheKey, details);
                    return details;
                }
            }
            
            // التعامل مع معرفات OSM
            if (businessId.startsWith('osm_') && source === 'osm') {
                // البحث في نتائج البحث الأخيرة
                if (window.lastSearchResults) {
                    const found = window.lastSearchResults.find(b => b.id === businessId);
                    if (found) {
                        CacheManager.set(cacheKey, found);
                        return found;
                    }
                }
            }
            
            // البحث في البيانات الوهمية
            const business = BackupData.getBusinessById(parseInt(businessId));
            if (business) {
                CacheManager.set(cacheKey, business);
                return business;
            }
            
            // البحث في نتائج البحث السابقة
            if (window.lastSearchResults) {
                const found = window.lastSearchResults.find(b => 
                    b.id === businessId || b.id === parseInt(businessId)
                );
                if (found) {
                    CacheManager.set(cacheKey, found);
                    return found;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error getting business details:', error);
            return null;
        }
    },

    // البحث عن موقع بالعنوان
    searchLocationByAddress: async (address) => {
        try {
            const results = await NominatimAPI.search(address);
            if (results.length > 0) {
                return results.map(result => ({
                    name: result.display_name,
                    lat: result.lat,
                    lng: result.lon,
                    address: {
                        city: result.address.city || result.address.town || result.address.village,
                        country: result.address.country,
                        country_code: result.address.country_code
                    }
                }));
            }
            return [];
        } catch (error) {
            console.error('Error searching location:', error);
            return [];
        }
    }
};

// ===========================================
// تصدير الكائن الرئيسي للاستخدام
// ===========================================
window.BusinessDataModule = {
    // البيانات
    backupBusinessesData,
    
    // الإعدادات
    API_CONFIG,
    
    // الخدمات الرئيسية
    searchBusinesses: SearchService.searchBusinesses,
    getFeaturedBusinesses: SearchService.getFeaturedBusinesses,
    getBusinessDetails: SearchService.getBusinessDetails,
    searchLocation: SearchService.searchLocationByAddress,
    reverseGeocode: NominatimAPI.reverse,
    getAddressFromCoords: NominatimAPI.getAddressFromCoords,
    
    // خدمات API
    searchWithNominatim: NominatimAPI.search,
    
    // دوال المساعدة
    getCategoryIcon: Helpers.getCategoryIcon,
    getCategoryName: Helpers.getCategoryName,
    generateRatingStars: Helpers.generateRatingStars,
    formatBusinessHours: Helpers.formatBusinessHours,
    calculateDistance: Helpers.calculateDistance,
    sanitizeText: Helpers.sanitizeText,
    
    // نظام التخزين المؤقت
    cacheManager: CacheManager,
    
    // إصدار الملف
    version: '2.1.0',
    lastUpdated: '2024-12-23',
    
    // التهيئة
    init: function() {
        console.log('Business Data Module initialized - Version:', this.version);
        // تنظيف التخزين المؤقت كل 10 دقائق
        setInterval(() => CacheManager.cleanup(), 600000);
        return this;
    }
};

// تهيئة تلقائية
if (typeof window !== 'undefined') {
    window.BusinessDataModule.init();
}

// تصدير للتوافق مع الكود القديم
window.businessDataModule = window.BusinessDataModule;
window.backupBusinessesData = backupBusinessesData;

// تصدير للاستخدام في البيئات المختلفة
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.BusinessDataModule;
}

console.log('Business Data Module loaded successfully - Version:', window.BusinessDataModule.version);