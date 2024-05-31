import React, { useEffect, useState, useCallback } from 'react';
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';
import getLocation from '../utilities/getLocation';
import reverseGeocodeCoordinates from '../utilities/convertAddress';

const MapComponent = ({ origin, destination, onDirectionsUpdate }) => {
    const [response, setResponse] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [requestDirections, setRequestDirections] = useState(false);
    const [travelMode, setTravelMode] = useState('DRIVING');
    

    const directionsCallback = useCallback(
        (response) => {
            if (response !== null) {
                if (response.status === 'OK') {
                    setResponse(response);
                    const route = response.routes[0];
                    const leg = route.legs[0];
                    onDirectionsUpdate({
                        travelTime: leg.duration.text,
                        distance: leg.distance.text,
                        steps: leg.steps.map((step) => step.instructions),
                        warnings: route.warnings,
                    });
                } else {
                    console.log(
                        'Directions request failed due to ' + response.status
                    );
                }
            }
        },
        [onDirectionsUpdate]
    );

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
console.log('latitude', latitude, 'longitude', longitude)
    return (
        <>
            {origin && destination ? (
                <div className="top-strip">
                    <p id="strip-p">Your location -- {destination}</p>
                </div>
            ) : (
                ''
            )}

            <GoogleMap
                id="direction-example"
                mapContainerStyle={{
                    height: '65%',
                    width: '100%',
                    zIndex: '0',
                }}
                zoom={18}
                center={{ lat: latitude, lng: longitude }}
                options={{
                    trafficControl: true,
                }}
            >
            <gmp-advanced-marker position={{latitude, longitude}} title="string"></gmp-advanced-marker>
                {requestDirections && (
                    <DirectionsService
                        options={{
                            destination: destination,
                            origin: origin,
                            travelMode: travelMode,
                        }}
                        callback={directionsCallback}
                        onLoad={() => setRequestDirections(false)}
                    />
                )}
                {response && <DirectionsRenderer directions={response} />}
            </GoogleMap>
        </>
    );
};

export default MapComponent;
