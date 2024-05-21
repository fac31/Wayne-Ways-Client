export const reverseGeocodeCoordinates = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAGLJbA1RetjGC3_w0QRCrA9YuZJ0SBzeE`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const result = data.results[0];
            console.log('Formatted Address:', result.formatted_address);
            console.log('Address Components:', result.address_components);
            return result.formatted_address;
        } else {
            console.error('Error reverse geocoding coordinates:', data.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export default reverseGeocodeCoordinates;
