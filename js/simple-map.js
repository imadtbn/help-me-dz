// ملف خريطة مبسط
let map = null;
let userMarker = null;

function initMap() {
    try {
        console.log('جاري تهيئة الخريطة...');
        
        // التحقق من وجود عنصر الخريطة
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('❌ عنصر الخريطة غير موجود');
            return;
        }
        
        // التحقق من تحميل Leaflet
        if (typeof L === 'undefined') {
            console.error('❌ مكتبة Leaflet غير محملة');
            return;
        }
        
        // إحداثيات الجزائر العاصمة
        const algeriaCenter = [36.7538, 3.0588];
        
        // إنشاء الخريطة
        map = L.map('map').setView(algeriaCenter, 12);
        
        // إضافة طبقة الخريطة
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            minZoom: 6
        }).addTo(map);
        
        // إضافة علامات تجريبية
        addSampleMarkers();
        
        // إعداد التحكمات
        setupMapControls();
        
        console.log('✅ الخريطة جاهزة للاستخدام');
        
    } catch (error) {
        console.error('❌ خطأ في الخريطة:', error);
    }
}

function addSampleMarkers() {
    // بيانات تجريبية
    const sampleLocations = [
        {
            name: "مستشفى مصطفى باشا",
            lat: 36.7631,
            lng: 3.0506,
            type: "hospital"
        },
        {
            name: "صيدلية الأمل",
            lat: 36.7489,
            lng: 3.0588,
            type: "pharmacy"
        },
        {
            name: "عيادة النور",
            lat: 36.7395,
            lng: 3.0352,
            type: "clinic"
        }
    ];
    
    sampleLocations.forEach(location => {
        const icon = L.divIcon({
            html: `<div class="map-marker ${location.type}">
                      <i class="fas fa-${getIconForType(location.type)}"></i>
                   </div>`,
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        L.marker([location.lat, location.lng], { icon })
            .addTo(map)
            .bindPopup(`<b>${location.name}</b><br>${location.type === 'hospital' ? 'مستشفى' : location.type === 'pharmacy' ? 'صيدلية' : 'عيادة'}`);
    });
}

function getIconForType(type) {
    const icons = {
        'hospital': 'hospital',
        'pharmacy': 'prescription-bottle-alt',
        'clinic': 'clinic-medical',
        'doctor': 'user-md',
        'default': 'map-marker-alt'
    };
    return icons[type] || icons.default;
}

function setupMapControls() {
    // تكبير
    const zoomIn = document.getElementById('zoom-in');
    if (zoomIn) {
        zoomIn.addEventListener('click', () => map.zoomIn());
    }
    
    // تصغير
    const zoomOut = document.getElementById('zoom-out');
    if (zoomOut) {
        zoomOut.addEventListener('click', () => map.zoomOut());
    }
    
    // تحديد الموقع
    const locateBtn = document.getElementById('locate-me');
    if (locateBtn) {
        locateBtn.addEventListener('click', locateUser);
    }
    
    // ملء الشاشة
    const fullscreenBtn = document.getElementById('fullscreen-map');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
}

function locateUser() {
    if (!navigator.geolocation) {
        alert('المتصفح لا يدعم خدمة تحديد الموقع');
        return;
    }
    
    const locateBtn = document.getElementById('locate-me');
    const originalHtml = locateBtn.innerHTML;
    
    locateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديد...';
    locateBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userPos = [position.coords.latitude, position.coords.longitude];
            
            // إزالة العلامة القديمة
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            // إضافة علامة جديدة
            userMarker = L.marker(userPos, {
                icon: L.divIcon({
                    html: '<div class="user-marker"><i class="fas fa-location-arrow"></i></div>',
                    className: 'user-marker-icon',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                })
            }).addTo(map);
            
            // التمركز
            map.setView(userPos, 15);
            
            // إضافة دائرة الدقة
            L.circle(userPos, {
                color: '#4285f4',
                fillColor: '#4285f4',
                fillOpacity: 0.2,
                radius: position.coords.accuracy || 50
            }).addTo(map);
            
            // إعادة ضبط الزر
            locateBtn.innerHTML = originalHtml;
            locateBtn.disabled = false;
            
            console.log('✅ تم تحديد الموقع:', userPos);
        },
        (error) => {
            console.error('❌ خطأ في تحديد الموقع:', error);
            alert('تعذر تحديد موقعك. تأكد من تفعيل خدمة الموقع.');
            
            locateBtn.innerHTML = originalHtml;
            locateBtn.disabled = false;
        }
    );
}

function toggleFullscreen() {
    const mapElement = document.getElementById('map');
    const btn = document.getElementById('fullscreen-map');
    
    if (!document.fullscreenElement) {
        if (mapElement.requestFullscreen) {
            mapElement.requestFullscreen();
        }
        if (btn) {
            btn.innerHTML = '<i class="fas fa-compress"></i>';
            btn.title = 'تصغير الخريطة';
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        if (btn) {
            btn.innerHTML = '<i class="fas fa-expand"></i>';
            btn.title = 'تكبير الخريطة';
        }
    }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMap, 100); // تأخير بسيط لضمان تحميل Leaflet
});