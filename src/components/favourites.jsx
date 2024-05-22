import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import verifyToken from '../utilities/verifyToken';

export const Favourites = ({ input1 }) => {
    const token = localStorage.getItem('token');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [addingFavourite, setAddingFavourite] = useState(false);
    const [favourites, setFavourites] = useState(false);
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        const getFavourites = async () => {
            try {
                const userId = await verifyToken(token);
                const response = await fetch(
                    `http://localhost:4000/favourites/get-all/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                setFavourites(data);
            } catch (error) {
                console.log(error);
            }
        };

        getFavourites();
    }, []);

    const handlePlaceChanged = () => {
        const place = autocomplete.getPlace();
        if (place) {
            setAddress(place.formatted_address || place.name || '');
        }
    };

    const addFavourite = async () => {
        try {
            const userId = await verifyToken(token);
            const response = await fetch(
                `http://localhost:4000/favourites/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        name: name,
                        address: address,
                    }),
                }
            );
            const data = await response.json();
            setAddingFavourite(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div id={input1 ? 'grid-item-recents-1' : 'grid-item-recents'}>
            <h2 className="recents-title">Favourites</h2>
            <div className="recents-container">
                {addingFavourite ? (
                    <div className="add-inputs-container">
                        <input
                            type="text"
                            value={name}
                            className="input"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                        />
                        <Autocomplete
                            onLoad={(autoC) => setAutocomplete(autoC)}
                            onPlaceChanged={handlePlaceChanged}
                        >
                            <input
                                type="text"
                                placeholder="Enter Address"
                                className="input"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Autocomplete>

                        <button onClick={() => addFavourite()}>Add</button>
                    </div>
                ) : (
                    <>
                        {favourites &&
                            favourites.map((fav) => (
                                <div className="recents-item-container">
                                    <div
                                        className="recents-item"
                                        id="recents-add-item"
                                    ></div>
                                    <p className="recent-items-text">
                                        {fav.name}
                                    </p>
                                </div>
                            ))}
                        <div
                            className="recents-item-container"
                            onClick={() => setAddingFavourite(true)}
                        >
                            <div
                                className="recents-item"
                                id="recents-add-item"
                            ></div>
                            <p className="recent-items-text">Add</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Favourites;
