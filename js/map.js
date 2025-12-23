/**
 * ملف map.js - إدارة الخريطة التفاعلية لموقع ساعدني
 * يحتوي على جميع وظائف الخريطة والخرائط
 */

// متغيرات الخريطة العامة
let map = null;
let markers = [];
let userLocationMarker = null;
let userLocation = null;
let currentBusinessLayer = null;
let directionsControl = null;

/**
 * تهيئة الخريطة التفاعلية
 */
function initMap() {
    try {
        // التحقق من وجود عنصر الخريطة
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('عنصر الخريطة غير موجود');
            return;
        }

        // استخدام إحداثيات الجزائر من الإعدادات
        const defaultCenter = window.CONFIG ? window.CONFIG.MAP.defaultCenter : [36.7538, 3.0588];
        const defaultZoom = window.CONFIG ? window.CONFIG.MAP.defaultZoom : 12;

        // إنشاء الخريطة
        map = L.map('map', {
            center: defaultCenter,
            zoom: defaultZoom,
            zoomControl: false,
            attributionControl: true
        });

        // إضافة طبقة الخريطة الأساسية من OpenStreetMap
        L.tileLayer(window.CONFIG ? window.CONFIG.APIS.LEAFLET_TILES : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: window.CONFIG ? window.CONFIG.MAP.maxZoom : 18,
            minZoom: window.CONFIG ? window.CONFIG.MAP.minZoom : 8,
            detectRetina: true
        }).addTo(map);

        // إضافة عناصر التحكم بالتكبير في الزاوية اليسرى العليا
        L.control.zoom({
            position: 'topleft'
        }).addTo(map);

        // إضافة مقياس المسافة
        L.control.scale({
            position: 'bottomleft',
            imperial: false,
            metric: true
        }).addTo(map);

        // إضافة علامات المؤسسات الافتراضية
        addBusinessMarkers(window.backupBusinessesData || []);

        // إعداد التحكمات الإضافية
        setupMapControls();

        // إعداد مستمعي الأحداث للخريطة
        setupMapEvents();

        console.log('تم تهيئة الخريطة بنجاح');
        
        // إرجاع كائن الخريطة للاستخدام الخارجي
        return map;

    } catch (error) {
        console.error('خطأ في تهيئة الخريطة:', error);
        showMapError('تعذر تحميل الخريطة. يرجى تحديث الصفحة.');
    }
}

/**
 * إضافة علامات المؤسسات على الخريطة
 * @param {Array} businesses - مصفوفة المؤسسات
 */
function addBusinessMarkers(businesses) {
    try {
        // إزالة العلامات السابقة
        clearMarkers();

        if (!businesses || businesses.length === 0) {
            showNoResultsOnMap();
            return;
        }

        // إنشاء مجموعة للعلامات
        const markerGroup = L.layerGroup().addTo(map);

        // إضافة علامة لكل مؤسسة
        businesses.forEach(business => {
            if (business.lat && business.lng && !isNaN(business.lat) && !isNaN(business.lng)) {
                const marker = createBusinessMarker(business);
                if (marker) {
                    marker.addTo(markerGroup);
                    markers.push(marker);
                }
            }
        });

        // تمركز الخريطة على جميع العلامات
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
            map.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 15
            });
        }

        // حفظ مجموعة العلامات الحالية
        currentBusinessLayer = markerGroup;

    } catch (error) {
        console.error('خطأ في إضافة علامات المؤسسات:', error);
    }
}

/**
 * إنشاء علامة لمؤسسة واحدة
 * @param {Object} business - بيانات المؤسسة
 * @returns {L.Marker} علامة المؤسسة
 */
function createBusinessMarker(business) {
    try {
        const icon = L.divIcon({
            html: `
                <div class="map-marker ${business.category}" data-business-id="${business.id}">
                    <i class="${getCategoryIcon(business.category)}"></i>
                    <div class="marker-pulse"></div>
                </div>
            `,
            className: 'custom-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const marker = L.marker([business.lat, business.lng], { 
            icon: icon,
            title: business.name,
            alt: business.name,
            riseOnHover: true
        });

        // إضافة نافذة معلومات للمؤسسة
        const popupContent = createPopupContent(business);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            minWidth: 250,
            className: 'business-popup',
            closeButton: true,
            autoClose: false,
            closeOnEscapeKey: true
        });

        // إضافة حدث النقر على العلامة
        marker.on('click', function() {
            highlightBusinessMarker(marker);
            showBusinessDetails(business.id);
            
            // تسجيل حدث النقر للتحليلات
            if (typeof gtag !== 'undefined') {
                gtag('event', 'map_marker_click', {
                    'business_id': business.id,
                    'business_name': business.name,
                    'category': business.category
                });
            }
        });

        // إضافة تأثيرات التفاعل
        marker.on('mouseover', function() {
            this.openPopup();
            marker.setZIndexOffset(1000);
        });

        marker.on('mouseout', function() {
            if (!this._popup._isOpen) {
                this.closePopup();
            }
        });

        return marker;

    } catch (error) {
        console.error('خطأ في إنشاء علامة المؤسسة:', error);
        return null;
    }
}

/**
 * إنشاء محتوى نافذة المعلومات للمؤسسة
 * @param {Object} business - بيانات المؤسسة
 * @returns {String} HTML للنافذة المنبثقة
 */
function createPopupContent(business) {
    const ratingStars = generateRatingStars(business.rating);
    const categoryName = getCategoryName(business.category);
    
    return `
        <div class="map-popup-content">
            <div class="popup-header">
                <h3 class="popup-title">${business.name}</h3>
                <span class="popup-category">${categoryName}</span>
            </div>
            
            <div class="popup-body">
                <div class="popup-info">
                    <div class="popup-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${business.address || 'عنوان غير محدد'}</span>
                    </div>
                    
                    ${business.phone && business.phone.length > 0 ? `
                        <div class="popup-phone">
                            <i class="fas fa-phone"></i>
                            <span>${business.phone[0]}</span>
                        </div>
                    ` : ''}
                    
                    <div class="popup-rating">
                        <div class="stars">${ratingStars}</div>
                        <span class="rating-value">${business.rating.toFixed(1)}</span>
                    </div>
                </div>
                
                <div class="popup-actions">
                    <button class="popup-btn btn-call" onclick="callNumber('${business.phone && business.phone[0] ? business.phone[0] : ''}'); event.stopPropagation();">
                        <i class="fas fa-phone"></i> اتصل
                    </button>
                    <button class="popup-btn btn-directions" onclick="getDirections(${business.lat}, ${business.lng}); event.stopPropagation();">
                        <i class="fas fa-directions"></i> اتجاهات
                    </button>
                    <button class="popup-btn btn-details" onclick="showBusinessDetails('${business.id}'); event.stopPropagation();">
                        <i class="fas fa-info-circle"></i> تفاصيل
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * إعداد تحكمات الخريطة الإضافية
 */
function setupMapControls() {
    // التحكم في التكبير يدوياً
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const fullscreenBtn = document.getElementById('fullscreen-map');
    const locateMeBtn = document.getElementById('locate-me');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            map.zoomIn();
            animateButton(zoomInBtn);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            map.zoomOut();
            animateButton(zoomOutBtn);
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    if (locateMeBtn) {
        locateMeBtn.addEventListener('click', locateUser);
    }
}

/**
 * إعداد أحداث الخريطة
 */
function setupMapEvents() {
    // حدث تغيير حجم النافذة
    window.addEventListener('resize', debounce(() => {
        map.invalidateSize();
    }, 250));

    // حدث تفاعل مع الخريطة
    map.on('click', function(e) {
        console.log('نقرة على الخريطة:', e.latlng);
    });

    // حدث تحميل الخريطة
    map.on('load', function() {
        console.log('تم تحميل الخريطة');
        document.getElementById('map').classList.add('loaded');
    });

    // حدث تغيير العرض
    map.on('zoomend', function() {
        updateMapBasedOnZoom();
    });
}

/**
 * تحديث الخريطة بناءً على مستوى التكبير
 */
function updateMapBasedOnZoom() {
    const currentZoom = map.getZoom();
    
    // يمكن إضافة منطق لعرض معلومات مختلفة بناءً على مستوى التكبير
    if (currentZoom < 10) {
        // مستوى تكبير منخفض - عرض معلومات أقل
        markers.forEach(marker => {
            if (marker._popup) {
                marker._popup.setContent(createSimplePopup(marker.business));
            }
        });
    } else {
        // مستوى تكبير عالي - عرض معلومات كاملة
        markers.forEach(marker => {
            if (marker._popup) {
                marker._popup.setContent(createPopupContent(marker.business));
            }
        });
    }
}

/**
 * إنشاء نافذة معلومات مبسطة
 */
function createSimplePopup(business) {
    return `
        <div class="simple-popup">
            <h4>${business.name}</h4>
            <p>${getCategoryName(business.category)}</p>
        </div>
    `;
}

/**
 * تحديد موقع المستخدم الحالي
 */
function locateUser() {
    if (!navigator.geolocation) {
        alert('المتصفح لا يدعم خدمة تحديد الموقع.');
        return;
    }

    const locateBtn = document.getElementById('locate-me');
    if (locateBtn) {
        locateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديد...';
        locateBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = [position.coords.latitude, position.coords.longitude];
            
            // إزالة العلامة السابقة لموقع المستخدم
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }

            // إنشاء علامة موقع المستخدم
            userLocationMarker = L.marker(userLocation, {
                icon: L.divIcon({
                    html: '<div class="user-location-marker"><i class="fas fa-location-arrow"></i></div>',
                    className: 'user-location-div-icon',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                }),
                zIndexOffset: 1000,
                title: 'موقعك الحالي',
                alt: 'موقعك الحالي'
            }).addTo(map);

            // إضافة دائرة نصف قطرها لتحديد الدقة
            const accuracyCircle = L.circle(userLocation, {
                color: '#4361ee',
                fillColor: '#4361ee',
                fillOpacity: 0.1,
                radius: position.coords.accuracy
            }).addTo(map);

            // تكبير الخريطة على موقع المستخدم
            map.setView(userLocation, 15);

            // تحديث زر التحديد
            if (locateBtn) {
                locateBtn.innerHTML = '<i class="fas fa-location-arrow"></i> موقعي';
                locateBtn.disabled = false;
            }

            // إشعار المستخدم
            showNotification('تم تحديد موقعك بنجاح', 'success');
            
            // تحديث نتائج البحث بناءً على الموقع الجديد
            if (typeof filterAndDisplayBusinesses === 'function') {
                setTimeout(() => filterAndDisplayBusinesses(), 500);
            }

        },
        function(error) {
            console.error('خطأ في تحديد الموقع:', error);
            
            let errorMessage = 'تعذر تحديد موقعك. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'تم رفض الإذن.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'معلومات الموقع غير متاحة.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'انتهت مهلة الطلب.';
                    break;
                default:
                    errorMessage += 'حدث خطأ غير معروف.';
            }

            alert(errorMessage);
            
            if (locateBtn) {
                locateBtn.innerHTML = '<i class="fas fa-location-arrow"></i> تحديد موقعي';
                locateBtn.disabled = false;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/**
 * الحصول على اتجاهات من موقع المستخدم إلى الوجهة
 * @param {number} destLat - خط عرض الوجهة
 * @param {number} destLng - خط طول الوجهة
 */
function getDirections(destLat, destLng) {
    let origin;
    
    if (userLocation) {
        origin = userLocation;
    } else {
        // استخدام مركز الخريطة الحالي إذا لم يكن موقع المستخدم متاحاً
        origin = map.getCenter();
        
        // سؤال المستخدم إذا أراد استخدام موقعه
        if (confirm('لم يتم تحديد موقعك. هل تريد تحديد موقعك للحصول على اتجاهات دقيقة؟')) {
            locateUser();
            return;
        }
    }

    const destination = [destLat, destLng];
    
    // فتح خدمة الاتجاهات من OpenStreetMap
    const originStr = `${origin.lat || origin[0]},${origin.lng || origin[1]}`;
    const destStr = `${destination[0]},${destination[1]}`;
    
    const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${originStr};${destStr}`;
    
    // فتح في نافذة جديدة
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
    
    // تسجيل حدث الاتجاهات
    if (typeof gtag !== 'undefined') {
        gtag('event', 'get_directions', {
            'origin': originStr,
            'destination': destStr
        });
    }
}

/**
 * إظهار تفاصيل المؤسسة على الخريطة
 * @param {string} businessId - معرف المؤسسة
 */
function showBusinessOnMap(businessId) {
    if (!markers || markers.length === 0) return;

    const marker = markers.find(m => m.options.businessId === businessId);
    if (marker) {
        // فتح نافذة المعلومات
        marker.openPopup();
        
        // تمركز الخريطة على العلامة
        map.setView(marker.getLatLng(), 15);
        
        // تسليط الضوء على العلامة
        highlightBusinessMarker(marker);
    }
}

/**
 * تسليط الضوء على علامة المؤسسة
 * @param {L.Marker} marker - علامة المؤسسة
 */
function highlightBusinessMarker(marker) {
    // إزالة التمييز من جميع العلامات
    markers.forEach(m => {
        const iconElement = m.getElement();
        if (iconElement) {
            iconElement.classList.remove('highlighted');
        }
    });

    // تمييز العلامة المحددة
    const iconElement = marker.getElement();
    if (iconElement) {
        iconElement.classList.add('highlighted');
        
        // إضافة تأثير النبض
        iconElement.classList.add('pulse');
        setTimeout(() => {
            iconElement.classList.remove('pulse');
        }, 1500);
    }
}

/**
 * مسح جميع العلامات من الخريطة
 */
function clearMarkers() {
    if (currentBusinessLayer) {
        map.removeLayer(currentBusinessLayer);
        currentBusinessLayer = null;
    }
    
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    markers = [];
}

/**
 * إظهار رسالة عدم وجود نتائج على الخريطة
 */
function showNoResultsOnMap() {
    const bounds = map.getBounds();
    const center = bounds.getCenter();
    
    const noResultsMarker = L.marker(center, {
        icon: L.divIcon({
            html: `
                <div class="no-results-marker">
                    <i class="fas fa-search"></i>
                    <div class="no-results-text">لا توجد نتائج في هذه المنطقة</div>
                </div>
            `,
            className: 'no-results-div-icon',
            iconSize: [200, 100],
            iconAnchor: [100, 50]
        }),
        interactive: false
    }).addTo(map);
    
    setTimeout(() => {
        map.removeLayer(noResultsMarker);
    }, 5000);
}

/**
 * إظهار خطأ على الخريطة
 * @param {string} message - رسالة الخطأ
 */
function showMapError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'map-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="initMap()" class="btn-retry">
                <i class="fas fa-redo"></i> إعادة المحاولة
            </button>
        </div>
    `;
    
    const mapElement = document.getElementById('map');
    mapElement.appendChild(errorDiv);
}

/**
 * تبديل وضع ملء الشاشة للخريطة
 */
function toggleFullscreen() {
    const mapElement = document.getElementById('map');
    const fullscreenBtn = document.getElementById('fullscreen-map');
    
    if (!document.fullscreenElement) {
        if (mapElement.requestFullscreen) {
            mapElement.requestFullscreen();
        } else if (mapElement.webkitRequestFullscreen) {
            mapElement.webkitRequestFullscreen();
        } else if (mapElement.msRequestFullscreen) {
            mapElement.msRequestFullscreen();
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.setAttribute('aria-label', 'تصغير الخريطة');
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.setAttribute('aria-label', 'تكبير الخريطة إلى ملء الشاشة');
        }
    }
}

/**
 * إضافة تأثير للزر عند النقر
 * @param {HTMLElement} button - الزر
 */
function animateButton(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 300);
}

/**
 * وظيفة debounce لتحسين الأداء
 */
function debounce(func, wait) {
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

/**
 * إظهار إشعار للمستخدم
 * @param {string} message - الرسالة
 * @param {string} type - نوع الإشعار (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إخفاء الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * تصدير الدوال للاستخدام الخارجي
 */
window.MapManager = {
    initMap,
    addBusinessMarkers,
    locateUser,
    getDirections,
    showBusinessOnMap,
    clearMarkers,
    toggleFullscreen,
    getMap: () => map,
    getUserLocation: () => userLocation
};

// تهيئة الخريطة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تأخير تهيئة الخريطة قليلاً لضمان تحميل جميع العناصر
    setTimeout(() => {
        if (document.getElementById('map')) {
            initMap();
        }
    }, 100);
});

// التعامل مع تغيير وضع ملء الشاشة
document.addEventListener('fullscreenchange', function() {
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 300);
});

document.addEventListener('webkitfullscreenchange', function() {
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 300);
});

document.addEventListener('msfullscreenchange', function() {
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 300);
});