import React, { useState } from 'react';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userFound, setUserFound] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loggingIn, setLoggingIn] = useState(true);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            email,
            password,
        };
        if (loggingIn) {
            await fetchUser(userData.email, '');
        } else {
            await newSignup(userData.email, userData.password);
        }
    };

    const fetchUser = async (email, funcPassword) => {
        try {
            const response = await fetch(
                'http://localhost:4000/user/user/get',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password !== '' ? password : funcPassword,
                    }),
                }
            );
            const data = await response.json();
            if (response.status === 401 && password !== '') {
                console.log(1);
                setErrorMessage(data.message);
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            } else if (data.cause === 'email') {
                console.log(2);
                setErrorMessage(data.message);
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            } else if (data.cause === 'password') {
                if (password === '') {
                    console.log(3);
                    setUserFound(true);
                }
            } else if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
        } catch (error) {
            console.log('Failed to get user', error);
        }
    };

    const newSignup = async (email, password) => {
        try {
            const response = await fetch('http://localhost:4000/user/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();
            console.log(data.token);
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            return false;
        }
    };

    const signingUp = () => {
        setUserFound(!userFound);
        setLoggingIn(!loggingIn);
    };

    return (
        <div id="login-page-container">
            <h1 id="login-title">Wayne Ways</h1>
            <div className="login-container">
                <h2 className="title">Welcome back</h2>
                <form id="login-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control input"
                            id="email"
                            value={email}
                            disabled={loggingIn && userFound}
                            onChange={handleEmailChange}
                            placeholder="Email address"
                        />
                    </div>
                    <div
                        className="mb-3 input-password"
                        style={{ display: userFound ? 'block' : 'none' }}
                    >
                        <input
                            type="password"
                            className="form-control input input-password"
                            id="password"
                            disabled={loggingIn && !userFound}
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                        />
                    </div>
                    <div className="error-message">{errorMessage}</div>
                    <button
                        type="submit"
                        className="btn btn-danger input"
                        style={{
                            backgroundColor: 'red',
                            color: 'black',
                        }}
                    >
                        Continue
                    </button>
                </form>
            </div>
            {loggingIn ? (
                <p className="signup-link-p">
                    Don't have an account?{''}
                    <div
                        className="signup-link"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                        onClick={() => signingUp()}
                    >
                        Sign Up
                    </div>
                </p>
            ) : (
                <p className="signup-link-p">
                    Already have an account with us?{' '}
                    <div
                        className="signup-link"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                        onClick={() => signingUp()}
                    >
                        Login
                    </div>
                </p>
            )}
        </div>
    );
};

export default Auth;
