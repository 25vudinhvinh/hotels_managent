const map = L.map('map',{
    zoomControl: false
}).setView([21.0550448, 105.7400093], 15); // Đặt vị trí và độ zoom ban đầu


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

L.control.zoom({
    position: 'bottomright' // Vị trí dưới cùng bên phải
}).addTo(map);

fetch('/api')
    .then(res =>{
        return res.json()
    })
    .then(data =>{
        data.forEach(location => {
            const {longitude, latitude} = location
            L.marker([latitude, longitude]).addTo(map);
        });
    })
