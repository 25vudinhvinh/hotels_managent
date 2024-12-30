const hotelsFilterNear = []
const markers = {}

const myIcon = L.icon({
    iconUrl: 'img/custom-icon.svg',
    iconSize: [50, 95],
})

const map = L.map('map',{
    zoomControl: false
}) 

map.setView([21.06150053899966, 105.80904948088516], 10); 



// set view when click 
function setViewUserLocation(){
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        map.flyTo([userLat, userLng], 16); 
        L.marker([userLat, userLng], {icon: myIcon}).addTo(map)
    })
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

L.control.zoom({
    position: 'bottomright' 
}).addTo(map);


// fetch data from API
function fetchData() {
    // loi sua thanh api
        return fetch('/hotelandservice')
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
        const latitude = parseFloat(hotel.latitude)
        const longitude = parseFloat(hotel.longitude)
        const marker = L.marker([latitude, longitude]).addTo(map);

        // service
        const servicesHTML = hotel.services.map(service => `
            <div class="popup-service">
                <div class="popup-service-icon">${service.service_icon}</div>
                <div class="popup-service-text">${service.service_name}</div>
            </div>
        `).join('')
        // popup marker
        const popupContent = `
        <div class="popup-content">
            <span class="popup-heading">${hotel.hotel_name}</span>
            <div class="popup-image">
                <img src="${hotel.image}" alt="hinh anh" onerror="this.onerror=null; this.src='/img/default-img.jpg';"/>
            </div>
            <div class="popup-star-name">
                <h4 class="popup-title">${hotel.hotel_name}</h4>
                <p>Khách sạn ${hotel.star} sao</p>
                <button onclick="showDirectToHotel(${latitude}, ${longitude})" id="direction"><i class="fa-solid fa-diamond-turn-right"></i> Đường đi</button>
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
                <div class="popup-service-wrap">${servicesHTML}</div>
            </div>
        </div>
        `;
        marker.bindPopup(popupContent);
        markers[String(hotel.hotel_id)] = marker;
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
                searchHotelInfor.setAttribute('data-name', hotel.hotel_name);
                searchHotelInfor.setAttribute('data-lat', hotel.latitude);
                searchHotelInfor.setAttribute('data-lng', hotel.longitude);
                searchHotelInfor.setAttribute('data-star', hotel.star);
                searchHotelInfor.setAttribute('data-price', hotel.price);
                searchHotelInfor.setAttribute('hotel-id', hotel.hotel_id);
                // show popup whin click hotel
                searchHotelInfor.addEventListener('click', ()=>{
                    const hotelId = searchHotelInfor.getAttribute('hotel-id')
                    map.flyTo([hotel.latitude,hotel.longitude], 14)
                    markers[hotelId].openPopup();
                })
                  searchHotelInfor.innerHTML = `
                    <div class="search-infor-total">
                    <h4>${hotel.hotel_name}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> ${hotel.district}, ${hotel.city}</p>
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
                if(distance < 10){
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
            hotelsFilterNear.push(hotel)
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


// routing
function showDirectToHotel(endLat, endLng) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const startLat = position.coords.latitude;
        const startLng = position.coords.longitude;
  

        L.marker([startLat, startLng], { icon: myIcon }).addTo(map);
  

        const controlRouter = L.Routing.control({
          waypoints: [
            L.latLng(startLat, startLng),
            L.latLng(endLat, endLng)
          ],
          routeWhileDragging: true,
          showAlternatives: true,
          createMarker: function(i, waypoint) {
            const marker = L.marker(waypoint.latLng, { icon: myIcon }); 
            marker.bindPopup(`Waypoint ${i + 1}`); 
            return null;
          }
        }).addTo(map);

        map.flyTo([startLat, startLng], 14);
      },
      (error) => {
        alert("Không thể lấy vị trí của bạn: " + error.message);
      }
    );
  }