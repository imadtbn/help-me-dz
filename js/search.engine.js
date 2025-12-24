/**
 * محرك بحث متقدم لموقع "ساعدني"
 * دعم البحث في قاعدة البيانات والخريطة معاً
 */

class SearchEngine {
    constructor() {
        this.filters = {
            category: null,
            city: null,
            radius: 5, // كيلومترات
            userLocation: null,
            mapBounds: null, // حدود الخريطة الحالية
            minRating: 0,
            isOpenNow: false
        };
        
        this.searchHistory = [];
        this.maxSearchHistory = 10;
        
        // تحميل البيانات عند التهيئة
        this.loadDatabase();
        this.setupSearchListeners();
    }
    
    // تحميل قاعدة البيانات
    async loadDatabase() {
        try {
            // محاولة تحميل من LocalStorage أولاً
            this.localBusinesses = JSON.parse(localStorage.getItem('businesses_database')) || [];
            
            // تحميل بيانات احتياطية إذا لم تكن موجودة
            if (this.localBusinesses.length === 0) {
                this.localBusinesses = await this.loadBackupData();
                this.saveToLocalStorage();
            }
            
            console.log(`تم تحميل ${this.localBusinesses.length} سجل من قاعدة البيانات`);
            
            // تحديث فهرس البحث
            this.buildSearchIndex();
            
        } catch (error) {
            console.error('خطأ في تحميل قاعدة البيانات:', error);
            this.localBusinesses = [];
        }
    }
    
    // تحميل بيانات احتياطية
    async loadBackupData() {
        const backupData = [
            {
                id: 1,
                name: "مستشفى مصطفى باشا الجامعي",
                category: "hospital",
                address: "الجزائر العاصمة، حي القصبة",
                city: "الجزائر العاصمة",
                lat: 36.7631,
                lng: 3.0506,
                phone: ["021 23 45 67", "021 23 45 68"],
                rating: 4.2,
                reviewCount: 124,
                featured: true,
                hours: "24/7",
                website: "http://www.hopital-mustapha.dz"
            },
            {
                id: 2,
                name: "صيدلية الأمل",
                category: "pharmacy",
                address: "حي النصر، شارع الجمهورية، الجزائر",
                city: "الجزائر العاصمة",
                lat: 36.7489,
                lng: 3.0588,
                phone: ["021 34 56 78"],
                rating: 4.5,
                reviewCount: 89,
                featured: true,
                hours: "08:00-22:00",
                description: "صيدلية ليلية متوفرة"
            },
            {
                id: 3,
                name: "عيادة الدكتور أحمد",
                category: "clinic",
                address: "باب الزوار، الجزائر",
                city: "الجزائر العاصمة",
                lat: 36.7395,
                lng: 3.0352,
                phone: ["021 45 67 89"],
                rating: 4.0,
                reviewCount: 56,
                hours: "09:00-17:00",
                specialties: ["طب عام", "جراحة بسيطة"]
            },
            {
                id: 4,
                name: "مختبر التحاليل الطبية",
                category: "laboratory",
                address: "الحراش، الجزائر",
                city: "الجزائر العاصمة",
                lat: 36.7214,
                lng: 3.1285,
                phone: ["021 56 78 90"],
                rating: 4.3,
                reviewCount: 72,
                hours: "07:00-19:00"
            },
            {
                id: 5,
                name: "مستشفى بني مسوس",
                category: "hospital",
                address: "بني مسوس، الجزائر",
                city: "الجزائر العاصمة",
                lat: 36.7298,
                lng: 3.0015,
                phone: ["021 67 89 01"],
                rating: 4.1,
                reviewCount: 203,
                hours: "24/7"
            },
            {
                id: 6,
                name: "صيدلية النجاح",
                category: "pharmacy",
                address: "القبة، الجزائر",
                city: "الجزائر العاصمة",
                lat: 36.7352,
                lng: 3.0927,
                phone: ["021 78 90 12"],
                rating: 4.4,
                reviewCount: 45,
                hours: "08:00-24:00"
            }
        ];
        
        // إضافة بيانات إضافية
        const cities = ["وهران", "قسنطينة", "عنابة", "باتنة", "سطيف"];
        const categories = ["hospital", "clinic", "pharmacy", "doctor", "laboratory"];
        
        for (let i = 7; i <= 50; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            backupData.push({
                id: i,
                name: `${this.getCategoryName(category)} رقم ${i}`,
                category: category,
                address: `شارع ${i}، ${city}`,
                city: city,
                lat: 36.7 + (Math.random() * 0.1),
                lng: 3.0 + (Math.random() * 0.2),
                phone: [`0${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`],
                rating: 3.5 + Math.random() * 1.5,
                reviewCount: Math.floor(Math.random() * 100),
                hours: "08:00-18:00"
            });
        }
        
        return backupData;
    }
    
    // بناء فهرس البحث للبحث السريع
    buildSearchIndex() {
        this.searchIndex = {
            name: {},
            city: {},
            category: {},
            address: {}
        };
        
        this.localBusinesses.forEach(business => {
            // فهرس الأسماء
            const nameWords = business.name.toLowerCase().split(' ');
            nameWords.forEach(word => {
                if (word.length > 2) {
                    if (!this.searchIndex.name[word]) {
                        this.searchIndex.name[word] = [];
                    }
                    this.searchIndex.name[word].push(business.id);
                }
            });
            
            // فهرس المدن
            if (business.city) {
                const cityKey = business.city.toLowerCase();
                if (!this.searchIndex.city[cityKey]) {
                    this.searchIndex.city[cityKey] = [];
                }
                this.searchIndex.city[cityKey].push(business.id);
            }
            
            // فهرس الفئات
            if (business.category) {
                if (!this.searchIndex.category[business.category]) {
                    this.searchIndex.category[business.category] = [];
                }
                this.searchIndex.category[business.category].push(business.id);
            }
            
            // فهرس العناوين
            if (business.address) {
                const addressWords = business.address.toLowerCase().split(' ');
                addressWords.forEach(word => {
                    if (word.length > 2) {
                        if (!this.searchIndex.address[word]) {
                            this.searchIndex.address[word] = [];
                        }
                        this.searchIndex.address[word].push(business.id);
                    }
                });
            }
        });
    }
    
    // بحث موحد في قاعدة البيانات والخريطة
    async unifiedSearch(query, filters = {}) {
        console.log(`بحث موحد: "${query}"`, filters);
        
        // تحديث الفلاتر
        this.filters = { ...this.filters, ...filters };
        
        // إضافة للتاريخ
        this.addToSearchHistory(query, filters);
        
        // البحث في قاعدة البيانات
        const dbResults = await this.searchInDatabase(query, filters);
        
        // البحث على الخريطة
        const mapResults = await this.searchOnMap(query, filters);
        
        // دمج النتائج وإزالة التكرارات
        const mergedResults = this.mergeResults(dbResults, mapResults);
        
        // إرسال إشعار بنتائج البحث
        this.emitSearchResults(mergedResults, query, filters);
        
        return mergedResults;
    }
    
    // البحث في قاعدة البيانات
    async searchInDatabase(query = '', filters = {}) {
        let results = [...this.localBusinesses];
        
        // التصفية حسب الفئة
        if (filters.category && filters.category !== 'all') {
            results = results.filter(b => b.category === filters.category);
        }
        
        // التصفية حسب المدينة
        if (filters.city) {
            results = results.filter(b => 
                b.city && b.city.includes(filters.city)
            );
        }
        
        // البحث النصي
        if (query && query.trim()) {
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
            
            if (searchTerms.length > 0) {
                // استخدام الفهرس للبحث السريع
                const matchedIds = new Set();
                
                searchTerms.forEach(term => {
                    // البحث في الفهرس
                    if (this.searchIndex.name[term]) {
                        this.searchIndex.name[term].forEach(id => matchedIds.add(id));
                    }
                    if (this.searchIndex.address[term]) {
                        this.searchIndex.address[term].forEach(id => matchedIds.add(id));
                    }
                });
                
                if (matchedIds.size > 0) {
                    results = results.filter(b => matchedIds.has(b.id));
                } else {
                    // بحث عادي إذا لم توجد نتائج في الفهرس
                    results = results.filter(business => {
                        const searchStr = `${business.name} ${business.address} ${business.city} ${business.category}`.toLowerCase();
                        return searchTerms.some(term => searchStr.includes(term));
                    });
                }
            }
        }
        
        // التصفية حسب المسافة
        if (filters.userLocation && filters.radius) {
            results = results.filter(b => {
                if (!b.lat || !b.lng) return false;
                
                const distance = this.calculateDistance(
                    filters.userLocation.lat,
                    filters.userLocation.lng,
                    b.lat,
                    b.lng
                );
                
                b.distance = distance;
                return distance <= filters.radius;
            });
        }
        
        // التصفية حسب الحد الأدنى للتقييم
        if (filters.minRating) {
            results = results.filter(b => b.rating >= filters.minRating);
        }
        
        // التصفية حسب ساعات العمل
        if (filters.isOpenNow) {
            results = results.filter(b => this.isOpenNow(b.hours));
        }
        
        // الترتيب
        results = this.sortResults(results, filters.sortBy || 'relevance');
        
        return results;
    }
    
    // البحث على الخريطة
    async searchOnMap(query = '', filters = {}) {
        const results = [];
        
        // التحقق من توفر الخريطة
        if (!window.map) {
            console.warn('الخريطة غير متوفرة للبحث');
            return results;
        }
        
        // الحصول على حدود الخريطة الحالية
        const bounds = window.map.getBounds();
        this.filters.mapBounds = bounds;
        
        // البحث في قاعدة البيانات ضمن حدود الخريطة
        let mapResults = this.localBusinesses.filter(business => {
            if (!business.lat || !business.lng) return false;
            
            // التحقق من أن المؤسسة ضمن حدود الخريطة
            const isInBounds = bounds.contains([business.lat, business.lng]);
            if (!isInBounds) return false;
            
            // تطبيق الفلاتر الأخرى
            if (filters.category && filters.category !== 'all') {
                if (business.category !== filters.category) return false;
            }
            
            if (query && query.trim()) {
                const searchTerms = query.toLowerCase().split(' ');
                const searchStr = `${business.name} ${business.address}`.toLowerCase();
                return searchTerms.some(term => searchStr.includes(term));
            }
            
            return true;
        });
        
        // إذا لم تكن هناك نتائج، توسيع البحث باستخدام Nominatim API
        if (mapResults.length === 0 && query && query.trim()) {
            try {
                const nominatimResults = await this.searchNominatim(query, bounds);
                mapResults = mapResults.concat(nominatimResults);
            } catch (error) {
                console.error('خطأ في البحث على Nominatim:', error);
            }
        }
        
        // إذا لم يكن هناك موقع محدد، استخدام حدود الخريطة فقط
        if (!query || query.trim() === '') {
            mapResults = this.localBusinesses.filter(business => {
                if (!business.lat || !business.lng) return false;
                return bounds.contains([business.lat, business.lng]);
            });
        }
        
        // إضافة علامات على الخريطة
        this.displayResultsOnMap(mapResults);
        
        return mapResults;
    }
    
    // البحث باستخدام Nominatim API
    async searchNominatim(query, bounds) {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}+الجزائر&format=json&limit=10&accept-language=ar`;
        
        try {
            const response = await fetch(nominatimUrl);
            const data = await response.json();
            
            return data.map((item, index) => ({
                id: `nominatim-${index}`,
                name: item.display_name.split(',').slice(0, 2).join(','),
                category: 'place',
                address: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                external: true,
                source: 'nominatim'
            }));
        } catch (error) {
            console.error('خطأ في البحث على Nominatim:', error);
            return [];
        }
    }
    
    // عرض النتائج على الخريطة
    displayResultsOnMap(results) {
        // إزالة العلامات القديمة
        if (window.mapMarkers) {
            window.mapMarkers.forEach(marker => window.map.removeLayer(marker));
            window.mapMarkers = [];
        } else {
            window.mapMarkers = [];
        }
        
        // إضافة علامات جديدة
        results.forEach(business => {
            if (business.lat && business.lng) {
                const icon = L.divIcon({
                    html: `<div class="map-marker ${business.category}">
                              <i class="${this.getCategoryIcon(business.category)}"></i>
                           </div>`,
                    className: 'business-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });
                
                const marker = L.marker([business.lat, business.lng], { icon })
                    .addTo(window.map)
                    .bindPopup(this.createPopupContent(business));
                
                window.mapMarkers.push(marker);
            }
        });
        
        // تكبير الخريطة لتناسب جميع النتائج
        if (results.length > 0 && window.mapMarkers.length > 0) {
            const group = new L.featureGroup(window.mapMarkers);
            window.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
    
    // دمج نتائج البحث
    mergeResults(dbResults, mapResults) {
        const mergedMap = new Map();
        
        // إضافة نتائج قاعدة البيانات
        dbResults.forEach(item => {
            mergedMap.set(item.id, { ...item, source: 'database' });
        });
        
        // إضافة نتائج الخريطة (تجنب التكرار)
        mapResults.forEach(item => {
            if (!mergedMap.has(item.id)) {
                mergedMap.set(item.id, { ...item, source: 'map' });
            }
        });
        
        // تحويل إلى مصفوفة
        return Array.from(mergedMap.values());
    }
    
    // ترتيب النتائج
    sortResults(results, sortBy = 'relevance') {
        switch (sortBy) {
            case 'distance':
                return results.sort((a, b) => {
                    const distA = a.distance || Infinity;
                    const distB = b.distance || Infinity;
                    return distA - distB;
                });
                
            case 'rating':
                return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                
            case 'name':
                return results.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                
            case 'reviewCount':
                return results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                
            case 'relevance':
            default:
                // ترجيح حسب التقييم والمسافة
                return results.sort((a, b) => {
                    const scoreA = this.calculateRelevanceScore(a);
                    const scoreB = this.calculateRelevanceScore(b);
                    return scoreB - scoreA;
                });
        }
    }
    
    // حساب درجة الصلة
    calculateRelevanceScore(business) {
        let score = 0;
        
        // التقييم (40%)
        score += (business.rating || 0) * 8;
        
        // عدد التقييمات (30%)
        score += Math.min((business.reviewCount || 0) * 0.3, 30);
        
        // المسافة (20%) - إذا كانت متاحة
        if (business.distance) {
            score += Math.max(0, 20 - (business.distance * 2));
        }
        
        // المؤسسات المميزة (10%)
        if (business.featured) score += 10;
        
        return score;
    }
    
    // التحقق إذا كان المكان مفتوحاً الآن
    isOpenNow(hoursString) {
        if (!hoursString) return true;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (hoursString === '24/7') return true;
        
        // توقع تنسيق مثل "08:00-22:00"
        const match = hoursString.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
        if (match) {
            const [_, startHour, startMinute, endHour, endMinute] = match;
            
            const startTime = parseInt(startHour) + (parseInt(startMinute) / 60);
            const endTime = parseInt(endHour) + (parseInt(endMinute) / 60);
            const currentTime = currentHour + (currentMinute / 60);
            
            if (endTime < startTime) {
                // يتجاوز منتصف الليل
                return currentTime >= startTime || currentTime <= endTime;
            } else {
                return currentTime >= startTime && currentTime <= endTime;
            }
        }
        
        return true;
    }
    
    // إضافة للتاريخ
    addToSearchHistory(query, filters) {
        const searchEntry = {
            query,
            filters,
            timestamp: new Date().toISOString(),
            resultsCount: 0 // سيتم تحديثه لاحقاً
        };
        
        this.searchHistory.unshift(searchEntry);
        
        // الحد الأقصى للتاريخ
        if (this.searchHistory.length > this.maxSearchHistory) {
            this.searchHistory.pop();
        }
        
        // حفظ في LocalStorage
        localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
    }
    
    // إرسال نتائج البحث
    emitSearchResults(results, query, filters) {
        const event = new CustomEvent('searchResults', {
            detail: {
                results,
                query,
                filters,
                timestamp: new Date().toISOString()
            }
        });
        
        document.dispatchEvent(event);
        
        // تحديث عداد النتائج
        const resultsCountElement = document.getElementById('results-count');
        if (resultsCountElement) {
            resultsCountElement.textContent = results.length;
        }
        
        // تحديث تاريخ البحث
        if (this.searchHistory.length > 0) {
            this.searchHistory[0].resultsCount = results.length;
        }
    }
    
    // إنشاء محتوى النافذة المنبثقة
    createPopupContent(business) {
        const ratingStars = this.generateRatingStars(business.rating);
        const categoryName = this.getCategoryName(business.category);
        
        return `
            <div class="business-popup">
                <div class="popup-header">
                    <h4>${business.name}</h4>
                    <span class="category-badge">${categoryName}</span>
                </div>
                <div class="popup-body">
                    <p><i class="fas fa-map-marker-alt"></i> ${business.address || 'لا يوجد عنوان'}</p>
                    ${business.phone ? `<p><i class="fas fa-phone"></i> ${business.phone[0]}</p>` : ''}
                    ${business.rating ? `<div class="rating">${ratingStars} <span>${business.rating.toFixed(1)}</span></div>` : ''}
                </div>
                <div class="popup-actions">
                    <button onclick="window.searchEngine.showDetails(${business.id})">
                        <i class="fas fa-info-circle"></i> التفاصيل
                    </button>
                    <button onclick="window.searchEngine.getDirections(${business.lat}, ${business.lng})">
                        <i class="fas fa-directions"></i> اتجاهات
                    </button>
                </div>
            </div>
        `;
    }
    
    // توليد نجوم التقييم
    generateRatingStars(rating) {
        if (!rating) return '';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        
        return stars;
    }
    
    // الحصول على اسم الفئة
    getCategoryName(category) {
        const categories = {
            'hospital': 'مستشفى',
            'clinic': 'عيادة',
            'pharmacy': 'صيدلية',
            'doctor': 'طبيب',
            'dentist': 'طبيب أسنان',
            'laboratory': 'مختبر',
            'association': 'جمعية',
            'company': 'شركة',
            'place': 'مكان'
        };
        
        return categories[category] || 'مؤسسة';
    }
    
    // الحصول على أيقونة الفئة
    getCategoryIcon(category) {
        const icons = {
            'hospital': 'fas fa-hospital',
            'clinic': 'fas fa-clinic-medical',
            'pharmacy': 'fas fa-prescription-bottle-alt',
            'doctor': 'fas fa-user-md',
            'dentist': 'fas fa-tooth',
            'laboratory': 'fas fa-flask',
            'association': 'fas fa-hands-helping',
            'company': 'fas fa-building',
            'place': 'fas fa-map-marker-alt'
        };
        
        return icons[category] || 'fas fa-map-marker-alt';
    }
    
    // حفظ في التخزين المحلي
    saveToLocalStorage() {
        try {
            localStorage.setItem('businesses_database', JSON.stringify(this.localBusinesses));
            console.log('تم حفظ قاعدة البيانات في التخزين المحلي');
        } catch (error) {
            console.error('خطأ في حفظ قاعدة البيانات:', error);
        }
    }
    
    // إعداد مستمعي البحث
    setupSearchListeners() {
        // البحث عند تغيير الخريطة
        if (window.map) {
            window.map.on('moveend', () => {
                if (this.autoSearchOnMapMove) {
                    this.unifiedSearch(this.lastQuery || '', { mapBounds: window.map.getBounds() });
                }
            });
        }
        
        // الاستماع لأحداث البحث من الواجهة
        document.addEventListener('searchRequested', (event) => {
            const { query, filters } = event.detail;
            this.unifiedSearch(query, filters);
        });
    }
    
    // إضافة مؤسسة جديدة
    addBusiness(business) {
        const newId = Math.max(...this.localBusinesses.map(b => b.id), 0) + 1;
        const newBusiness = {
            id: newId,
            ...business,
            createdAt: new Date().toISOString(),
            verified: false,
            source: 'user_submitted'
        };
        
        this.localBusinesses.push(newBusiness);
        this.saveToLocalStorage();
        this.buildSearchIndex();
        
        // إرسال إشعار
        document.dispatchEvent(new CustomEvent('businessAdded', {
            detail: { business: newBusiness }
        }));
        
        return newBusiness;
    }
    
    // حساب المسافة (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    toRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    // إكمال تلقائي
    autocomplete(query, type = 'all') {
        if (!query || query.length < 2) return [];
        
        const results = [];
        const queryLower = query.toLowerCase();
        
        if (type === 'all' || type === 'business') {
            // إكمال أسماء المؤسسات
            this.localBusinesses.forEach(business => {
                if (business.name.toLowerCase().includes(queryLower)) {
                    results.push({
                        type: 'business',
                        value: business.name,
                        category: business.category,
                        id: business.id,
                        display: `${business.name} - ${this.getCategoryName(business.category)}`
                    });
                }
            });
        }
        
        if (type === 'all' || type === 'city') {
            // إكمال المدن
            const cities = [...new Set(this.localBusinesses.map(b => b.city).filter(Boolean))];
            cities.forEach(city => {
                if (city.toLowerCase().includes(queryLower)) {
                    results.push({
                        type: 'city',
                        value: city,
                        display: city
                    });
                }
            });
        }
        
        return results.slice(0, 10); // الحد الأقصى 10 نتائج
    }
    
    // عرض التفاصيل
    showDetails(businessId) {
        const business = this.localBusinesses.find(b => b.id === businessId);
        if (!business) return;
        
        // إرسال حدث لعرض التفاصيل
        document.dispatchEvent(new CustomEvent('showBusinessDetails', {
            detail: { business }
        }));
    }
    
    // الحصول على الاتجاهات
    getDirections(lat, lng) {
        if (!lat || !lng) return;
        
        // استخدام خرائط Google للاتجاهات
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(googleMapsUrl, '_blank');
    }
}

// تصدير محرك البحث للاستخدام العالمي
if (typeof window !== 'undefined') {
    window.SearchEngine = SearchEngine;
    
    // تهيئة محرك البحث عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.searchEngine) {
            window.searchEngine = new SearchEngine();
            console.log('✅ محرك البحث جاهز');
        }
    });
}

// دعم ES6 Modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchEngine;
}