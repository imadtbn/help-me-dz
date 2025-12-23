// ===========================================
// تهيئة المتغيرات العامة
// ===========================================
let map;
let markers = [];
let userLocationMarker = null;
let userLocation = null;
let userLocationCircle = null;
let businessesData = [];

// ===========================================
// الدوال المساعدة الأساسية
// ===========================================
function getCategoryIcon(category) {
    const icons = {
        'restaurant': 'fas fa-utensils',
        'cafe': 'fas fa-coffee',
        'hotel': 'fas fa-hotel',
        'hospital': 'fas fa-hospital',
        'pharmacy': 'fas fa-prescription-bottle',
        'bank': 'fas fa-university',
        'market': 'fas fa-shopping-cart',
        'default': 'fas fa-map-marker-alt'
    };
    return icons[category] || icons.default;
}

// ===========================================
// تهيئة الخريطة
// ===========================================
function initMap() {
    try {
        // إحداثيات الجزائر الوسطى
        const algeriaCenter = [36.7063956, 3.211357];

        // إنشاء الخريطة
        map = L.map('map').setView(algeriaCenter, 6);

        // إضافة طبقة الخريطة من OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            noWrap: true
        }).addTo(map);

        // استخدام البيانات من الوحدة المشتركة
        businessesData = window.BusinessDataModule?.backupBusinessesData || window.backupBusinessesData || [];

        // إضافة علامات المؤسسات
        addBusinessMarkers();

        // ضبط التحكم في التكبير
        setupMapControls();

        console.log('تم تهيئة الخريطة بنجاح');
    } catch (error) {
        console.error('خطأ في تهيئة الخريطة:', error);
        showErrorMessage('تعذر تحميل الخريطة. يرجى تحديث الصفحة.');
    }
}

// ===========================================
// إضافة علامات المؤسسات على الخريطة
// ===========================================
function addBusinessMarkers() {
    try {
        // إزالة العلامات السابقة
        clearAllMarkers();

        if (!businessesData || businessesData.length === 0) {
            console.warn('لا توجد بيانات للمؤسسات');
            return;
        }

        // إضافة علامات جديدة
        businessesData.forEach(business => {
            if (business.lat && business.lng && !isNaN(business.lat) && !isNaN(business.lng)) {
                try {
                    const icon = L.divIcon({
                        html: `
                            <div class="map-marker ${business.category}" title="${business.name}">
                                <i class="${getCategoryIcon(business.category)}"></i>
                            </div>
                        `,
                        className: 'custom-div-icon',
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                        popupAnchor: [0, -40]
                    });

                    const marker = L.marker([business.lat, business.lng], { icon })
                        .addTo(map)
                        .bindPopup(createMarkerPopup(business), {
                            maxWidth: 300,
                            minWidth: 250
                        });

                    marker.businessId = business.id;
                    marker.businessData = business;
                    markers.push(marker);
                } catch (markerError) {
                    console.error(`خطأ في إضافة علامة للمؤسسة ${business.name}:`, markerError);
                }
            }
        });

        console.log(`تم إضافة ${markers.length} علامة على الخريطة`);
    } catch (error) {
        console.error('خطأ في إضافة العلامات:', error);
    }
}

// ===========================================
// إنشاء نافذة منبثقة للعلامة
// ===========================================
function createMarkerPopup(business) {
    const generateRatingStars = window.BusinessDataModule?.generateRatingStars ||
        window.businessDataModule?.generateRatingStars ||
        (() => '');

    return `
        <div class="map-popup">
            <div class="popup-header">
                <i class="${getCategoryIcon(business.category)}"></i>
                <h3>${business.name}</h3>
            </div>
            <div class="popup-content">
                <p class="popup-address">${business.address || 'لا يوجد عنوان'}</p>
                <div class="popup-rating">
                    ${generateRatingStars(business.rating || 0)}
                    <span class="rating-value">${business.rating || 0}</span>
                </div>
            </div>
            <div class="popup-actions">
                <button class="popup-btn" onclick="showBusinessDetails(${business.id})">
                    <i class="fas fa-info-circle"></i> التفاصيل
                </button>
                <button class="popup-btn" onclick="getDirections(${business.lat}, ${business.lng})">
                    <i class="fas fa-directions"></i> الاتجاهات
                </button>
            </div>
        </div>
    `;
}

// ===========================================
// إعداد تحكمات الخريطة
// ===========================================
function setupMapControls() {
    try {
        // تكبير
        const zoomInBtn = document.getElementById('zoom-in');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                map.zoomIn();
                updateZoomLevel();
            });
        }

        // تصغير
        const zoomOutBtn = document.getElementById('zoom-out');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                map.zoomOut();
                updateZoomLevel();
            });
        }

        // ملء الشاشة
        const fullscreenBtn = document.getElementById('fullscreen-map');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        // تحديد موقعي
        const locateBtn = document.getElementById('locate-me');
        if (locateBtn) {
            locateBtn.addEventListener('click', locateUser);
        }

        // تحديث مستوى التكبير عند تغييره
        map.on('zoomend', updateZoomLevel);

        console.log('تم إعداد تحكمات الخريطة');
    } catch (error) {
        console.error('خطأ في إعداد تحكمات الخريطة:', error);
    }
}

// ===========================================
// تحديث مستوى التكبير المعروض
// ===========================================
function updateZoomLevel() {
    const zoomLevel = document.getElementById('zoom-level');
    if (zoomLevel && map) {
        zoomLevel.textContent = `التكبير: ${map.getZoom()}`;
    }
}

// ===========================================
// تبديل وضع ملء الشاشة
// ===========================================
function toggleFullscreen() {
    const mapElement = document.getElementById('map');

    if (!document.fullscreenElement) {
        if (mapElement.requestFullscreen) {
            mapElement.requestFullscreen();
        } else if (mapElement.webkitRequestFullscreen) {
            mapElement.webkitRequestFullscreen();
        } else if (mapElement.msRequestFullscreen) {
            mapElement.msRequestFullscreen();
        }

        // إعادة ضبط حجم الخريطة عند الدخول في وضع ملء الشاشة
        setTimeout(() => map.invalidateSize(), 300);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// ===========================================
// تحديد موقع المستخدم
// ===========================================
function locateUser() {
    const locateBtn = document.getElementById('locate-me');

    if (!locateBtn) {
        console.error('زر تحديد الموقع غير موجود');
        return;
    }

    // تغيير حالة الزر أثناء التحميل
    const originalHTML = locateBtn.innerHTML;
    locateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد الموقع...';
    locateBtn.disabled = true;

    // التحقق من دعم المتصفح للموقع الجغرافي
    if (!navigator.geolocation) {
        showErrorMessage('متصفحك لا يدعم خدمة تحديد الموقع.');
        resetLocateButton(locateBtn, originalHTML);
        return;
    }

    // خيارات أكثر دقة
    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    };

    // محاولة الحصول على الموقع
    navigator.geolocation.getCurrentPosition(
        (position) => {
            handleLocationSuccess(position);
            resetLocateButton(locateBtn, originalHTML);
        },
        (error) => {
            handleLocationError(error);
            resetLocateButton(locateBtn, originalHTML);
        },
        options
    );
}

// ===========================================
// معالجة نجاح تحديد الموقع
// ===========================================
function handleLocationSuccess(position) {
    try {
        userLocation = [position.coords.latitude, position.coords.longitude];
        const accuracy = position.coords.accuracy || 50;

        // إزالة العلامات السابقة
        if (userLocationMarker) {
            map.removeLayer(userLocationMarker);
        }
        if (userLocationCircle) {
            map.removeLayer(userLocationCircle);
        }

        // إضافة علامة موقع المستخدم
        userLocationMarker = L.marker(userLocation, {
            icon: L.divIcon({
                html: '<div class="user-location-marker"><i class="fas fa-location-arrow"></i></div>',
                className: 'custom-div-icon user-location-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            }),
            zIndexOffset: 1000,
            title: 'موقعك الحالي'
        }).addTo(map);

        // إضافة دائرة توضح دقة الموقع
        userLocationCircle = L.circle(userLocation, {
            color: '#4285f4',
            fillColor: '#4285f4',
            fillOpacity: 0.2,
            radius: accuracy
        }).addTo(map);

        // تكبير الخريطة على موقع المستخدم
        map.setView(userLocation, 15);

        // عرض رسالة نجاح
        showSuccessMessage('تم تحديد موقعك بنجاح!');

        // تحديث البحث حسب الموقع
        setTimeout(() => {
            filterAndDisplayBusinesses();
            highlightNearbyBusinesses();
        }, 500);

        console.log('تم تحديد موقع المستخدم:', userLocation, 'دقة:', accuracy + 'م');
    } catch (error) {
        console.error('خطأ في معالجة موقع المستخدم:', error);
        showErrorMessage('حدث خطأ في معالجة موقعك.');
    }
}

// ===========================================
// معالجة خطأ تحديد الموقع
// ===========================================
function handleLocationError(error) {
    let message = 'تعذر الحصول على موقعك.';
    let details = '';

    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'تم رفض الإذن بالوصول إلى الموقع.';
            details = 'يرجى السماح بالوصول إلى الموقع في إعدادات المتصفح.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'معلومات الموقع غير متوفرة.';
            details = 'يرجى التأكد من تفعيل خدمة الموقع على جهازك.';
            break;
        case error.TIMEOUT:
            message = 'انتهت المهلة في انتظار الموقع.';
            details = 'يرجى المحاولة مرة أخرى في مكان ذي إشارة أفضل.';
            break;
        default:
            message = 'حدث خطأ غير معروف أثناء تحديد الموقع.';
            details = `خطأ ${error.code}: ${error.message}`;
    }

    // عرض رسالة تفصيلية
    showErrorMessage(`${message} ${details}`);

    // اقتراح استخدام موقع افتراضي
    setTimeout(() => {
        if (confirm('هل تريد استخدام مركز المدينة كموقع بديل؟')) {
            useDefaultLocation();
        }
    }, 2000);

    console.error('خطأ في تحديد الموقع:', error);
}

// ===========================================
// استخدام موقع افتراضي
// ===========================================
function useDefaultLocation() {
    // استخدام موقع المركز التجاري أو المدينة كبديل
    const defaultLocation = [36.7063956, 3.211357]; // الجزائر الوسطى

    userLocation = defaultLocation;
    const accuracy = 1000; // دقة افتراضية 1 كم

    // إضافة علامة الموقع الافتراضي
    userLocationMarker = L.marker(defaultLocation, {
        icon: L.divIcon({
            html: '<div class="user-location-marker default"><i class="fas fa-map-marker-alt"></i></div>',
            className: 'custom-div-icon user-location-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        }),
        zIndexOffset: 1000,
        title: 'الموقع الافتراضي (مركز المدينة)'
    }).addTo(map);

    map.setView(defaultLocation, 12);
    showSuccessMessage('تم استخدام موقع مركز المدينة كبديل.');

    // تحديث البحث حسب الموقع الافتراضي
    setTimeout(() => {
        filterAndDisplayBusinesses();
        highlightNearbyBusinesses();
    }, 500);
}

// ===========================================
// إعادة ضبط زر تحديد الموقع
// ===========================================
function resetLocateButton(locateBtn, originalHTML) {
    if (locateBtn) {
        setTimeout(() => {
            locateBtn.innerHTML = originalHTML || '<i class="fas fa-location-arrow"></i> موقعي';
            locateBtn.disabled = false;
        }, 1000);
    }
}

// ===========================================
// إبراز المؤسسات القريبة
// ===========================================
function highlightNearbyBusinesses() {
    if (!userLocation) return;

    const radiusSelect = document.getElementById('radius-select');
    const radius = radiusSelect ? parseInt(radiusSelect.value) * 1000 : 5000;

    markers.forEach(marker => {
        if (marker.businessData && marker.businessData.lat && marker.businessData.lng) {
            const distance = getDistance(
                userLocation[0], userLocation[1],
                marker.businessData.lat, marker.businessData.lng
            );

            if (distance <= radius) {
                // إضافة فئة للعلامات القريبة
                marker.getElement()?.classList?.add('nearby-marker');
            } else {
                marker.getElement()?.classList?.remove('nearby-marker');
            }
        }
    });
}

// ===========================================
// باقي الدوال (تم حذفها للإيجاز ولكن يجب أن تبقى كما هي)
// ===========================================
// [جميع الدوال الأخرى تبقى كما هي مع تعديلات طفيفة لتعمل مع التغييرات]
// مثل: showBusinessDetails, centerMapOnBusiness, displayBusinessDetails, etc.

// ===========================================
// عرض رسائل للمستخدم
// ===========================================
function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showMessage(message, type) {
    // إنشاء عنصر الرسالة إذا لم يكن موجوداً
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
        <button class="close-message" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    messageContainer.appendChild(messageElement);

    // إزالة الرسالة تلقائياً بعد 5 ثواني
    setTimeout(() => {
        if (messageElement.parentElement) {
            messageElement.remove();
        }
    }, 5000);
}

// ===========================================
// حساب المسافة بين إحداثيين (بالكيلومترات)
// ===========================================
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// ===========================================
// مسح جميع العلامات
// ===========================================
function clearAllMarkers() {
    markers.forEach(marker => {
        if (map) map.removeLayer(marker);
    });
    markers = [];
}

// ===========================================
// تهيئة الصفحة عند التحميل
// ===========================================
document.addEventListener('DOMContentLoaded', function () {
    try {
        // تهيئة الخريطة
        initMap();

        // عرض المؤسسات
        setTimeout(() => {
            if (businessesData && businessesData.length > 0) {
                displayBusinesses(businessesData);
                displayFeaturedBusinesses();
                updateResultsCount(businessesData.length);
            }
        }, 500);

        // إضافة مستمعي الأحداث للبحث
        setupEventListeners();

        // إغلاق النافذة المنبثقة
        setupModalClose();

        // إعداد القائمة المتنقلة
        setupMobileMenu();

        console.log('تم تحميل الصفحة بنجاح');
    } catch (error) {
        console.error('خطأ في تهيئة الصفحة:', error);
        showErrorMessage('حدث خطأ في تحميل الصفحة');
    }
});

// ===========================================
// إعداد مستمعي الأحداث
// ===========================================
function setupEventListeners() {
    // زر البحث
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', filterAndDisplayBusinesses);
    }

    // البحث عند الضغط على Enter
    const mainSearch = document.getElementById('main-search');
    if (mainSearch) {
        mainSearch.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                filterAndDisplayBusinesses();
            }
        });
    }

    // البحث التلقائي عند تغيير الفلاتر
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const radiusSelect = document.getElementById('radius-select');
    const locationSearch = document.getElementById('location-search');

    if (categorySelect) categorySelect.addEventListener('change', filterAndDisplayBusinesses);
    if (sortSelect) sortSelect.addEventListener('change', filterAndDisplayBusinesses);
    if (radiusSelect) radiusSelect.addEventListener('change', filterAndDisplayBusinesses);
    if (locationSearch) {
        locationSearch.addEventListener('change', filterAndDisplayBusinesses);
        locationSearch.addEventListener('keyup', debounce(filterAndDisplayBusinesses, 500));
    }

    // تحديث الخريطة عند تغيير الحجم
    window.addEventListener('resize', debounce(() => {
        if (map) map.invalidateSize();
    }, 250));
}

// ===========================================
// دالة Debounce لتحسين الأداء
// ===========================================
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

// ===========================================
// تصدير الدوال للاستخدام العالمي
// ===========================================
window.initMap = initMap;
window.showBusinessDetails = showBusinessDetails;
window.callNumber = callNumber;
window.getDirections = getDirections;
window.openInGoogleMaps = openInGoogleMaps;
window.filterAndDisplayBusinesses = filterAndDisplayBusinesses;
window.locateUser = locateUser;
window.resetSearch = resetSearch;

// ===========================================
// دوال الاختبار (للأغراض التنموية فقط)
// ===========================================
console.log('دعم تحديد الموقع:', !!navigator.geolocation);

// محاكاة النجاح (للاختبار فقط)
function simulateSuccess() {
    handleLocationSuccess({
        coords: {
            latitude: 36.7063956,
            longitude: 3.211357,
            accuracy: 50
        }
    });
}

// محاكاة الخطأ (للاختبار فقط)
function simulateError() {
    handleLocationError({
        code: 1,
        message: 'Permission denied'
    });
}

window.simulateSuccess = simulateSuccess;
window.simulateError = simulateError;