let fetchedData = null; 


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


// Hàm fetch dữ liệu từ API
function fetchData() {
        return fetch('/api')
            .then(res => 
                res.json())
            .then(data => { 
                return data;
            })
            .catch(error => {
                console.error("Lỗi khi fetch dữ liệu:", error);
                throw error;
            });
}

// Hàm xử lý dữ liệu và hiển thị trên bản đồ
function displayMarkers(data) {
    data.forEach(hotel => {
        const latitude = hotel.latitude;
        const longitude = hotel.longitude;
        const marker = L.marker([latitude, longitude]).addTo(map);
        // popup marker
        const popupContent = `
        <div class="popup-content">
            <span class="popup-heading">${hotel.name}</span>
            <div class="popup-image">
                <img src="${hotel.image}" alt="hinh anh" onerror="this.onerror=null; this.src='/img/default-img.jpg';"/>
            </div>
            <div class="popup-star-name">
                <h4 class="popup-title">${hotel.name}</h4>
                <p>Khách sạn ${hotel.star} sao</p>
            </div>
            <div class="popup-infor">
                <h4 class="popup-title">Thông tin</h4>
                <div class="popup-infor-hotel">
                    <div class="popup-infor-icon">
                        <span><i class="fa-solid fa-location-dot"></i></span>
                    </div>
                    <div class="popup-infor-total">${hotel.address}</div>
                </div>
                <div class="popup-infor-hotel">
                    <div class="popup-infor-icon"><i class="fa-solid fa-earth-asia"></i></div>
                    <div class="popup-infor-total">
                        <a href="${hotel.hotel_web}">${hotel.hotel_web}</a>
                    </div>
                </div>
                <div class="popup-infor-hotel">
                    <div class="popup-infor-icon"><i class="fa-solid fa-phone"></i></div>
                    <div class="popup-infor-total">+84 ${hotel.number_phone}</div>
                </div>
                <div class="popup-infor-hotel">
                    <div class="popup-infor-icon"><i class="fa-solid fa-tag"></i></div>
                    <div class="popup-infor-total">${hotel.price}</div>
                </div>
            </div>
            <div class="popup-desc">
                <h4 class="popup-title">Dịch vụ</h4>
                <div class="popup-service-wrap">
                    <div class="popup-service">
                        <div class="popup-service-icon"><i class="fa-solid fa-wifi"></i></div>
                        <div class="popup-service-text">Wi-Fi miễn phí</div>
                    </div>
                    <div class="popup-service">
                        <div class="popup-service-icon"><i class="fa-solid fa-martini-glass-empty"></i></div>
                        <div class="popup-service-text">Bữa sáng có tính phí</div>
                    </div>
                    <div class="popup-service">
                        <div class="popup-service-icon"><i class="fa-solid fa-p"></i></div>
                        <div class="popup-service-text">Đỗ xe miễn phí</div>
                    </div>
                    <div class="popup-service">
                        <div class="popup-service-icon"><i class="fa-solid fa-snowflake"></i></div>
                        <div class="popup-service-text">Có điều hòa nhiệt độ</div>
                    </div>
                </div>
            </div>
        </div>
        `;
        marker.bindPopup(popupContent);
    });
}


fetchData()
    .then(data => {
        displayMarkers(data);
        showBodySearch(data);
    });

    
// seach-body
function showBodySearch(data){
    console.log(data)
    const bodySearch = document.querySelector('.body-section')
    if(bodySearch){
        data.forEach(hotel => {
            const searchHotelInfor = document.createElement('div')
            if(searchHotelInfor){
                bodySearch.appendChild(searchHotelInfor)
                searchHotelInfor.className = 'search-infor-hotel'
                searchHotelInfor.innerHTML = `
                    <div class="search-infor-total">
                    <h4>${hotel.name}</h4>
                    <p>Khách sạn ${hotel.star} sao</p>
                    <p>${hotel.price}</p>
                    </div>
                    <div class="search-infor-img">
                    <img src="${hotel.image}" alt="hinh anh" onerror="this.onerror=null; this.src='/img/default-img.jpg';"/>
                    </div>
                `
            }else{
                console.log('loi')
            }

        })
    }
}
