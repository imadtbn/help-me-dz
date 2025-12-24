class SaaedniApp {
    constructor() {
        this.dataService = new DataService();
        this.searchEngine = new SearchEngine();
        this.mapManager = new MapManager();
        this.currentResults = [];
        this.currentPage = 1;
        this.resultsPerPage = 10;
    }
    
    async init() {
        try {
            // تهيئة الخريطة
            this.mapManager.init('map');
            
            // تحميل بيانات المدن
            this.loadCitiesList();
            
            // إعداد الأحداث
            this.setupEventListeners();
            
            // تحميل البيانات الافتراضية (الجزائر العاصمة)
            await this.performSearch('', 'الجزائر العاصمة', '');
            
            console.log('✅ التطبيق جاهز للعمل');
        } catch (error) {
            console.error('❌ خطأ في تهيئة التطبيق:', error);
            this.showError('تعذر تحميل التطبيق. يرجى تحديث الصفحة.');
        }
    }
    
    // البحث الرئيسي
    async performSearch(query = '', city = '', category = '') {
        this.showLoading();
        
        try {
            // 1. جلب البيانات من المصادر
            const businesses = await this.dataService.fetchBusinesses(city, category);
            
            // 2. تطبيق البحث
            const results = this.searchEngine.search(businesses, query, {
                city,
                category,
                userLocation: this.mapManager.userLocation
            });
            
            // 3. عرض النتائج
            this.displayResults(results);
            
            // 4. تحديث الخريطة
            this.mapManager.addBusinessMarkers(results);
            
            // 5. تحديث العداد
            this.updateResultsCount(results.length);
            
            this.currentResults = results;
            
        } catch (error) {
            console.error('خطأ في البحث:', error);
            this.showError('تعذر البحث. تحقق من اتصال الإنترنت.');
        } finally {
            this.hideLoading();
        }
    }
    
    // البحث بالقرب من موقع المستخدم
    async searchNearby(lat, lng) {
        this.searchEngine.filters.userLocation = { lat, lng };
        this.searchEngine.filters.radius = document.getElementById('radius-select')?.value || 5;
        
        await this.performSearch(
            document.getElementById('main-search')?.value || '',
            '',
            document.getElementById('category-select')?.value || ''
        );
    }
    
    // عرض النتائج في القائمة
    displayResults(results) {
        const container = document.getElementById('business-results');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>لا توجد نتائج</h3>
                    <p>حاول تغيير كلمات البحث أو توسيع نطاق البحث</p>
                </div>
            `;
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const pageResults = results.slice(startIndex, endIndex);
        
        container.innerHTML = pageResults.map(business => `
            <div class="business-card" data-id="${business.id}">
                <div class="business-icon">
                    <i class="${this.mapManager.getCategoryIcon(business.category)}"></i>
                </div>
                <div class="business-info">
                    <h3>${business.name}</h3>
                    <p class="business-category">${this.getCategoryName(business.category)}</p>
                    <p class="business-address">
                        <i class="fas fa-map-marker-alt"></i> ${business.address || 'عنوان غير متوفر'}
                    </p>
                    ${business.phone && business.phone.length > 0 ? `
                        <p class="business-phone">
                            <i class="fas fa-phone"></i> ${business.phone[0]}
                        </p>
                    ` : ''}
                    ${business.distance ? `
                        <p class="business-distance">
                            <i class="fas fa-location-arrow"></i> ${business.distance.toFixed(1)} كم
                        </p>
                    ` : ''}
                </div>
                <div class="business-actions">
                    <button class="btn-details" onclick="app.showBusinessDetails('${business.id}')">
                        <i class="fas fa-info-circle"></i> تفاصيل
                    </button>
                </div>
            </div>
        `).join('');
        
        // إظهار زر "تحميل المزيد" إذا كانت هناك نتائج إضافية
        this.toggleLoadMoreButton(results.length > endIndex);
    }
    
    // إعداد الأحداث
    setupEventListeners() {
        // بحث عند تقديم النموذج
        document.getElementById('search-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });
        
        // البحث التلقائي
        const searchInput = document.getElementById('main-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.handleSearch();
            }, 500));
        }
        
        // تغيير الفئة
        document.getElementById('category-select')?.addEventListener('change', () => {
            this.handleSearch();
        });
        
        // تغيير المدينة
        document.getElementById('location-search')?.addEventListener('change', () => {
            this.handleSearch();
        });
        
        // تحديد موقعي
        document.getElementById('locate-me')?.addEventListener('click', () => {
            this.mapManager.locateUser();
        });
        
        // تحميل المزيد
        document.getElementById('load-more-btn')?.addEventListener('click', () => {
            this.loadMoreResults();
        });
    }
    
    handleSearch() {
        const query = document.getElementById('main-search')?.value || '';
        const city = document.getElementById('location-search')?.value || '';
        const category = document.getElementById('category-select')?.value || '';
        
        this.currentPage = 1;
        this.performSearch(query, city, category);
    }
    
    loadMoreResults() {
        this.currentPage++;
        this.displayResults(this.currentResults);
    }
    
    // وظائف مساعدة
    getCategoryName(category) {
        const names = {
            hospital: 'مستشفى',
            clinic: 'عيادة',
            pharmacy: 'صيدلية',
            doctor: 'طبيب',
            dentist: 'طبيب أسنان',
            laboratory: 'مختبر'
        };
        return names[category] || 'مؤسسة';
    }
    
    loadCitiesList() {
        const datalist = document.getElementById('algerian-cities');
        if (datalist) {
            datalist.innerHTML = CONFIG.ALGERIAN_CITIES
                .map(city => `<option value="${city.name}">${city.name}</option>`)
                .join('');
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // إظهار/إخفاء التحميل
    showLoading() {
        document.getElementById('loading-overlay')?.style.display = 'flex';
    }
    
    hideLoading() {
        document.getElementById('loading-overlay')?.style.display = 'none';
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    updateResultsCount(count) {
        const counter = document.getElementById('results-count');
        if (counter) {
            counter.textContent = count;
        }
    }
    
    toggleLoadMoreButton(show) {
        const container = document.getElementById('load-more-container');
        if (container) {
            container.style.display = show ? 'block' : 'none';
        }
    }
}

// تهيئة التطبيق
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SaaedniApp();
    app.init();
});