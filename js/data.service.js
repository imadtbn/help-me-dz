class DataService {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 30 * 60 * 1000; // 30 دقيقة
    }
    
    // جلب البيانات من مصادر متعددة
    async fetchBusinesses(city, category) {
        const cacheKey = `${city}-${category}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        const promises = [
            this.fetchFromOSM(city, category),
            this.fetchFromCommunity(city, category),
            this.fetchFromLocalStorage()
        ];
        
        try {
            const results = await Promise.allSettled(promises);
            const combinedData = this.mergeDataSources(results);
            
            this.saveToCache(cacheKey, combinedData);
            return combinedData;
        } catch (error) {
            console.error('خطأ في جلب البيانات:', error);
            return this.getFallbackData(city, category);
        }
    }
    
    // المصدر 1: OpenStreetMap
    async fetchFromOSM(city, category) {
        const overpassQuery = `
            [out:json][timeout:25];
            area["name"="${city}"]["admin_level"=8]->.searchArea;
            (
                node["amenity"~"hospital|clinic|doctors|pharmacy|dentist|laboratory"](area.searchArea);
                way["amenity"~"hospital|clinic|doctors|pharmacy|dentist|laboratory"](area.searchArea);
            );
            out center;
        `;
        
        const response = await fetch(CONFIG.DATA_SOURCES.OSM.endpoint, {
            method: 'POST',
            body: `data=${encodeURIComponent(overpassQuery)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const data = await response.json();
        return this.normalizeOSMData(data.elements);
    }
    
    // المصدر 2: قاعدة بيانات المجتمع
    async fetchFromCommunity(city, category) {
        try {
            const response = await fetch(CONFIG.DATA_SOURCES.COMMUNITY);
            const data = await response.json();
            return data.filter(item => 
                (!city || item.city === city) && 
                (!category || item.category === category)
            );
        } catch (error) {
            return [];
        }
    }
    
    // المصدر 3: بيانات محلية من المستخدمين
    fetchFromLocalStorage() {
        const localData = localStorage.getItem('user_submitted_businesses');
        return localData ? JSON.parse(localData) : [];
    }
    
    // دمج البيانات من المصادر المختلفة
    mergeDataSources(results) {
        const merged = [];
        const seenIds = new Set();
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                result.value.forEach(item => {
                    const uid = `${item.lat}-${item.lng}-${item.name}`;
                    if (!seenIds.has(uid)) {
                        seenIds.add(uid);
                        merged.push(item);
                    }
                });
            }
        });
        
        return merged;
    }
    
    // بيانات احتياطية في حالة فشل المصادر
    getFallbackData(city, category) {
        // بيانات افتراضية للمستشفيات والعيادات الرئيسية
        return [
            {
                id: 'default-1',
                name: 'مستشفى مصطفى باشا',
                category: 'hospital',
                lat: 36.7538,
                lng: 3.0588,
                address: 'الجزائر العاصمة',
                phone: ['023 12 34 56']
            },
            // ... بيانات افتراضية أخرى
        ];
    }
    
    // نظام الكاش
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        return null;
    }
    
    saveToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}