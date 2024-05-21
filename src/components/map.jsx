import React, { useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import getLocation from '../utilities/getLocation';
import reverseGeocodeCoordinates from '../utilities/convertAddress';


const MapComponent = () => {
  const [response, setResponse] = React.useState(null);
  let latitude = null;
  let longitude = null;

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(response);
      } else {
        console.log('Directions request failed due to ' + response.status);
      }
    }
  };

  // useEffect = () => {
  //   getLocation()
  //   let latitude = localStorage.get('latitude')
  //   let longitude = localStorage.get('longitude')
  // }

  const origin = reverseGeocodeCoordinates(latitude, longitude)

  return (
    <GoogleMap
      id="direction-example"
      mapContainerStyle={{ height: '500px', width: '100%' }}
      zoom={7}
      center={{ lat: 41.85, lng: -87.65 }}
    >
      <DirectionsService
        options={{
          destination: 'Chicago, IL',
          origin: 'New York, NY',
          travelMode: 'DRIVING'
        }}
        callback={directionsCallback}
      />
      {response !== null && <DirectionsRenderer directions={response} />}
    </GoogleMap>
  );
};

export default MapComponent;