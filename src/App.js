import { Loader } from '@googlemaps/js-api-loader';

function App() {

    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
      version: "weekly",
      libraries: ["places"]
    });

    const mapOptions = {
      center: { lat: 21.037651831867414, lng: 105.78614153180416 },
      zoom: 10,
    }

    loader
      .load()
      .then((google) => {
        const bounds = new google.maps.LatLngBounds();
        const markersArray = [];
        const map = new google.maps.Map(document.getElementById("map"), mapOptions);
        const geocoder = new google.maps.Geocoder();
        const service = new google.maps.DistanceMatrixService();
        const origin1 = { lat: 21.037651831867414, lng: 105.78614153180416 };
        const origin2 = "Mai Dịch";
        const destinationA = "Dịch Vọng";
        const destinationB = { lat: 21.040519944133514, lng: 105.78067773646997 };
        const request = {
          origins: [origin1, origin2],
          destinations: [destinationA, destinationB],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        };

        // put request on page
        document.getElementById("request").innerText = JSON.stringify(
          request,
          null,
          2
        );
        // get distance matrix response
        service.getDistanceMatrix(request).then((response) => {
          // put response
          document.getElementById("response").innerText = JSON.stringify(
            response,
            null,
            2
          );

          // show on map
          const originList = response.originAddresses;
          const destinationList = response.destinationAddresses;

          deleteMarkers(markersArray);

          const showGeocodedAddressOnMap = (asDestination) => {
            const handler = ({ results }) => {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              markersArray.push(
                new google.maps.Marker({
                  map,
                  position: results[0].geometry.location,
                  label: asDestination ? "D" : "O",
                })
              );
            };
            return handler;
          };

          for (let i = 0; i < originList.length; i++) {
            const results = response.rows[i].elements;

            geocoder
              .geocode({ address: originList[i] })
              .then(showGeocodedAddressOnMap(false));

            for (let j = 0; j < results.length; j++) {
              geocoder
                .geocode({ address: destinationList[j] })
                .then(showGeocodedAddressOnMap(true));
            }
          }
        });
      })
      .catch(e => {
        // do something
      });

    function deleteMarkers(markersArray) {
      for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
      }

      markersArray = [];
    }



  return (
    <div id="container">
      <div id="map"></div>
      <div id="sidebar">
        <h3 >Request</h3>
        <pre id="request"></pre>
        <h3 >Response</h3>
        <pre id="response"></pre>
      </div>
    </div>
  );
}

export default App;
