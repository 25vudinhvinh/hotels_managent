const hotelsFilterNear = []
let hotelsFilterStar = []
let hotelsFilterPrice = []

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


// fetch data from API
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

fetchData()
    .then(data => {
        displayMarkers(data);
        showHotelSearch(data);
    });

// show popup infor hotel on marker
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
                    <div class="popup-infor-total">${hotel.price}đ</div>
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



    
// seach-body and set attribute 
function showHotelSearch(data){
    const bodySearch = document.querySelector('.body-section')
    if(bodySearch){
          data.forEach(hotel => {
            const searchHotelInfor = document.createElement('div')
                bodySearch.appendChild(searchHotelInfor)
                searchHotelInfor.className = 'search-infor-hotel'
                searchHotelInfor.setAttribute('data-name', hotel.name);
                searchHotelInfor.setAttribute('data-lat', hotel.latitude);
                searchHotelInfor.setAttribute('data-lng', hotel.longitude);
                searchHotelInfor.setAttribute('data-star', hotel.star);
                searchHotelInfor.setAttribute('data-price', hotel.price);
                  searchHotelInfor.innerHTML = `
                    <div class="search-infor-total">
                    <h4>${hotel.name}</h4>
                    <p>Khách sạn ${hotel.star} sao</p>
                    <p>${hotel.price}đ</p>
                    <p class="text-distance"></p>
                    </div>
                    <div class="search-infor-img">
                    <img src="${hotel.image}" alt="hinh anh" onerror="this.onerror=null; this.src='/img/default-img.jpg';"/>
                    </div>
                `
        })
    }
}

// toggle search box
const toggleSearchBtn = ()=>{
    const headerBtn = document.querySelector('.header-btn-search')
    const searchWrap = document.querySelector('.search-wrap')
    headerBtn.classList.toggle('hover')
    if( searchWrap.style.display==='block'){
        searchWrap.style.display='none'
    }else{
        searchWrap.style.display='block'
    } 
}   

// reload when click home
const homeRefest = ()=>{
    const homeBtn = document.querySelector('.header-btn-home')
    if(homeBtn){
     location.reload()
    }
} 

// input search 
// handle and show search result
function handleSearchResult(){
    deleteFilter()
    const hotels = document.querySelectorAll('.search-infor-hotel')
    const inputSearch = document.querySelector('#search-input')
    const searchTerm = removeAccents(inputSearch.value.toLowerCase().trim())
    hotels.forEach(hotel =>{
        const hotelName = removeAccents(hotel.getAttribute('data-name').toLowerCase())
        if(hotelName.includes(searchTerm)){
            hotel.style.display = ''
        }else{
            hotel.style.display = 'none'
        }
    })
}


// remove accents for search and hotel name
function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }



// Calculate distance to hotel
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; //km
  }

//   find nearby hotel
const nearbyBtn = document.querySelector('#nearby-btn')
function findNearbyHotels(){
    nearbyBtn.classList.add('active')
    if(nearbyBtn){
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const hotelToUse = hotelsFilterNear.length > 0 ? hotelsFilterNear : Array.from(document.querySelectorAll('.search-infor-hotel'))
            hotelToUse.forEach(hotel =>{
                const hotelLat = parseFloat(hotel.getAttribute('data-lat'))
                const hotelLng = parseFloat(hotel.getAttribute('data-lng'))
                const distance = (calculateDistance(userLat, userLng, hotelLat, hotelLng)).toFixed(2)
                if(distance < 3){
                    const textDistance = hotel.querySelector('.text-distance')
                    textDistance.innerText = `Cách bạn ${distance}km`
                    hotelsFilterNear.push(hotel)
                    hotel.style.display = ''
                }else{
                    hotel.style.display = 'none'
                }
            })
        })
}}

console.log(hotelsFilterNear)
// bug gan ban > sao > succc || sao > gan ban > erorr mai fix
// function filter star
function filterStar(){
    const starSelect = document.querySelector('#star')
    const starChecked = starSelect.value
    const hotelToUse = hotelsFilterNear.length > 0 ? hotelsFilterNear : Array.from(document.querySelectorAll('.search-infor-hotel'))
    hotelToUse.forEach(hotel =>{
        const hotelStar = hotel.getAttribute('data-star')
        if(starChecked == hotelStar){
            hotel.style.display = ''
        }else{
            hotel.style.display = 'none'
        }
    })
}

// function find price 
function findPriceHotels(){
    const priceSelect = document.querySelector('#price')
    const priceChecked = priceSelect.value
    const hotelToUse = hotelsFilterNear.length > 0 ? hotelsFilterNear : Array.from(document.querySelectorAll('.search-infor-hotel'))
    hotelToUse.forEach(hotel =>{
        const hotelPrice = parseFloat(hotel.getAttribute('data-price')) 
       if(priceChecked === 'below-1m'){
        hotel.style.display = hotelPrice < 1000000 ? '' : 'none'
       }else if (priceChecked === 'above-1m'){
        hotel.style.display = hotelPrice > 1000000 ? '' : 'none'
       }else{
        hotel.style.display = ''
       }

    })
}

// delete filter
function deleteFilter(){
    const deleteFilter = document.querySelector('#delete-filter-btn')
    if(deleteFilter){
        removeNearBy()
        enableSelect()
    }
}

// remove nearby button
function removeNearBy(){
        nearbyBtn.classList.remove('active')
        document.querySelectorAll('.search-infor-hotel').forEach(hotel =>{
            hotel.style.display = ''
             const textDistance = hotel.querySelector('.text-distance')
                textDistance.innerText = ''
        })
}


// undisable select 
function enableSelect(){
    const selectAll = document.querySelectorAll('select')
    selectAll.forEach(select =>{
        select.selectedIndex = 0
    })
}
