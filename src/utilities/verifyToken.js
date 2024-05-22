export const verifyToken = async (token) => {
    try {
        const response = await fetch('http://localhost:4000/protected', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return;
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
