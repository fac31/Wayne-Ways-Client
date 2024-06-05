import React, { useEffect, useState, useRef } from 'react';
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';
import getLocation from '../utilities/getLocation';
import formatTime from '../utilities/formatTime';
import addMinutesToTime from '../utilities/addMinutesToTime';
import '../css/journey.css';
import { resolvePath } from 'react-router-dom';
import DirectionCarousel from './carousel';

const mapContainerStyle = {
    height: '77.5%',
    width: '100%',
};

const options = {
    zoom: 18,
    mapTypeId: 'roadmap',
    trafficControl: true,
    styles: [
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#333333' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#666666' }],
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#1a1a1a' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }, { weight: 'thin' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#004d00' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#000033' }],
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#000000' }],
        },
    ],
};

const Journey = () => {
    const destination = localStorage.getItem('destination');
    const origin = localStorage.getItem('origin');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const [index, setIndex] = useState(0);
    const [steps, setSteps] = useState([]);
    const [marker, setMarker] = useState(null);
    const [remainingDistance, setRemainingDistance] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const directionsRendererRef = useRef(null);
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
                        scaledSize: new window.google.maps.Size(90, 50),
                    },
                });
                setMarker(newMarker);
            } else {
                marker.setPosition(currentLocation); 
            }
        }
    }, []);
 
    const directionsCallback = (response) => {
        if (response !== null && response.status === 'OK') {
            // console.log('directionsCallback response ', response)
            setDirections(response);
            const steps = response.routes[0].legs[0].steps
            setSteps(steps)

            if (directionsRendererRef.current) {
                const directionsRenderer = directionsRendererRef.current;
                directionsRenderer.setDirections(response);

                const route = response.routes[0];
                const leg = route.legs[0];
            }
        } else {
            console.error('Directions request failed due to ', response.status)
        }
    };

    const getClosestPoint = (path, currentLocation) => {
        let closestPoint = null;
        let closestDistance = Infinity;

        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            const distance =
                window.google.maps.geometry.spherical.computeDistanceBetween(
                    new window.google.maps.LatLng(point.lat(), point.lng()),
                    new window.google.maps.LatLng(
                        currentLocation.lat,
                        currentLocation.lng
                    )
                );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = point;
            }
        }

        return closestPoint;
    };

    const splitRoute = (path, currentLocation) => {
        const closestPoint = getClosestPoint(path, currentLocation);
        const closestIndex = path.findIndex(
            (point) =>
                point.lat() === closestPoint.lat() &&
                point.lng() === closestPoint.lng()
        );

        const pastPath = path.slice(0, closestIndex + 1);
        const futurePath = path.slice(closestIndex);

        return { pastPath, futurePath };
    };

    const calculateRemainingDistanceAndTime = (leg, currentLocation) => {
        const path = leg.steps.flatMap((step) =>
            window.google.maps.geometry.encoding.decodePath(
                step.polyline.points
            )
        );
        const { futurePath } = splitRoute(path, currentLocation);

        let remainingDistance = 0;
        let remainingTime = 0;

        futurePath.forEach((point, index) => {
            if (index < futurePath.length - 1) {
                const nextPoint = futurePath[index + 1];
                remainingDistance +=
                    window.google.maps.geometry.spherical.computeDistanceBetween(
                        new window.google.maps.LatLng(point.lat(), point.lng()),
                        new window.google.maps.LatLng(
                            nextPoint.lat(),
                            nextPoint.lng()
                        )
                    );
            }
        });

        leg.steps.forEach((step) => {
            const stepStartPoint = new window.google.maps.LatLng(
                step.start_location.lat(),
                step.start_location.lng()
            );
            if (
                window.google.maps.geometry.spherical.computeDistanceBetween(
                    stepStartPoint,
                    new window.google.maps.LatLng(
                        currentLocation.lat,
                        currentLocation.lng
                    )
                ) < 50
            ) {
                remainingTime = step.duration.value;
            }
        });

        setRemainingDistance(remainingDistance / 1000); // Convert to kilometers
        setRemainingTime(remainingTime / 60); // Convert to minutes
    };

    useEffect(() => {
        if (directions && currentLocation) {
            const route = directions.routes[0];
            const leg = route.legs[0];
            calculateRemainingDistanceAndTime(leg, currentLocation);
        }
    }, [directions, currentLocation]);

    const now = new Date();
    const formattedTime = formatTime(now);

    if (!currentLocation) {
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

    if (directions) {
        const directionSteps = directions.routes[0].legs[0].steps;

        // setStep(directionSteps[index]);
    }

    return (
        <div className="full-height" style={{ backgroundColor: 'black' }}>
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
                        destination: destination,
                        origin: origin,
                        travelMode: 'DRIVING',
                    }}
                    callback={directionsCallback}
                />
                {directions &&
                    currentLocation &&
                    (() => {
                        const route = directions.routes[0];
                        const leg = route.legs[0];
                        const path = leg.steps.flatMap((step) =>
                            window.google.maps.geometry.encoding.decodePath(
                                step.polyline.points
                            )
                        );
                        const { pastPath, futurePath } = splitRoute(
                            path,
                            currentLocation
                        );

                        return (
                            <>
                                <DirectionsRenderer
                                    options={{
                                        preserveViewport: true,
                                        polylineOptions: {
                                            strokeColor: 'blue',
                                            strokeOpacity: 0.7,
                                            strokeWeight: 7,
                                        },
                                        suppressMarkers: true,
                                        directions: {
                                            ...directions,
                                            routes: [
                                                {
                                                    ...route,
                                                    overview_polyline:
                                                        window.google.maps.geometry.encoding.encodePath(
                                                            pastPath
                                                        ),
                                                },
                                            ],
                                        },
                                    }}
                                />
                                <DirectionsRenderer
                                    options={{
                                        preserveViewport: true,
                                        polylineOptions: {
                                            strokeColor: 'red',
                                            strokeOpacity: 1,
                                            strokeWeight: 7,
                                        },
                                        suppressMarkers: true,
                                        directions: {
                                            ...directions,
                                            routes: [
                                                {
                                                    ...route,
                                                    overview_polyline:
                                                        window.google.maps.geometry.encoding.encodePath(
                                                            futurePath
                                                        ),
                                                },
                                            ],
                                        },
                                    }}
                                />
                            </>
                        );
                    })()}
            </GoogleMap>
            {remainingDistance !== null && remainingTime !== null && (
                <div
                    style={{
                        // height: '12.5%',
                        background: '#333333',
                        padding: '10px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '7vmin',
                            fontWeight: '900',
                        }}
                    >
                        {addMinutesToTime(
                            formattedTime,
                            parseInt(parseFloat(remainingTime.toFixed(2)) * 100)
                        )}
                    </div>
                    <div
                        style={{
                            fontWeight: '600',
                            fontSize: '4.5vmin',
                        }}
                    >
                        {parseInt(parseFloat(remainingTime.toFixed(2)) * 100)}{' '}
                        mins {'    ---   '}
                        {parseInt(remainingDistance.toFixed(2))} km
                    </div>

                    <DirectionCarousel steps={steps} />
                    
                </div>
            )}
        </div>
    );
};

export default Journey;
