import React, { useState, useEffect } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import reverseGeocodeCoordinates from '../utilities/convertAddress';
import getLocation from '../utilities/getLocation';
import Favourites from './favourites';

const libraries = ['places'];

const Form = ({ onAddressSubmit }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAGLJbA1RetjGC3_w0QRCrA9YuZJ0SBzeE',
        libraries,
    });

    const [autocomplete1, setAutocomplete1] = useState(null);
    const [autocomplete2, setAutocomplete2] = useState(null);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

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
        setInput2(address); // Set the selected favourite address to input2
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps</div>;
    }

    return (
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
    );
};

export default Form;
