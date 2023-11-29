import { useState, useEffect } from 'react';
import '../App.css';


export default function Chats({ socket, username, roomid }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);



    socket.on('message', (payload) => {
        console.log(payload.message);
        setMessages([...messages, payload.message]);
    })


    function handleSend() {
        if (message != "") {
            socket.emit('sendMessage', {
                message: message,
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
                                <p style={{ lineHeight: "10px", fontWeight: "bold" }}>{msg}</p>
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