import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import verifyToken from '../utilities/verifyToken';
import reverseGeocodeCoordinates from '../utilities/convertAddress';
import getLocation from '../utilities/getLocation';
import Favourites from './favourites';
import { History } from './history';
import '../css/form.css';
import geocodeAddress from '../utilities/getCoords';

const Form = ({ onAddressSubmit, directionsData, destination }) => {
    const [autocomplete1, setAutocomplete1] = useState(null);
    const [autocomplete2, setAutocomplete2] = useState(null);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [StartingJourney, setStartingJourney] = useState(false);
    const [historyList, setHistoryList] = useState([]);
    const [trafficData, setTrafficData] = useState([]);
    const token = localStorage.getItem('token');

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

                setInput1(currentLocation);
            } catch (error) {
                console.error('Error getting location:', error);
            }
        };
        if (!latitude && !longitude) {
            fetchData();
        }
    }, [latitude, longitude]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let place1 = autocomplete1 ? autocomplete1.getPlace() : null;
        let place2 = autocomplete2 ? autocomplete2.getPlace() : null;

        if (!place1) {
            place1 = { formatted_address: input1 };
        }

        console.log('input1', input1, 'place1', place1, 'place2', place2);

        if (
            place1 &&
            place1.formatted_address &&
            place2 &&
            place2.formatted_address
        ) {
            onAddressSubmit({
                origin: place1.formatted_address,
                destination: place2.formatted_address,
            });
            setStartingJourney(true);

            getTrafficData(place2.formatted_address);

            if (historyList.length <= 6) {
                addToHistory(place2.formatted_address);
            } else {
                removeOldestFromHistory();
                addToHistory(place2.formatted_address);
            }
        } else {
            console.error(
                'Both places must be selected and have valid addresses.'
            );
        }
    };

    const getTrafficData = async (address) => {
        const data = await geocodeAddress(address);
        const lat2 = data.results[0].geometry.location.lat;
        const lng2 = data.results[0].geometry.location.lng;
        try {
            const response = await fetch(
                'http://localhost:4000/map-quest/traffic-data',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lat1: latitude,
                        lng1: longitude,
                        lat2: lat2,
                        lng2: lng2,
                    }),
                }
            );
            const data = await response.json();
            setTrafficData(data.trafficCondition);
        } catch (error) {
            console.log('Error getting traffic data', error);
        }
    };

    const addToHistory = async (address) => {
        try {
            const userId = await verifyToken(token);
            const deleteAddress = await fetch(
                `http://localhost:4000/history/deleteByAddress`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        address: address,
                    }),
                }
            );
            const deletedData = await deleteAddress.json();

            const response = await fetch(`http://localhost:4000/history/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    address: address,
                    date: Date.now(),
                }),
            });
            const data = await response.json();

            setHistoryList([...historyList, data]);
        } catch (error) {
            console.log('Error adding to history ');
        }
    };

    const removeOldestFromHistory = async () => {
        if (historyList.length === 0) return;
        const oldestHistory = historyList[0];

        console.log('Remove oldest item from history', oldestHistory);
        try {
            const userId = await verifyToken(token);
            const response = await fetch(
                `http://localhost:4000/history/deleteById`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        _id: oldestHistory._id,
                    }),
                }
            );
            const data = await response.json();

            if (response.ok) {
                setHistoryList(
                    historyList.filter((item) => item._id !== oldestHistory._id)
                );
            } else {
                console.log(
                    'Failed to delete history item:',
                    await response.text()
                );
            }
        } catch (error) {
            console.log('Client: error deleting from history');
        }
    };

    const handlePlaceChanged1 = () => {
        const place = autocomplete1.getPlace();
        if (place) {
            setInput1(place.formatted_address);
        }
    };

    const handlePlaceChanged2 = () => {
        const place = autocomplete2.getPlace();
        if (place) {
            setInput2(place.formatted_address);
        }
    };

    const handleFavouriteSelect = (address) => {
        setInput2(address);
        setStartingJourney(true);
        onAddressSubmit({
            origin: input1,
            destination: address,
        });
    };

    const goBack = () => {
        setInput2('');
        setStartingJourney(false);
        onAddressSubmit({
            origin: input1,
            destination: '',
        });
    };

    const startJourney = () => {
        localStorage.setItem('origin', input1);
        localStorage.setItem('destination', input2);
        window.location.href = '/journey';
    };

    return (
        <>
            {!StartingJourney ? (
                <div
                    id="form-container"
                    className={input2 ? 'form-variable' : 'grid-template'}
                >
                    <form id={input2 ? 'grid-item-form-origin' : ''}>
                        <Autocomplete
                            onLoad={(autoC) => setAutocomplete1(autoC)}
                            onPlaceChanged={handlePlaceChanged1}
                        >
                            <input
                                value={input1}
                                onChange={(e) => setInput1(e.target.value)}
                                type="text"
                                id="input1"
                                style={{
                                    display: input2 ? 'block' : 'none',
                                }}
                            />
                        </Autocomplete>
                    </form>
                    <form
                        id={input2 ? 'form-variable-2' : 'grid-item-form'}
                        onSubmit={handleSubmit}
                    >
                        <Autocomplete
                            onLoad={(autoC) => setAutocomplete2(autoC)}
                            onPlaceChanged={handlePlaceChanged2}
                        >
                            <input
                                value={input2}
                                onChange={(e) => setInput2(e.target.value)}
                                type="text"
                                id="input2"
                                placeholder="Search WayneWays"
                            />
                        </Autocomplete>
                        <button id="submit-btn" type="submit"></button>
                    </form>
                    <Favourites
                        input1={input1}
                        onFavouriteSelect={handleFavouriteSelect}
                    />
                    <History
                        onHistorySelect={handleFavouriteSelect}
                        historyList={historyList}
                        setHistoryList={setHistoryList}
                    />
                </div>
            ) : (
                <div className="grid-template" id="start-journey">
                    <div id="start-journey-container">
                        <div
                            style={{
                                fontSize: '5vmin',
                                fontWeight: '900',
                                marginBottom: '0.5vh',
                            }}
                        >
                            {directionsData.travelTime}
                        </div>
                        <p style={{ fontSize: '4vmin', marginBottom: 0 }}>
                            -- {destination} --
                        </p>
                        <p>Best route, {trafficData}</p>
                        {directionsData &&
                            directionsData.warning?.length > 0 &&
                            directionsData.warning.map((dir, index) => (
                                <p id={index} className="warnings">
                                    <img
                                        src="/warning.png"
                                        alt="warning"
                                        className="warning-img"
                                    />
                                    {directionsData.warning[index]}
                                </p>
                            ))}
                    </div>
                    <div className="distance-container">
                        {directionsData.distance}
                    </div>
                    <div id="route-start-btns-container">
                        <button id="go-back-btn" onClick={() => goBack()}>
                            Go back
                        </button>
                        <button id="go-btn" onClick={() => startJourney()}>
                            Start Journey
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Form;
