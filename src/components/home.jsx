import React, { useEffect } from 'react';
import getLocation from '../utilities/getLocation';

const Home = () => {
    useEffect(() => {
        getLocation();
    }, []);
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');
    console.log(latitude, longitude);

    return (
        <div>
            <gmp-map
                center={`${latitude},${longitude}`}
                zoom="15"
                map-id="DEMO_MAP_ID"
                style={{ height: 400, width: 800 }}
            ></gmp-map>
        </div>
    );
};

export default Home;
