 // Khởi tạo bản đồ
 const map = L.map('map').setView([21.0550448,105.7400093], 20); 

 // Thêm lớp bản đồ
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '© OpenStreetMap'
 }).addTo(map);