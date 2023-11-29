
import './styles/Homepage.css';
import { Link } from 'react-router-dom';
 

export default function Homepage({ setUsername, setRoomId }) {
 
   
    return (

        <div className="container">
            <div>
                <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}></input>
            </div>
            <div>
                <input type="text" placeholder="Room id" onChange={(e)=>setRoomId(e.target.value)}></input>
            </div>
            <div>
                <Link to={`/chat`}>
                    <button>Join</button>
                </Link>
            </div>
        </div>

    )
}