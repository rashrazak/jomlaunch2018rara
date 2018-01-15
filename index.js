var latlang = document.getElementById('latlang');
var dataAdress ;     
function GoogleMap(position) {
  var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  var locationx = position.coords.latitude +','+position.coords.longitude;
  //var locationx = '2.920833, 101.655944';
   latlang.innerHTML= location;
   
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 20,
    center:origin,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var marker = new google.maps.Marker({
    map: map,
    position: location,
    animation: google.maps.Animation.DROP,
    title: "This is your location",
    draggable: true
  });
  
 
  google.maps.event.addListener(marker, 'dragend', function (event) {
    var latx = this.getPosition().lat();
    var lngx = this.getPosition().lng();

    getInfo(latx,lngx);
    


   
}); 

function getInfo(latx,lngx){

  test(latx,lngx);
  var infowindow = new google.maps.InfoWindow({
    content: 'Latitude: ' + latx + '<br>Longitude: ' + lngx+`<br> <button onclick="saveIt(${latx},${lngx})">SaVe</button>`
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
    

}




  map.setCenter(location);
}
function showError() {
 alert("Location can't be found");
}
// execute geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(GoogleMap, showError);
  } else {
  alert("Your browser does not support Geolocation.");
}


function test(latx, lngx){
var test = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latx},${lngx}`;

axios.get(test,{
params:{
  sensor:true,
  key:'AIzaSyDHvDCYAOpANRIalajys5rDjgV1xNN4Axs'
  
}
})
.then(function(response){
// Log full response
console.log(response);

// Formatted Address
dataAdress = response.data.results; //output value
var formattedAddress = response.data.results[0].formatted_address;
var formattedAddressOutput = `
  <ul class="list-group">
    <li class="list-group-item">${formattedAddress}</li>
  </ul>
`;

// Address Components
var addressComponents = response.data.results[0].address_components;
var addressComponentsOutput = '<ul class="list-group">';
for(var i = 0;i < addressComponents.length;i++){
  addressComponentsOutput += `
    <li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
  `;
}
addressComponentsOutput += '</ul>';

// Geometry
var lat = response.data.results[0].geometry.location.lat;
var lng = response.data.results[0].geometry.location.lng;
var geometryOutput = `
  <ul class="list-group">
    <li class="list-group-item"><strong>Latitude</strong>: ${lat}</li>
    <li class="list-group-item"><strong>Longitude</strong>: ${lng}</li>
  </ul>
`;

// Output to app
document.getElementById('formatted-address').innerHTML = formattedAddressOutput;
document.getElementById('address-components').innerHTML = addressComponentsOutput;
document.getElementById('geometry').innerHTML = geometryOutput;
})
.catch(function(error){
console.log(error);
});

}

//click handler 


// Initialize Firebase
var config = {
 apiKey: "AIzaSyCsT8dtpnQGF9ud-t69HWoued8aEjss338",
 authDomain: "test2-5698d.firebaseapp.com",
 databaseURL: "https://test2-5698d.firebaseio.com",
 projectId: "test2-5698d",
 storageBucket: "test2-5698d.appspot.com",
 messagingSenderId: "948114249723"
};
firebase.initializeApp(config);

var refx = firebase.database();

//home
function saveIt(locationx,locationy){
  var place = prompt("What is this place?");
  var address = dataAdress;
    console.log(address);
  refx.ref().child('myplace/'+place).set(address);
}

//office