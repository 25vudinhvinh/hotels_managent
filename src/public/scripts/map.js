const map = L.map('map',{
    zoomControl: false
}).setView([21.0550448, 105.7400093], 12); 


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

L.control.zoom({
    position: 'bottomright' 
}).addTo(map);

fetch('/api')
    .then(res =>{
        return res.json()
    })
    .then(data =>{
        data.forEach(hotels => {
            const latitude = hotels.latitude
            const longitude = hotels.longitude
            const marker = L.marker([latitude, longitude]).addTo(map);

            // popup marker
            const popupContent = `
                <div class="popup-content">
                <span class="popup-heading">${hotels.name}</span>

                <div class="popup-image">
                <img src="${hotels.image}" alt="hinh anh"/>
                </div>

                <div class="popup-star-name">
                <h4 class="popup-title">${hotels.name}</h4>
                <p>Khách sạn ${hotels.star} sao</p>
                </div>

                <div class="popup-infor">
                <h4 class="popup-title">Thông tin</h4>

                <div class="popup-infor-hotel">
                <div class="popup-infor-icon"> 
                <span>
                <i class="fa-solid fa-location-dot"></i>
                </span>
                </div>
                <div class="popup-infor-total">${hotels.address}</div>
                </div>

                  <div class="popup-infor-hotel">
                <div class="popup-infor-icon"> <i class="fa-solid fa-earth-asia"></i> </div>
                <div class="popup-infor-total">
                <a href="${hotels.hotel_web}">${hotels.hotel_web}</a>
                </div>
                </div>

                  <div class="popup-infor-hotel">
                <div class="popup-infor-icon"> <i class="fa-solid fa-phone"></i></div>
                <div class="popup-infor-total">+84 ${hotels.number_phone}</div>
                </div>

                  <div class="popup-infor-hotel">
                <div class="popup-infor-icon"> <i class="fa-solid fa-tag"></i></div>
                <div class="popup-infor-total">${hotels.price}</div>
                </div>

                </div>

                <div class="popup-desc">
                <h4 class="popup-title">Dịch vụ</h4>

                <div class="popup-service-wrap">
                <div class="popup-service">
                    <div class="popup-service-icon">
                    <i class="fa-solid fa-wifi"></i>
                    </div>
                    <div class="popup-service-text">Wi-Fi miễn phí</div>
                    </div>

                    <div class="popup-service">
                    <div class="popup-service-icon">
                    <i class="fa-solid fa-martini-glass-empty"></i>
                    </div>
                    <div class="popup-service-text">Bữa sáng có tính phí</div>
                    </div>

                    <div class="popup-service">
                    <div class="popup-service-icon">
                    <i class="fa-solid fa-p"></i>
                    </div>
                    <div class="popup-service-text">Đỗ xe miễn phí</div>
                    </div>

                    <div class="popup-service">
                    <div class="popup-service-icon">
                   <i class="fa-solid fa-snowflake"></i>
                    </div>
                    <div class="popup-service-text">Có điều hòa nhiệt độ</div>
                    </div>
                </div>
                    
                </div>
                </div>
            `

            marker.bindPopup(popupContent)
        });
    })
