import React, { useEffect, useState } from 'react';
import MapComponent from './map';
import Form from './form';

export const Home = () => {
    const [address, setAddress] = useState({ origin: '', destination: '' });
    const [directionsData, setDirectionsData] = useState({
        travelTime: null,
        distance: null,
        steps: [],
        warnings: [],
    });

    const handleDirectionsUpdate = (data) => {
        setDirectionsData(data);
        console.log(directionsData);
    };

    const handleAddressSubmit = (newAddress) => {
        setAddress(newAddress);
        console.log(newAddress);
    };

    return (
        <div className="full-height">
            <MapComponent
                origin={address.origin}
                destination={address.destination}
                onDirectionsUpdate={handleDirectionsUpdate}
            />
            <Form
                onAddressSubmit={handleAddressSubmit}
                directionsData={directionsData}
                destination={address.destination}
            />
        </div>
    );
};

export default Home;
