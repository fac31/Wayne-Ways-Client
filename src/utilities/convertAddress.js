export const reverseGeocodeCoordinates = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/google/convert-address`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                }),
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export default reverseGeocodeCoordinates;
