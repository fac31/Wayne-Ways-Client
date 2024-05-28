import React, {useEffect, useState} from "react";
import verifyToken from "../utilities/verifyToken";

export const History = ({onHistorySelect, historyList, setHistoryList}) => {

    const token = localStorage.getItem("token")

    useEffect(() => {
        const getHistory = async () => {
            try {
                const userId = await verifyToken(token)
                const response = await fetch(
                    `http://localhost:4000/history/get-all/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json()
                setHistoryList(data)
            } catch (error) {
                console.log('Client: Error getting history: ', error)
            }
        }
        getHistory()
    }, [])


    return (
        <div id="grid-item-history">
            <h2 className="recents-title">History</h2>
            <div className="history-container">
                {historyList && 
                    historyList.map((his) => (
                        <div 
                            key={his._id}
                            className="recents-item-container"
                        >
                            <div 
                                className="recents-item" 
                                onClick={() => 
                                    onHistorySelect(his.address)
                                }
                            > </div>
                            <p className="recent-items-text">
                                {his.address.split(",")[0]}
                            </p>
                        </div>
                    )
                    )
                }
            </div>
        </div>
    )
}