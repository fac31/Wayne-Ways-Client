import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import reverseGeocodeCoordinates from '../utilities/convertAddress';
import getLocation from '../utilities/getLocation';
import Favourites from './favourites';

const Form = ({ onAddressSubmit, directionsData, destination }) => {
    const [autocomplete1, setAutocomplete1] = useState(null);
    const [autocomplete2, setAutocomplete2] = useState(null);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [StartingJourney, setStartingJourney] = useState(false);

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
        } else {
            console.error(
                'Both places must be selected and have valid addresses.'
            );
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
                        <p>Best route, typical traffic</p>
                        {directionsData &&
                            directionsData.warning?.length > 0 &&
                            directionsData.warning.map((dir, index) => {
                                <p id={index} className="warnings">
                                    <img
                                        src="/warning.png"
                                        alt="warning"
                                        className="warning-img"
                                    />
                                    {directionsData.warning[index]}
                                </p>;
                            })}
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
