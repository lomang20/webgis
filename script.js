function initMapSwalayan() {
  if (document.getElementById('map')) {
    // Inisialisasi peta
    var map = L.map('map').setView([-9.467, 124.482], 14);

    // Tile layer OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ikon marker warna
    var blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    var greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    // Data lokasi
    var dataToko = [
      // Indomart (biru)
      { name: "Indomart Pasar Lama", lat: -9.4466, lon: 124.4789, icon: blueIcon, category: "Indomart" },
      { name: "Indomart Terminal", lat: -9.467001512730855, lon: 124.48304626646598, icon: blueIcon, category: "Indomart" },
      { name: "Indomart Nasleu", lat: -9.458461645403911, lon: 124.48284831722135, icon: blueIcon, category: "Indomart" },
      { name: "Indomart KM 7", lat: -9.509750913063025, lon: 124.49196946757847, icon: blueIcon, category: "Indomart" },
      { name: "Indomart KM 4", lat: -9.471070729194757,  lon: 124.48182335521722, icon: blueIcon, category: "Indomart" },

      // Alfamart (merah)
      { name: "Alfamart Maubeli", lat: -9.485053840839477, lon: 124.48908474122868, icon: redIcon, category: "Alfamart" },
      { name: "Alfamart El Tari", lat: -9.460917159678027, lon: 124.4800970075803, icon: redIcon, category: "Alfamart" },
      { name: "Alfamart Terminal", lat: -9.467025525844084, lon: 124.48316084219395, icon: redIcon, category: "Alfamart" },
      { name: "Alfamart Nasleu", lat: -9.458215003463636, lon: 124.48207735703295, icon: redIcon, category: "Alfamart" },
      { name: "Alfamart KM 6", lat: -9.492823824993225, lon: 124.492705017313, icon: redIcon, category: "Alfamart" },
      { name: "Alfamart Dalehi", lat: -9.476235936223185, lon: 124.48278424110593, icon: redIcon, category: "Alfamart" },

      // Swalayan lainnya (hijau)
      { name: "Jabalmart", lat: -9.446631635707002, lon: 124.4789545609011, icon: greenIcon, category: "Swalayan" },
      { name: "KCS Mart", lat: -9.468687273592874, lon: 124.48161274188922, icon: greenIcon, category: "Swalayan" },
      { name: "Happy Swalayan", lat: -9.452622746956953, lon: 124.47754115954848, icon: greenIcon, category: "Swalayan" },
      { name: "Lay", lat: -9.46601315660902, lon: 124.48074220974188, icon: greenIcon, category: "Swalayan" },
      { name: "Central", lat: -9.467246449994937, lon: 124.4813133386215, icon: greenIcon, category: "Swalayan" }
    ];

    // Layer untuk pencarian
    var markersLayer = new L.LayerGroup();
    map.addLayer(markersLayer);

    // Simpan marker untuk filtering
    var markerRefs = [];

    // Tambahkan semua marker
    dataToko.forEach(function(toko) {
      var marker = L.marker([toko.lat, toko.lon], { icon: toko.icon })
        .bindPopup(`<b>${toko.name}</b><br>Kategori: ${toko.category}`);
      marker.category = toko.category;
      marker.tokoName = toko.name; // Untuk pencarian manual
      markersLayer.addLayer(marker);
      markerRefs.push(marker);
    });

    // Fitur pencarian dengan input custom
    function searchMarkers(keyword) {
      var found = false;
      markerRefs.forEach(function(marker) {
        var name = marker.tokoName.toLowerCase();
        if (keyword && name.includes(keyword.toLowerCase())) {
          map.setView(marker.getLatLng(), 17);
          marker.openPopup();
          found = true;
        } else {
          marker.closePopup();
        }
      });
      // Jika tidak ditemukan, tidak melakukan apa-apa
    }

    // Integrasi input pencarian dengan event
    var searchInput = document.getElementById('search');
    var searchBtn = document.getElementById('searchBtn');
    if (searchInput) {
      searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
          searchMarkers(searchInput.value);
        }
      });
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        searchMarkers(searchInput.value);
      });
    }

    // Filter functions
    function showAllMarkers() {
      markerRefs.forEach(function(marker) {
        if (!map.hasLayer(marker)) map.addLayer(marker);
      });
    }
    function showMarkersByCategory(category) {
      markerRefs.forEach(function(marker) {
        if (marker.category === category) {
          if (!map.hasLayer(marker)) map.addLayer(marker);
        } else {
          if (map.hasLayer(marker)) map.removeLayer(marker);
        }
      });
    }

    // Button event listeners
    function setActiveButton(btnId) {
      document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
      document.getElementById(btnId).classList.add('active');
    }

    document.getElementById('showAll').addEventListener('click', function() {
      showAllMarkers();
      setActiveButton('showAll');
    });
    document.getElementById('showIndomart').addEventListener('click', function() {
      showMarkersByCategory('Indomart');
      setActiveButton('showIndomart');
    });
    document.getElementById('showAlfamart').addEventListener('click', function() {
      showMarkersByCategory('Alfamart');
      setActiveButton('showAlfamart');
    });
    document.getElementById('showSwalayan').addEventListener('click', function() {
      showMarkersByCategory('Swalayan');
      setActiveButton('showSwalayan');
    });

    // Tampilkan semua marker saat load
    showAllMarkers();
  }
}

// Panggil otomatis jika #map sudah ada saat halaman pertama kali dimuat
initMapSwalayan();

// Sidebar toggle (tetap di luar)
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const toggleBtnFixed = document.getElementById('sidebarToggleFixed');

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('closed');
    document.body.classList.toggle('sidebar-closed');
  });
}
if (toggleBtnFixed && sidebar) {
  toggleBtnFixed.addEventListener('click', function() {
    sidebar.classList.toggle('closed');
    document.body.classList.toggle('sidebar-closed');
  });
}