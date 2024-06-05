export const geocodeAddress = async (address) => {
    try {
        const response = await fetch('http://localhost:4000/google/geocode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: address,
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export default geocodeAddress;
