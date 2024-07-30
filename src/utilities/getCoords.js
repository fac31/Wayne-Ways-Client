export const geocodeAddress = async (address) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/google/geocode`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: address,
                }),
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export default geocodeAddress;
