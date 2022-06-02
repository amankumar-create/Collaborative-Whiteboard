import './App.css';
import { useState } from 'react';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Board from './components/Board';


function App() {
  const [Username, setusername] = useState("");
  const [RoomId, setroomId] = useState("");

  function setUsername(data) {
    setusername(data);
  }
  function setRoomId(data) {
    setroomId(data);
  }
  return (
    <Router>
      <div  >
        <header  >
          <Routes>
            <Route path="/" exact element={<Homepage setUsername={setUsername} setRoomId={setRoomId} />} />
            <Route path="/chat" exact element={<Board username={Username} roomid={RoomId} />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
