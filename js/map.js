/* =========================================
   map.service.js
   إدارة الخريطة (Leaflet فقط)
   ========================================= */

const MapService = (() => {

  let map;
  let markersLayer;
  let userMarker = null;

  /* =====================
     Public API
     ===================== */
  return {
    init,
    setMarkers,
    focusOn,
    locateUser,
    clear
  };

  /* =====================
     تهيئة الخريطة
     ===================== */
  function init() {
    if (map) return map;

    map = L.map('map', {
      zoomControl: true,
      minZoom: CONFIG.MAP.minZoom,
      maxZoom: CONFIG.MAP.maxZoom
    }).setView(
      CONFIG.MAP.defaultCenter,
      CONFIG.MAP.defaultZoom
    );

    L.tileLayer(CONFIG.APIS.LEAFLET_TILES, {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    return map;
  }

  /* =====================
     إضافة markers
     ===================== */
  function setMarkers(businesses = []) {
    clear();

    businesses.forEach(b => {
      if (!b.lat || !b.lng) return;

      const marker = L.marker([b.lat, b.lng], {
        title: b.name
      });

      marker.bindPopup(buildPopup(b));
      marker.addTo(markersLayer);
    });
  }

  /* =====================
     Popup محتوى
     ===================== */
  function buildPopup(b) {
    const category = CONFIG.CATEGORIES[b.category];

    return `
      <div class="map-popup">
        <h4>${b.name}</h4>
        <p>${category ? category.label : 'مؤسسة'}</p>
        ${b.address ? `<p>${b.address}</p>` : ''}
        <button class="popup-btn" data-id="${b.id}">
          عرض التفاصيل
        </button>
      </div>
    `;
  }

  /* =====================
     التركيز على نقطة
     ===================== */
  function focusOn(lat, lng, zoom = 16) {
    if (!map) return;
    map.setView([lat, lng], zoom);
  }

  /* =====================
     تحديد موقع المستخدم
     ===================== */
  function locateUser() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;

      if (userMarker) {
        map.removeLayer(userMarker);
      }

      userMarker = L.circleMarker([latitude, longitude], {
        radius: 8,
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.8
      }).addTo(map);

      focusOn(latitude, longitude, 14);
    });
  }

  /* =====================
     تنظيف markers
     ===================== */
  function clear() {
    if (markersLayer) {
      markersLayer.clearLayers();
    }
  }

})();
