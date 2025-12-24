class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userMarker = null;
        this.businessLayer = null;
    }
    
    init(containerId = 'map') {
        // إنشاء الخريطة
        this.map = L.map(containerId).setView(
            CONFIG.MAP.defaultCenter, 
            CONFIG.MAP.defaultZoom
        );
        
        // إضافة طبقة الخريطة
        L.tileLayer(CONFIG.MAP.tileLayer, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // إضافة تحكمات
        this.addControls();
        
        return this.map;
    }
    
    // إضافة علامات للمؤسسات
    addBusinessMarkers(businesses) {
        // إزالة العلامات القديمة
        this.clearBusinessMarkers();
        
        if (!businesses || businesses.length === 0) {
            this.showNoResultsMessage();
            return;
        }
        
        // إنشاء مجموعة للعلامات
        this.businessLayer = L.layerGroup().addTo(this.map);
        
        businesses.forEach(business => {
            const marker = this.createBusinessMarker(business);
            marker.addTo(this.businessLayer);
            this.markers.push(marker);
        });
        
        // ضبط العرض ليشمل جميع العلامات
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
    
    createBusinessMarker(business) {
        const icon = L.divIcon({
            html: `
                <div class="business-marker ${business.category}">
                    <i class="${this.getCategoryIcon(business.category)}"></i>
                    <div class="marker-tooltip">${business.name}</div>
                </div>
            `,
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        const marker = L.marker([business.lat, business.lng], { icon });
        
        // إضافة معلومات عند النقر
        marker.bindPopup(this.createPopupContent(business), {
            maxWidth: 300,
            minWidth: 250
        });
        
        return marker;
    }
    
    createPopupContent(business) {
        return `
            <div class="business-popup">
                <h3>${business.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${business.address || 'عنوان غير متوفر'}</p>
                ${business.phone ? `<p><i class="fas fa-phone"></i> ${business.phone.join(', ')}</p>` : ''}
                <div class="popup-actions">
                    <button onclick="app.navigateToDetails('${business.id}')">
                        <i class="fas fa-info-circle"></i> تفاصيل
                    </button>
                    <button onclick="app.getDirections(${business.lat}, ${business.lng})">
                        <i class="fas fa-directions"></i> اتجاهات
                    </button>
                </div>
            </div>
        `;
    }
    
    // تحديد موقع المستخدم
    locateUser() {
        if (!navigator.geolocation) {
            alert('المتصفح لا يدعم خدمة تحديد الموقع');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                // إزالة العلامة القديمة
                if (this.userMarker) {
                    this.map.removeLayer(this.userMarker);
                }
                
                // إضافة علامة المستخدم
                this.userMarker = L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        html: '<div class="user-location-marker"><i class="fas fa-location-arrow"></i></div>',
                        className: 'user-marker',
                        iconSize: [40, 40]
                    })
                }).addTo(this.map);
                
                // تكبير إلى موقع المستخدم
                this.map.setView([latitude, longitude], 14);
                
                // تحديث نتائج البحث حسب الموقع
                app.searchNearby(latitude, longitude);
            },
            (error) => {
                console.error('خطأ في تحديد الموقع:', error);
                alert('تعذر تحديد موقعك. تأكد من تفعيل خدمة الموقع.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    clearBusinessMarkers() {
        if (this.businessLayer) {
            this.map.removeLayer(this.businessLayer);
            this.businessLayer = null;
        }
        this.markers = [];
    }
    
    addControls() {
        // زر تحديد الموقع
        L.control.locate({
            position: 'topright',
            strings: {
                title: "تحديد موقعي"
            }
        }).addTo(this.map);
        
        // التحكم بالتكبير
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);
    }
    
    getCategoryIcon(category) {
        const icons = {
            hospital: 'fas fa-hospital',
            clinic: 'fas fa-clinic-medical',
            pharmacy: 'fas fa-prescription-bottle-alt',
            doctor: 'fas fa-user-md',
            dentist: 'fas fa-tooth',
            laboratory: 'fas fa-flask',
            default: 'fas fa-map-marker-alt'
        };
        return icons[category] || icons.default;
    }
    
    showNoResultsMessage() {
        const bounds = this.map.getBounds();
        const center = bounds.getCenter();
        
        L.marker(center, {
            icon: L.divIcon({
                html: '<div class="no-results-message"><i class="fas fa-search"></i> لا توجد نتائج</div>',
                className: 'no-results',
                iconSize: [200, 50]
            }),
            interactive: false
        }).addTo(this.map).openPopup();
    }
}