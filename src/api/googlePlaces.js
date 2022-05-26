
// let map; 
// let service; 
// let infoWindow; 

// function initMap({lat, long}){
//     const location = new google.maps.LatLng(lat, long);

//     infoWindow = new google.maps.InfoWindow();

//     map = new google.maps.Map(
//         document.getElementById(`map`), {center: location, zoom: 15}
//     )

//     const request = {
//         query: 'basketball court',
//         fields: ['name', 'geometry']
//     }

//     service = new google.maps.places.PlacesService(map)

//     service.findPlaceFromQuery(request, function(results, status){
//         if(status === google.maps.places.PlacesService.OK && results){
//             for (let i = 0; i < results.length; i++){
//                 createMarker(results[i])
//             }
//             map.setCenter(results[0].geometry.location)
//         }
//     })
// }

// function createMarker(place){
//     if(!place.geometry || !place.geometry.location) return;

//     const marker = new google.maps.Marker({
//         map, 
//         position: place.geometry.location, 
//     })

//     google.maps.event.addListener(marker, "click", () => {
//         infoWindow.setContent(place.name || "");
//         infoWindow.open(map);
//     })
// }

// export default initMap; 