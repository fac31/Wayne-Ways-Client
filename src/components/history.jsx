import React, {useEffect, useState} from "react";
import verifyToken from "../utilities/verifyToken";

export const History = (onHistorySelect) => {

    // Create a historic item
    // Address, date

    const token = localStorage.getItem("token")
    const [history, setHistory] = useState([])
    // const [address, setAddress] = useState("")
    // const [date, setDate] = useState("")

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
                setHistory(data)
            } catch (error) {
                console.log('Error getting history: ', error)
            }
        }
        getHistory()
    }, [history])

    return (
        <div id="grid-item-history">
            <h2>History</h2>
            {history && 
                history.map((his) => (
                    <div 
                    key={his._id}
                    className="recents-item-container">
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
    )
}