document.body.innerHTML = `
  <h1>Search by map</h1>
  <p>Choose a radius and click on a location on the map to search:</p>
  <form name="mapForm" onclick="return false">
    <select name="radius">
      <option value="10">10 km</option>
      <option value="25">25 km</option>
      <option value="50" selected>50 km</option>
      <option value="100">100 km</option>
      <option value="1000">1000 km</option>
    </select>
  </form>
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
    document.querySelector('#map'), {
    center: myPosition,
    zoom: 10
  });

  // Note: infoWindow is the 'speech bubble' on the map

  // Create the initial InfoWindow
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to search for images taken nearby a location",
    position: myPosition
  });

  // Open infoWindow
  infoWindow.open(map);

  // Read the longitude and latitude when we click on the map
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow
    infoWindow.close();
    // create a new InfoWindow
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    // Update myPos (my position)
    myPosition = mapsMouseEvent.latLng.toJSON();
    // Show the clicked longitude and latitude
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infoWindow.open(map);
    // Perform search
    search();
  });
}

// Needed to start displaying the map
window.initMap = initMap;

// Search function
async function search() {
  let radius = document.forms.mapForm.radius.value;
  let latitude = myPosition.lat;
  let longitude = myPosition.lng;
  console.log("HEPP");
  console.log('radius', radius);
  console.log('latitude', latitude);
  console.log('longitude', longitude);
  let data = await fetch('/api/map-image-search/' + latitude + '/' + longitude + '/' + radius);
  let images = await data.json();
  // now loop the result and create html
  let html = '';
  for (let image of images) {
    html += `
      <section>
        <img src="/images/${image.fileName}">
      </section>
    `;
  }
  document.querySelector('.searchResult').innerHTML = html;
}