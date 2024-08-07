import React, { useEffect, useState } from 'react';
import verifyToken from '../utilities/verifyToken';
import '../css/history.css';

export const History = ({ onHistorySelect, historyList, setHistoryList }) => {
    const token = localStorage.getItem('token');

    useEffect(() => {
        const getHistory = async () => {
            try {
                const userId = await verifyToken(token);
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/history/get-all/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                setHistoryList(data);
            } catch (error) {
                console.log('Client: Error getting history: ', error);
            }
        };
        getHistory();
    }, []);

    return (
        <div id="history">
            <h2 className="recents-title">History</h2>
            <div className="history-container">
                {historyList &&
                    historyList.map((his) => (
                        <div
                            key={his._id}
                            className="history-item-container"
                            onClick={() => onHistorySelect(his.address)}
                        >
                            <p className="recent-items-text">
                                <img
                                    src="/yellow-batman-icon.png"
                                    alt="batman logo"
                                    className="batman-logo-img"
                                />
                                {his.address.split(',').slice(0, -1)}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
};
