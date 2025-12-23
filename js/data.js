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
    GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY', // استبدلها بمفتاح API الخاص بك
    NOMINATIM_URL: 'https://nominatim.openstreetmap.org/search',
    OVERPASS_API_URL: 'https://overpass-api.de/api/interpreter',
    DEFAULT_LOCATION: '33.9716,-6.8498', // الرباط
    DEFAULT_RADIUS: 5000,
    DEFAULT_LIMIT: 10
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
        if (!timeStr) return '';
        const hour = parseInt(timeStr.substring(0, 2));
        const minute = timeStr.substring(2, 4);
        return `${hour}:${minute}`;
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
            const queryLower = query.toLowerCase();
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
    }
};

// ===========================================
// دوال Google Places API
// ===========================================
const GooglePlacesAPI = {
    // البحث في Google Places API
    searchPlaces: async (query, location, radius = 5000, type = '') => {
        try {
            if (API_CONFIG.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY') {
                return [];
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
            
            const response = await fetch(`${url}?${params}`);
            const data = await response.json();
            
            if (data.status === 'OK') {
                const places = data.results;
                const detailedPlaces = await Promise.all(
                    places.slice(0, API_CONFIG.DEFAULT_LIMIT).map(async (place) => {
                        return await GooglePlacesAPI.getPlaceDetails(place.place_id);
                    })
                );
                
                return detailedPlaces.filter(place => place !== null);
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching from Google Places:', error);
            return [];
        }
    },

    // الحصول على تفاصيل مكان معين
    getPlaceDetails: async (placeId) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json`;
            const params = new URLSearchParams({
                place_id: placeId,
                fields: 'name,formatted_address,geometry,formatted_phone_number,opening_hours,rating,user_ratings_total,website,types',
                key: API_CONFIG.GOOGLE_API_KEY,
                language: 'ar'
            });
            
            const response = await fetch(`${url}?${params}`);
            const data = await response.json();
            
            if (data.status === 'OK') {
                return GooglePlacesAPI.mapGooglePlaceToBusiness(data.result);
            }
            return null;
        } catch (error) {
            console.error('Error fetching place details:', error);
            return null;
        }
    },

    // تحويل بيانات Google Place إلى تنسيق بياناتنا
    mapGooglePlaceToBusiness: (place) => {
        const category = GooglePlacesAPI.determineCategory(place.types);
        
        return {
            id: place.place_id,
            name: place.name,
            category: category,
            description: '',
            address: place.formatted_address || '',
            phone: place.formatted_phone_number ? [place.formatted_phone_number] : [],
            email: '',
            website: place.website || '',
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            hours: GooglePlacesAPI.formatGoogleHours(place.opening_hours),
            rating: place.rating || 0,
            reviewCount: place.user_ratings_total || 0,
            featured: false,
            services: [],
            types: place.types || [],
            source: 'google'
        };
    },

    // تحديد الفئة بناءً على أنواع Google
    determineCategory: (types) => {
        if (!types) return 'company';
        
        if (types.includes('hospital')) return 'hospital';
        if (types.includes('pharmacy')) return 'pharmacy';
        if (types.includes('doctor')) return 'doctor';
        if (types.includes('health') || types.includes('clinic')) return 'clinic';
        if (types.includes('association') || types.includes('nonprofit')) return 'association';
        
        return 'company';
    },

    // تنسيق ساعات العمل من Google
    formatGoogleHours: (openingHours) => {
        if (!openingHours || !openingHours.periods) {
            return BackupData.getDefaultHours();
        }
        
        const formattedHours = {};
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        days.forEach((day, index) => {
            const dayPeriod = openingHours.periods.find(p => p.open.day === index);
            formattedHours[day] = dayPeriod ? {
                open: Helpers.formatTime(dayPeriod.open.time),
                close: Helpers.formatTime(dayPeriod.close.time)
            } : { open: '', close: '' };
        });
        
        return formattedHours;
    }
};

// ===========================================
// دوال Overpass API (مجاني)
// ===========================================
const OverpassAPI = {
    // البحث باستخدام Overpass API
    search: async (category, location, radius = 5000) => {
        try {
            const [lat, lon] = location.split(',').map(Number);
            const tags = OSM_TAGS[category] || '"amenity"';
            
            const query = `
                [out:json][timeout:25];
                (
                    node[${tags}](around:${radius},${lat},${lon});
                    way[${tags}](around:${radius},${lat},${lon});
                    relation[${tags}](around:${radius},${lat},${lon});
                );
                out center;
            `;
            
            const response = await fetch(API_CONFIG.OVERPASS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `data=${encodeURIComponent(query)}`
            });
            
            const data = await response.json();
            
            if (data.elements && data.elements.length > 0) {
                return data.elements.map(element => OverpassAPI.mapOSMElementToBusiness(element, category));
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching from Overpass API:', error);
            return [];
        }
    },

    // تحويل عنصر OSM إلى بيانات المؤسسة
    mapOSMElementToBusiness: (element, category) => {
        const tags = element.tags || {};
        const name = tags.name || tags['name:ar'] || 'مؤسسة بدون اسم';
        
        // تحديد الإحداثيات
        let lat, lng;
        if (element.center) {
            lat = element.center.lat;
            lng = element.center.lon;
        } else if (element.lat && element.lon) {
            lat = element.lat;
            lng = element.lon;
        } else {
            lat = 31.7917;
            lng = -7.0926;
        }
        
        const phone = tags.phone ? [tags.phone] : [`0522${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`];
        
        return {
            id: element.id,
            name: name,
            category: category,
            description: tags.description || '',
            address: tags['addr:full'] || tags.addr_housenumber ? 
                     `${tags.addr_street || ''} ${tags.addr_housenumber || ''}, ${tags.addr_city || ''}`.trim() : 
                     'عنوان غير محدد',
            phone: phone,
            email: tags.email || '',
            website: tags.website || '',
            lat: lat,
            lng: lng,
            hours: OverpassAPI.parseOSMOpeningHours(tags.opening_hours),
            rating: Math.random() * 2 + 3,
            reviewCount: Math.floor(Math.random() * 100),
            featured: Math.random() > 0.7,
            services: OverpassAPI.getServicesFromTags(tags),
            tags: tags,
            source: 'osm'
        };
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
            
            return BackupData.getDefaultHours();
        } catch (error) {
            return BackupData.getDefaultHours();
        }
    },

    // استخراج الخدمات من تاجات OSM
    getServicesFromTags: (tags) => {
        const services = [];
        
        if (tags.amenity) services.push(tags.amenity);
        if (tags.healthcare) services.push(tags.healthcare);
        if (tags.speciality) services.push(tags.speciality);
        
        return services.length > 0 ? services : ['خدمات عامة'];
    }
};

// ===========================================
// دوال Nominatim (للعناوين والإحداثيات)
// ===========================================
const NominatimAPI = {
    // البحث في Nominatim
    search: async (query) => {
        try {
            const response = await fetch(
                `${API_CONFIG.NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=ar`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching from Nominatim:', error);
            return [];
        }
    }
};

// ===========================================
// دوال البحث الرئيسية
// ===========================================
const SearchService = {
    // دالة البحث الرئيسية
    searchBusinesses: async (query = '', category = '', location = null, radius = 5000) => {
        try {
            if (!location) {
                location = API_CONFIG.DEFAULT_LOCATION;
            }
            
            let businesses = [];
            
            // محاولة استخدام Google Places أولاً
            if (API_CONFIG.GOOGLE_API_KEY && API_CONFIG.GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY') {
                console.log('Using Google Places API...');
                
                let googleQuery = query;
                if (!googleQuery && category) {
                    googleQuery = Helpers.getCategoryName(category);
                }
                
                if (googleQuery) {
                    const googleType = PLACE_CATEGORIES[category] || '';
                    businesses = await GooglePlacesAPI.searchPlaces(googleQuery, location, radius, googleType);
                }
            }
            
            // إذا لم تكن هناك نتائج من Google، استخدم Overpass API
            if (businesses.length === 0) {
                console.log('Using Overpass API...');
                
                if (category) {
                    businesses = await OverpassAPI.search(category, location, radius);
                }
                
                // تصفية حسب الاستعلام إذا كان موجودًا
                if (query && businesses.length > 0) {
                    const queryLower = query.toLowerCase();
                    businesses = businesses.filter(business => 
                        business.name.toLowerCase().includes(queryLower) ||
                        business.address.toLowerCase().includes(queryLower)
                    );
                }
            }
            
            // إذا لم تكن هناك نتائج، استخدم البيانات الوهمية
            if (businesses.length === 0) {
                console.log('Using backup data...');
                businesses = BackupData.filterBackupData(query, category);
            }
            
            // تخزين نتائج البحث الأخيرة
            window.lastSearchResults = businesses;
            
            return businesses;
        } catch (error) {
            console.error('Error in searchBusinesses:', error);
            return BackupData.filterBackupData(query, category);
        }
    },

    // دالة الحصول على البيانات المميزة
    getFeaturedBusinesses: async () => {
        try {
            const featured = await SearchService.searchBusinesses('', 'hospital', API_CONFIG.DEFAULT_LOCATION, 10000);
            
            if (featured.length >= 3) {
                return featured.slice(0, 3).map(business => ({
                    ...business,
                    featured: true
                }));
            }
            
            return backupBusinessesData
                .filter(business => business.featured)
                .slice(0, 3);
        } catch (error) {
            console.error('Error getting featured businesses:', error);
            return backupBusinessesData
                .filter(business => business.featured)
                .slice(0, 3);
        }
    },

    // دالة الحصول على تفاصيل مؤسسة
    getBusinessDetails: async (businessId, source = 'backup') => {
        try {
            if (source === 'google' && API_CONFIG.GOOGLE_API_KEY && API_CONFIG.GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY') {
                const details = await GooglePlacesAPI.getPlaceDetails(businessId);
                if (details) return details;
            }
            
            // البحث في البيانات الوهمية
            const business = backupBusinessesData.find(b => b.id === businessId);
            if (business) return business;
            
            // البحث في نتائج البحث السابقة
            if (window.lastSearchResults) {
                const found = window.lastSearchResults.find(b => b.id === businessId);
                if (found) return found;
            }
            
            return null;
        } catch (error) {
            console.error('Error getting business details:', error);
            return null;
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
    
    // خدمات API
    searchWithNominatim: NominatimAPI.search,
    
    // دوال المساعدة
    getCategoryIcon: Helpers.getCategoryIcon,
    getCategoryName: Helpers.getCategoryName,
    generateRatingStars: Helpers.generateRatingStars,
    formatBusinessHours: Helpers.formatBusinessHours,
    
    // إصدار الملف
    version: '1.0.0',
    lastUpdated: '2024-12-23'
};

// تصدير للتوافق مع الكود القديم
window.businessDataModule = window.BusinessDataModule;
window.backupBusinessesData = backupBusinessesData;

console.log('Business Data Module loaded successfully - Version:', window.BusinessDataModule.version);