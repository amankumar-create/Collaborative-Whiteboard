import { useState, useEffect } from 'react';
import '../App.css';


export default function Chats({ socket, username, roomid }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);



    socket.on('message', (payload) => {
        console.log(payload.message);
        setMessages([...messages, payload]);
    })


    function handleSend() {
        if (message != "") {
            socket.emit('message', {
                message: message,
                sender: username,
                room: roomid
            });
            setMessage("");
        }
    }
    function handleChange(event) {
        setMessage(event.target.value);
    }

    return (

        <div className='Chatbox'>

            <div className='chat'>
                {
                    messages.map((msg) => {
                        return (
                            <div >
                                <p style={{ lineHeight: "10px" }}><b>{msg.sender + ": "}</b> {msg.message}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className='inp'>
                <input type="text" value={message} onChange={handleChange}></input>
                <button onClick={handleSend} >
                    Send
                </button>
            </div>

        </div>

    );
}