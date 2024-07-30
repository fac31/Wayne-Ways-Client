export const verifyToken = async (token) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/protected`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        if (response.ok) {
            return data.userId;
        } else {
            localStorage.removeItem('token');
            window.location.href = 'authentication';
            return;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};

export default verifyToken;
