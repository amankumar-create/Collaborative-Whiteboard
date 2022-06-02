
import './styles/Homepage.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Homepage({ setUsername, setRoomId }) {
    const [name, setname] = useState("");
    const [roomId, setroomId] = useState("");
    function handleclick() {
        setUsername(name); //parent(App) callback functions
        setRoomId(roomId); //to pass the data to parent
    }
    function handlenameChange(e) {
        setname(e.target.value);
    }
    function handleroomidChange(e) {
        setroomId(e.target.value);
    }
    return (

        <div className="container">
            <div>
                <input type="text" placeholder="Username" onChange={handlenameChange}></input>
            </div>
            <div>
                <input type="text" placeholder="Room id" onChange={handleroomidChange}></input>
            </div>
            <div>
                <Link to={`/chat`}>
                    <button onClick={handleclick}>Join</button>
                </Link>
            </div>
        </div>

    )
}