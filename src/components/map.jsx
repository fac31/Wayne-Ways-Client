import React, { useEffect, useState, useCallback } from 'react';
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';
import getLocation from '../utilities/getLocation';
import reverseGeocodeCoordinates from '../utilities/convertAddress';

const MapComponent = ({ origin, destination }) => {
    const [response, setResponse] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [requestDirections, setRequestDirections] = useState(false);
    const [travelTime, setTravelTime] = useState(null);
    // const [destination, setDestination] = useState(destination);

    const directionsCallback = useCallback((response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setResponse(response);
                const route = response.routes[0];
                const leg = route.legs[0];
                const duration = leg.duration.text;
                setTravelTime(duration);
            } else {
                console.log(
                    'Directions request failed due to ' + response.status
                );
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const position = await getLocation();
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setLatitude(lat);
                setLongitude(lng);

                const currentLocation = await reverseGeocodeCoordinates(
                    lat,
                    lng
                );
                setCurrentLocation(currentLocation);

                setRequestDirections(true);
            } catch (error) {
                console.error('Error getting location:', error);
            }
        };

        if (!latitude && !longitude) {
            fetchData();
        }
    }, [latitude, longitude]);

    useEffect(() => {
        if (currentLocation) {
            setRequestDirections(true);
        }
    }, [currentLocation, destination]);

    if (!latitude || !longitude || !currentLocation) {
        return (
            <div className="loading-container">
                <img
                    src="/batarang.png"
                    alt="Loading"
                    className="loading-image"
                />
            </div>
        );
    }

    console.log(origin, destination);

    return (
        <GoogleMap
            id="direction-example"
            mapContainerStyle={{ height: '70%', width: '100%' }}
            zoom={18}
            center={{ lat: latitude, lng: longitude }}
        >
            {requestDirections && (
                <DirectionsService
                    options={{
                        destination: destination,
                        origin: origin,
                        travelMode: 'DRIVING',
                    }}
                    callback={directionsCallback}
                    onLoad={() => setRequestDirections(false)}
                />
            )}
            {response && <DirectionsRenderer directions={response} />}
            {travelTime && <div className="eta">ETA {travelTime}</div>}
        </GoogleMap>
    );
};

export default MapComponent;
