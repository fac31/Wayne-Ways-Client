import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import verifyToken from '../utilities/verifyToken';
import '../css/favourites.css';

export const Favourites = ({ input1, onFavouriteSelect }) => {
    const token = localStorage.getItem('token');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [addingFavourite, setAddingFavourite] = useState(false);
    const [favourites, setFavourites] = useState([]);
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
            setFavourites([...favourites, data]);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteFav = async (fav) => {
        try {
            const userId = await verifyToken(token);
            const response = await fetch(
                `http://localhost:4000/favourites/one`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        name: fav.name,
                    }),
                }
            );
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div id={input1 ? 'favourites-1' : 'favourites-2'}>
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
                                <div
                                    key={fav._id}
                                    className="saved-item-container"
                                >
                                    <div
                                        className="saved-item"
                                        id="fav-item"
                                        onClick={() =>
                                            onFavouriteSelect(fav.address)
                                        }
                                    ></div>
                                    <p className="recent-items-text">
                                        {fav.name}
                                        <img
                                            onClick={() => deleteFav(fav)}
                                            src="/bin.png"
                                            alt="bin"
                                            className="bin-img"
                                        />
                                    </p>
                                </div>
                            ))}
                        <div
                            className="saved-item-container"
                            onClick={() => setAddingFavourite(true)}
                        >
                            <div className="saved-item" id="fav-add-item"></div>
                            <p className="recent-items-text">Add</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Favourites;
