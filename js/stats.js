/**
 * ملف stats.js - إدارة وعرض الإحصائيات الديناميكية
 */

class StatisticsManager {
    constructor() {
        this.counters = {
            hospital: 0,
            clinic: 0,
            pharmacy: 0,
            doctor: 0,
            total: 0,
            featured: 0,
            cities: 0,
            reviews: 0
        };
        
        this.elements = {
            hospitalCount: document.getElementById('hospital-count'),
            clinicCount: document.getElementById('clinic-count'),
            pharmacyCount: document.getElementById('pharmacy-count'),
            doctorCount: document.getElementById('doctor-count'),
            statsToggleBtn: document.getElementById('stats-toggle-btn'),
            additionalStats: document.getElementById('additional-stats')
        };
        
        this.init();
    }
    
    init() {
        this.calculateStatistics();
        this.setupEventListeners();
    }
    
    /**
     * حساب الإحصائيات من البيانات
     */
    calculateStatistics() {
        const businesses = window.backupBusinessesData || [];
        
        // إعادة تعيين العدادات
        this.counters = {
            hospital: 0,
            clinic: 0,
            pharmacy: 0,
            doctor: 0,
            total: businesses.length,
            featured: 0,
            cities: new Set(),
            reviews: 0,
            averageRating: 0
        };
        
        // حساب الإحصائيات
        businesses.forEach(business => {
            switch(business.category) {
                case 'hospital':
                    this.counters.hospital++;
                    break;
                case 'clinic':
                    this.counters.clinic++;
                    break;
                case 'pharmacy':
                    this.counters.pharmacy++;
                    break;
                case 'doctor':
                    this.counters.doctor++;
                    break;
            }
            
            if (business.featured) this.counters.featured++;
            if (business.address) this.extractCity(business.address);
            if (business.reviewCount) this.counters.reviews += business.reviewCount;
            if (business.rating) this.counters.averageRating += business.rating;
        });
        
        this.counters.cities = this.counters.cities.size;
        this.counters.averageRating = businesses.length > 0 
            ? (this.counters.averageRating / businesses.length).toFixed(1) 
            : 0;
            
        this.updateDisplay();
    }
    
    /**
     * استخراج المدينة من العنوان
     */
    extractCity(address) {
        const algerianCities = [
            'الجزائر', 'وهران', 'قسنطينة', 'عنابة', 'باتنة', 'بليدة',
            'سطيف', 'تيارت', 'البويرة', 'بجاية', 'سيدي بلعباس', 'البيض',
            'تيزي وزو', 'غرداية', 'ورقلة', 'تمنراست'
        ];
        
        for (const city of algerianCities) {
            if (address.includes(city)) {
                this.counters.cities.add(city);
                break;
            }
        }
    }
    
    /**
     * تحديث العرض مع تأثيرات العد
     */
    updateDisplay() {
        this.animateCounter(this.elements.hospitalCount, this.counters.hospital);
        this.animateCounter(this.elements.clinicCount, this.counters.clinic);
        this.animateCounter(this.elements.pharmacyCount, this.counters.pharmacy);
        this.animateCounter(this.elements.doctorCount, this.counters.doctor);
        
        // تحديث الإحصائيات الإضافية إذا كانت موجودة
        this.updateAdditionalStats();
    }
    
    /**
     * تأثير العد المتحرك للأرقام
     */
    animateCounter(element, targetValue) {
        if (!element) return;
        
        const duration = 2000; // 2 ثانية
        const frameDuration = 1000 / 60; // 60 إطار في الثانية
        const totalFrames = Math.round(duration / frameDuration);
        const easeOutQuad = t => t * (2 - t);
        
        let frame = 0;
        const countTo = targetValue;
        const elementText = element.textContent;
        const currentValue = parseInt(elementText.replace(/,/g, '')) || 0;
        
        const counter = setInterval(() => {
            frame++;
            
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(countTo * progress);
            
            // التأكد من أن العد لا يتجاوز القيمة المستهدفة
            const displayValue = Math.min(currentCount, countTo);
            
            element.textContent = this.formatNumber(displayValue);
            
            // إضافة تأثير أثناء العد
            if (frame < totalFrames) {
                element.style.transform = `scale(${1 + progress * 0.1})`;
                element.style.color = this.getColorForValue(displayValue, countTo);
            } else {
                element.style.transform = 'scale(1)';
                element.style.color = '';
                clearInterval(counter);
                
                // إضافة تأثير نهائي
                this.addCompletionEffect(element);
            }
        }, frameDuration);
    }
    
    /**
     * تنسيق الأرقام (إضافة فواصل)
     */
    formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    /**
     * الحصول على لون بناءً على القيمة
     */
    getColorForValue(current, total) {
        const percentage = (current / total) * 100;
        
        if (percentage < 30) return '#ef476f'; // أحمر
        if (percentage < 60) return '#ffd166'; // أصفر
        if (percentage < 90) return '#06d6a0'; // أخضر
        return '#118ab2'; // أزرق
    }
    
    /**
     * إضافة تأثير عند اكتمال العد
     */
    addCompletionEffect(element) {
        element.classList.add('completed');
        
        // إضافة تأثير النبض
        setTimeout(() => {
            element.classList.remove('completed');
        }, 1000);
    }
    
    /**
     * تحديث الإحصائيات الإضافية
     */
    updateAdditionalStats() {
        const additionalStats = document.querySelectorAll('.additional-stat');
        
        if (additionalStats.length > 0) {
            // المؤسسات المميزة
            if (additionalStats[0]) {
                additionalStats[0].querySelector('.stat-value').textContent = 
                    this.formatNumber(this.counters.featured);
            }
            
            // المدن
            if (additionalStats[1]) {
                additionalStats[1].querySelector('.stat-value').textContent = 
                    this.formatNumber(this.counters.cities);
            }
            
            // التقييمات
            if (additionalStats[2]) {
                additionalStats[2].querySelector('.stat-value').textContent = 
                    this.formatNumber(this.counters.reviews);
            }
            
            // متوسط التقييم
            if (additionalStats[3]) {
                additionalStats[3].querySelector('.stat-value').textContent = 
                    this.counters.averageRating;
            }
        }
    }
    
    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        if (this.elements.statsToggleBtn) {
            this.elements.statsToggleBtn.addEventListener('click', () => {
                this.toggleAdditionalStats();
            });
        }
        
        // تحديث الإحصائيات عند إضافة مؤسسة جديدة
        document.addEventListener('businessAdded', () => {
            setTimeout(() => {
                this.calculateStatistics();
            }, 500);
        });
        
        // تحديث الإحصائيات عند البحث
        document.addEventListener('searchCompleted', (event) => {
            if (event.detail && event.detail.results) {
                this.updateStatsFromSearch(event.detail.results);
            }
        });
    }
    
    /**
     * تبديل عرض الإحصائيات الإضافية
     */
    toggleAdditionalStats() {
        if (this.elements.additionalStats) {
            this.elements.additionalStats.classList.toggle('show');
            this.elements.statsToggleBtn.classList.toggle('active');
            
            const icon = this.elements.statsToggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
            
            // تغيير نص الزر
            const isExpanded = this.elements.additionalStats.classList.contains('show');
            this.elements.statsToggleBtn.innerHTML = isExpanded
                ? '<i class="fas fa-chevron-up"></i> إخفاء التفاصيل'
                : '<i class="fas fa-chevron-down"></i> عرض التفاصيل';
        }
    }
    
    /**
     * تحديث الإحصائيات بناءً على نتائج البحث
     */
    updateStatsFromSearch(results) {
        const searchStats = {
            hospital: 0,
            clinic: 0,
            pharmacy: 0,
            doctor: 0
        };
        
        results.forEach(business => {
            if (searchStats.hasOwnProperty(business.category)) {
                searchStats[business.category]++;
            }
        });
        
        // تحديث العدادات مع تأثير خاص
        this.updateSearchStats(searchStats);
    }
    
    /**
     * تحديث إحصائيات البحث
     */
    updateSearchStats(stats) {
        // تخزين القيم الأصلية
        const originalValues = {
            hospital: this.counters.hospital,
            clinic: this.counters.clinic,
            pharmacy: this.counters.pharmacy,
            doctor: this.counters.doctor
        };
        
        // تحديث العرض مع تأثير الانتقال
        this.animateTransition(originalValues, stats);
    }
    
    /**
     * تأثير الانتقال بين القيم
     */
    animateTransition(original, target) {
        const elements = {
            hospital: this.elements.hospitalCount,
            clinic: this.elements.clinicCount,
            pharmacy: this.elements.pharmacyCount,
            doctor: this.elements.doctorCount
        };
        
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].classList.add('updating');
                setTimeout(() => {
                    this.animateCounter(elements[key], target[key] || 0);
                    elements[key].classList.remove('updating');
                }, 300);
            }
        });
    }
    
    /**
     * الحصول على إحصائيات ككائن
     */
    getStatistics() {
        return {
            ...this.counters,
            lastUpdated: new Date().toISOString()
        };
    }
    
    /**
     * تصدير الإحصائيات كـ JSON
     */
    exportStatistics() {
        return JSON.stringify(this.getStatistics(), null, 2);
    }
}

// تهيئة مدير الإحصائيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.statsManager = new StatisticsManager();
    
    // تحديث الإحصائيات كل 30 ثانية (للتحديثات الديناميكية)
    setInterval(() => {
        if (window.statsManager) {
            window.statsManager.calculateStatistics();
        }
    }, 30000);
});



// وظائف إضافية للإحصائيات

// تحديث وقت آخر تحديث
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const updateElement = document.getElementById('last-update');
    if (updateElement) {
        updateElement.textContent = `آخر تحديث: ${timeString}`;
        updateElement.title = `التاريخ: ${dateString}`;
    }
}

// تصدير الإحصائيات
function setupExportButton() {
    const exportBtn = document.getElementById('export-stats');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.statsManager) {
                const stats = window.statsManager.exportStatistics();
                const blob = new Blob([stats], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `statistics-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // إشعار للمستخدم
                showNotification('تم تصدير الإحصائيات بنجاح', 'success');
            }
        });
    }
}

// تحديث المخططات الدائرية
function updateProgressCircles() {
    const circles = document.querySelectorAll('.progress-ring-circle');
    circles.forEach((circle, index) => {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // قيمة عشوائية للتجربة (يمكن استبدالها بقيم حقيقية)
        const progress = [85, 70, 90, 60][index] || 75;
        const offset = circumference - (progress / 100) * circumference;
        
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
            circle.style.strokeDashoffset = offset;
        }, index * 300);
    });
}

// تهيئة جميع الوظائف
document.addEventListener('DOMContentLoaded', function() {
    // تحديث وقت التحديث كل ثانية
    updateLastUpdateTime();
    setInterval(updateLastUpdateTime, 1000);
    
    // إعداد زر التصدير
    setupExportButton();
    
    // تحديث المخططات الدائرية
    setTimeout(updateProgressCircles, 1000);
    
    // تحديث المخططات كل 5 دقائق
    setInterval(updateProgressCircles, 300000);
});