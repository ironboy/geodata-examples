document.body.innerHTML = `
  <h1>Search by map</h1>
  <p>Choose a radius and click on a location on the map to search:</p>
  <label>Radius:
    <select name="radius">
      <option value="10">10 km</option>
      <option value="25">25 km</option>
      <option value="50" selected>50 km</option>
      <option value="100">100 km</option>
      <option value="1000">1000 km</option>
    </select>
  </label>
  <div id="map"></div>
  <article class="searchResult">
    <!-- Show search results here-->
  </article>
`;

// Position on map
// (around Alicante, Spain)
let myPosition = {
  lat: 38.3502086913537,
  lng: -0.504140513818605
};


function initMap() {

  // Create a new google map
  const map = new google.maps.Map(
    // the html element to mount the map inside
    document.querySelector('#map'),
    // settings - coordinates to center the map around, zoom level
    {
      center: myPosition,
      zoom: 10
    }
  );

  // Note: infoWindow is the 'speech bubble' on the map

  // Create the initial InfoWindow
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to search for images taken nearby a location",
    position: myPosition
  });

  // Open infoWindow on top of our map
  infoWindow.open(map);

  // Read the longitude and latitude when we click on the map
  map.addListener('click', mapsMouseEvent => {
    // Close the current InfoWindow
    infoWindow.close();
    // create a new InfoWindow
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    // Update myPosition (my position)
    myPosition = mapsMouseEvent.latLng.toJSON();
    // Show the clicked longitude and latitude
    infoWindow.setContent(
      JSON.stringify(myPosition, null, 2)
    );
    infoWindow.open(map);
    // Perform search
    search();
  });
}

// Make initMap global so Google's JavaScript can call it
globalThis.initMap = initMap;

// Now "mount"/include Google Map script
// (because now we are sure that initMap exists for Google's
//  JavaScript to call)
let script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly';
document.body.append(script);

// Search function
async function search() {
  let radius = document.querySelector('select[name=radius]').value;
  let { lat, lng } = myPosition;
  let data = await fetch(
    `/api/map-image-search/${lat}/${lng}/${radius}`
  );
  let images = await data.json();
  // now loop the result and create html
  let html = '';
  for (let image of images) {
    let { latitude, longitude } = image.metadata;
    html += `
      <section>
        <img
           src="/images/${image.fileName}" 
           alt="Arable land at latitude ${latitude}, longitude ${longitude}">
      </section>
    `;
  }
  document.querySelector('.searchResult').innerHTML = html;
}