import React, { useEffect, useState, useRef } from 'react';
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';
import getLocation from '../utilities/getLocation';

const mapContainerStyle = {
    height: '100%',
    width: '100%',
};

const options = {
    zoom: 18,
    mapTypeId: 'roadmap',
    trafficControl: true,
    styles: [
        // {
        //     featureType: 'all',
        //     elementType: 'geometry',
        //     stylers: [
        //         { color: '#1a1a1a' }, // Dark background color
        //     ],
        // },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
                { color: '#333333' }, // Dark landscape color
            ],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                { color: '#666666' }, // Dark road color
            ],
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                { color: '#1a1a1a' }, // Dark POI color
            ],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
                { color: '#00000' },
                { weight: 'thin' }, // Light text color for POI labels
            ],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
                { color: '#004d00' }, // Dark color for parks
            ],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                { color: '#000033' }, // Dark water color
            ],
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [
                { color: '#000000' }, // Dark color for transit lines
            ],
        },
    ],
};

const Journey = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const [marker, setMarker] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const position = await getLocation();
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setCurrentLocation({ lat, lng });
            } catch (error) {
                console.error('Error getting location:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (currentLocation && mapRef.current) {
            const map = mapRef.current.state.map;

            if (!marker) {
                const newMarker = new window.google.maps.Marker({
                    position: currentLocation,
                    map: map,
                    title: 'Current Location',
                    icon: {
                        url: 'https://i.postimg.cc/WbgWHH2k/76139-Top-removebg-preview.png',
                        scaledSize: new window.google.maps.Size(90, 50), // Adjust size if needed
                    },
                });
                setMarker(newMarker);
            } else {
                marker.setPosition(currentLocation);
            }
        }
    }, [currentLocation, marker]);

    const directionsCallback = (response, status) => {
        if (status === 'OK') {
            setDirections(response);
        } else {
            console.error('Directions request failed due to ' + status);
        }
    };

    return (
        <div className="full-height">
            <GoogleMap
                id="direction-example"
                mapContainerStyle={mapContainerStyle}
                zoom={options.zoom}
                center={currentLocation}
                options={options}
                onLoad={(map) => {
                    mapRef.current = { state: { map } };
                }}
            >
                {marker && marker.setMap(mapRef.current.state.map)}
                <DirectionsService
                    options={{
                        destination: 'London HA9 0WS, UK',
                        origin: '1 Brent Cross Gardens, London NW4 3AJ, UK',
                        travelMode: 'DRIVING',
                    }}
                    callback={directionsCallback}
                />
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            preserveViewport: true,
                            polylineOptions: {
                                strokeColor: 'red', // Set line color
                                strokeOpacity: 1, // Set line opacity
                                strokeWeight: 7, // Set line thickness
                            },
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default Journey;
