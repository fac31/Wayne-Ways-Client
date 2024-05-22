import React, { useEffect, useState } from 'react';
import MapComponent from './map';
import Form from './form';
import verifyToken from '../utilities/verifyToken';

export const Home = () => {
    const [address, setAddress] = useState({ origin: '', destination: '' });

    const handleAddressSubmit = (newAddress) => {
        setAddress(newAddress);
        console.log(newAddress); // This will log the new address object
    };

    const token = localStorage.getItem('token');
    verifyToken(token);

    return (
        <div className="full-height">
            <MapComponent
                origin={address.origin}
                destination={address.destination}
            />
            <Form onAddressSubmit={handleAddressSubmit} />
        </div>
    );
};

export default Home;
