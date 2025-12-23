// تهيئة الخريطة
let map;
let markers = [];
let userLocationMarker = null;
let userLocation = null;

function initMap() {
    // إحداثيات الجزائر
    const moroccoCenter = [36.7063956, 3.211357];
    
    // إنشاء الخريطة
    map = L.map('map').setView(moroccoCenter, 6);
    
    // إضافة طبقة الخريطة من OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);
    
    // إضافة علامات المؤسسات
    addBusinessMarkers();
    
    // ضبط التحكم في التكبير
    setupMapControls();
}

// إضافة علامات المؤسسات على الخريطة
function addBusinessMarkers() {
    // إزالة العلامات السابقة
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // إضافة علامات جديدة
    businessesData.forEach(business => {
        if (business.lat && business.lng) {
            const icon = L.divIcon({
                html: `
                    <div class="map-marker ${business.category}">
                        <i class="${getCategoryIcon(business.category)}"></i>
                        <div class="marker-label">${business.name.substring(0, 15)}...</div>
                    </div>
                `,
                className: 'custom-div-icon',
                iconSize: [40, 50],
                iconAnchor: [20, 45]
            });
            
            const marker = L.marker([business.lat, business.lng], { icon })
                .addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h3>${business.name}</h3>
                        <p>${business.address}</p>
                        <div class="popup-rating">
                            ${generateRatingStars(business.rating)}
                            <span>${business.rating}</span>
                        </div>
                        <button class="popup-btn" onclick="showBusinessDetails(${business.id})">
                            عرض التفاصيل
                        </button>
                    </div>
                `);
            
            marker.businessId = business.id;
            markers.push(marker);
        }
    });
}

// إعداد تحكمات الخريطة
function setupMapControls() {
    // تكبير
    document.getElementById('zoom-in').addEventListener('click', () => {
        map.zoomIn();
    });
    
    // تصغير
    document.getElementById('zoom-out').addEventListener('click', () => {
        map.zoomOut();
    });
    
    // ملء الشاشة
    document.getElementById('fullscreen-map').addEventListener('click', () => {
        const mapElement = document.getElementById('map');
        if (!document.fullscreenElement) {
            if (mapElement.requestFullscreen) {
                mapElement.requestFullscreen();
            } else if (mapElement.webkitRequestFullscreen) {
                mapElement.webkitRequestFullscreen();
            } else if (mapElement.msRequestFullscreen) {
                mapElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });
    
    // تحديد موقعي
    document.getElementById('locate-me').addEventListener('click', locateUser);
}

// تحديد موقع المستخدم
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = [position.coords.latitude, position.coords.longitude];
                
                // إزالة العلامة السابقة
                if (userLocationMarker) {
                    map.removeLayer(userLocationMarker);
                }
                
                // إضافة علامة موقع المستخدم
                userLocationMarker = L.marker(userLocation, {
                    icon: L.divIcon({
                        html: '<div class="user-location-marker"><i class="fas fa-location-arrow"></i></div>',
                        className: 'custom-div-icon',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    })
                }).addTo(map);
                
                // تكبير الخريطة على موقع المستخدم
                map.setView(userLocation, 13);
                
                // تحديث النتائج حسب الموقع
                filterAndDisplayBusinesses();
            },
            (error) => {
                alert('تعذر الحصول على موقعك. يرجى التأكد من تفعيل خدمة الموقع.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('المتصفح لا يدعم خدمة تحديد الموقع.');
    }
}

// عرض تفاصيل المؤسسة
function showBusinessDetails(businessId) {
    const business = businessesData.find(b => b.id === businessId);
    if (!business) return;
    
    // تحديث عنوان النافذة المنبثقة
    document.getElementById('business-name').textContent = business.name;
    
    // إنشاء محتوى تفاصيل المؤسسة
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="business-detail">
            <div class="detail-header">
                <div class="detail-category">
                    <i class="${getCategoryIcon(business.category)}"></i>
                    <span>${getCategoryName(business.category)}</span>
                </div>
                <div class="detail-rating">
                    ${generateRatingStars(business.rating)}
                    <span class="rating-value">${business.rating}</span>
                    <span class="review-count">(${business.reviewCount} تقييم)</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> الوصف</h3>
                <p>${business.description}</p>
            </div>
            
            <div class="detail-grid">
                <div class="detail-info">
                    <h3><i class="fas fa-map-marker-alt"></i> العنوان</h3>
                    <p>${business.address}</p>
                    
                    <h3><i class="fas fa-phone"></i> الهاتف</h3>
                    <div class="phones">
                        ${business.phone.map(phone => `
                            <div class="phone-item">
                                <span>${phone}</span>
                                <button class="call-btn" onclick="callNumber('${phone}')">
                                    <i class="fas fa-phone"></i> اتصل
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${business.email ? `
                        <h3><i class="fas fa-envelope"></i> البريد الإلكتروني</h3>
                        <p><a href="mailto:${business.email}">${business.email}</a></p>
                    ` : ''}
                    
                    ${business.website ? `
                        <h3><i class="fas fa-globe"></i> الموقع الإلكتروني</h3>
                        <p><a href="https://${business.website}" target="_blank">${business.website}</a></p>
                    ` : ''}
                </div>
                
                <div class="detail-hours">
                    <h3><i class="fas fa-clock"></i> ساعات العمل</h3>
                    <div class="hours-list">
                        ${formatBusinessHours(business.hours)}
                    </div>
                    
                    <h3><i class="fas fa-map-marked-alt"></i> التوجه عبر الخريطة</h3>
                    <button class="get-directions-btn" onclick="getDirections(${business.lat}, ${business.lng})">
                        <i class="fas fa-directions"></i> احصل على الاتجاهات
                    </button>
                </div>
            </div>
            
            ${business.services ? `
                <div class="detail-section">
                    <h3><i class="fas fa-concierge-bell"></i> الخدمات المقدمة</h3>
                    <div class="services-list">
                        ${business.services.map(service => `
                            <span class="service-tag">${service}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${business.specialty ? `
                <div class="detail-section">
                    <h3><i class="fas fa-user-md"></i> التخصص</h3>
                    <p>${business.specialty}</p>
                    ${business.education ? `<p><strong>المؤهلات:</strong> ${business.education}</p>` : ''}
                </div>
            ` : ''}
            
            ${business.activities ? `
                <div class="detail-section">
                    <h3><i class="fas fa-hands-helping"></i> الأنشطة</h3>
                    <div class="activities-list">
                        ${business.activities.map(activity => `
                            <span class="activity-tag">${activity}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // إظهار النافذة المنبثقة
    document.getElementById('business-detail-modal').style.display = 'block';
    
    // تمركز الخريطة على المؤسسة المحددة
    map.setView([business.lat, business.lng], 15);
}

// الاتصال برقم الهاتف
function callNumber(phoneNumber) {
    if (confirm(`هل تريد الاتصال بـ ${phoneNumber}؟`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
}

// الحصول على الاتجاهات
function getDirections(lat, lng) {
    let origin = '';
    
    if (userLocation) {
        origin = `${userLocation[0]},${userLocation[1]}`;
    } else {
        // استخدام الموقع الحالي من الخريطة
        const center = map.getCenter();
        origin = `${center.lat},${center.lng}`;
    }
    
    const destination = `${lat},${lng}`;
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin};${destination}`;
    window.open(url, '_blank');
}

// تصفية وعرض المؤسسات
function filterAndDisplayBusinesses() {
    const searchText = document.getElementById('main-search').value.toLowerCase();
    const locationText = document.getElementById('location-search').value.toLowerCase();
    const category = document.getElementById('category-select').value;
    const sortBy = document.getElementById('sort-select').value;
    const radius = parseInt(document.getElementById('radius-select').value);
    
    // تصفية المؤسسات
    let filteredBusinesses = businessesData.filter(business => {
        // تصفية حسب النص
        const matchesSearch = !searchText || 
            business.name.toLowerCase().includes(searchText) ||
            business.description.toLowerCase().includes(searchText) ||
            business.address.toLowerCase().includes(searchText);
        
        // تصفية حسب الموقع
        const matchesLocation = !locationText || 
            business.address.toLowerCase().includes(locationText);
        
        // تصفية حسب الفئة
        const matchesCategory = !category || business.category === category;
        
        // تصفية حسب المسافة (إذا كان موقع المستخدم متاحاً)
        let withinRadius = true;
        if (userLocation && radius) {
            const distance = getDistance(
                userLocation[0], userLocation[1],
                business.lat, business.lng
            );
            withinRadius = distance <= radius;
        }
        
        return matchesSearch && matchesLocation && matchesCategory && withinRadius;
    });
    
    // ترتيب النتائج
    filteredBusinesses.sort((a, b) => {
        if (sortBy === 'distance' && userLocation) {
            const distanceA = getDistance(
                userLocation[0], userLocation[1],
                a.lat, a.lng
            );
            const distanceB = getDistance(
                userLocation[0], userLocation[1],
                b.lat, b.lng
            );
            return distanceA - distanceB;
        } else if (sortBy === 'rating') {
            return b.rating - a.rating;
        } else if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });
    
    // تحديث عدد النتائج
    document.getElementById('results-count').textContent = filteredBusinesses.length;
    
    // عرض المؤسسات المصفاة
    displayBusinesses(filteredBusinesses);
    
    // تحديث العلامات على الخريطة
    updateMapMarkers(filteredBusinesses);
}

// عرض المؤسسات في القائمة
function displayBusinesses(businesses) {
    const resultsContainer = document.getElementById('business-results');
    
    if (businesses.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>لا توجد نتائج للبحث</h3>
                <p>حاول البحث بكلمات أخرى أو قم بتوسيع نطاق البحث</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = businesses.map(business => `
        <div class="business-card" onclick="showBusinessDetails(${business.id})">
            <div class="business-header">
                <div>
                    <h3 class="business-name">${business.name}</h3>
                    <span class="business-category">
                        <i class="${getCategoryIcon(business.category)}"></i>
                        ${getCategoryName(business.category)}
                    </span>
                </div>
                <div class="business-rating">
                    ${generateRatingStars(business.rating)}
                    <span class="rating-value">${business.rating}</span>
                </div>
            </div>
            
            <div class="business-info">
                <div class="business-address">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${business.address}</span>
                </div>
                <div class="business-phone">
                    <i class="fas fa-phone"></i>
                    <span>${business.phone[0]}</span>
                </div>
                <div class="business-hours">
                    <i class="fas fa-clock"></i>
                    <span>${business.hours.sunday.open} - ${business.hours.sunday.close}</span>
                </div>
            </div>
            
            <div class="business-actions">
                <button class="btn-action btn-call" onclick="event.stopPropagation(); callNumber('${business.phone[0]}')">
                    <i class="fas fa-phone"></i> اتصل
                </button>
                <button class="btn-action btn-directions" onclick="event.stopPropagation(); getDirections(${business.lat}, ${business.lng})">
                    <i class="fas fa-directions"></i> اتجاهات
                </button>
                <button class="btn-action btn-details" onclick="event.stopPropagation(); showBusinessDetails(${business.id})">
                    <i class="fas fa-info-circle"></i> التفاصيل
                </button>
            </div>
        </div>
    `).join('');
}

// تحديث العلامات على الخريطة
function updateMapMarkers(businesses) {
    // إخفاء جميع العلامات
    markers.forEach(marker => {
        marker.setOpacity(0.3);
    });
    
    // إظهار العلامات للمؤسسات المصفاة فقط
    businesses.forEach(business => {
        const marker = markers.find(m => m.businessId === business.id);
        if (marker) {
            marker.setOpacity(1);
        }
    });
}

// عرض المؤسسات المميزة
function displayFeaturedBusinesses() {
    const featuredContainer = document.querySelector('.featured-grid');
    const featuredBusinesses = businessesData.filter(b => b.featured).slice(0, 3);
    
    featuredContainer.innerHTML = featuredBusinesses.map(business => `
        <div class="featured-card" onclick="showBusinessDetails(${business.id})">
            <div class="featured-image">
                <i class="${getCategoryIcon(business.category)}"></i>
            </div>
            <div class="featured-content">
                <span class="featured-badge">مميز</span>
                <h3>${business.name}</h3>
                <div class="featured-rating">
                    ${generateRatingStars(business.rating)}
                    <span>${business.rating} (${business.reviewCount})</span>
                </div>
                <p class="featured-address">
                    <i class="fas fa-map-marker-alt"></i> ${business.address.substring(0, 40)}...
                </p>
                <button class="btn-action btn-details" onclick="event.stopPropagation(); showBusinessDetails(${business.id})">
                    <i class="fas fa-info-circle"></i> عرض التفاصيل
                </button>
            </div>
        </div>
    `).join('');
}

// حساب المسافة بين إحداثيين (بالكيلومترات)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الخريطة
    initMap();
    
    // عرض المؤسسات
    displayBusinesses(businessesData);
    
    // عرض المؤسسات المميزة
    displayFeaturedBusinesses();
    
    // إضافة مستمعي الأحداث للبحث
    document.getElementById('search-btn').addEventListener('click', filterAndDisplayBusinesses);
    
    document.getElementById('main-search').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterAndDisplayBusinesses();
        }
    });
    
    document.getElementById('category-select').addEventListener('change', filterAndDisplayBusinesses);
    document.getElementById('sort-select').addEventListener('change', filterAndDisplayBusinesses);
    document.getElementById('radius-select').addEventListener('change', filterAndDisplayBusinesses);
    
    // إغلاق النافذة المنبثقة
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('business-detail-modal').style.display = 'none';
    });
    
    // إغلاق النافذة المنبثقة بالنقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('business-detail-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // القائمة المتنقلة
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
    
    // البحث التلقائي عند تغيير الموقع
    document.getElementById('location-search').addEventListener('change', filterAndDisplayBusinesses);
});



