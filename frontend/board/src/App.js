import './App.css';
import { useState } from 'react';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Space from './components/Space';
import Whiteboard from './components/Whiteboard';


function App() {
  const [Username, setUsername] = useState("");
  const [RoomId, setRoomId] = useState("");
  console.log(Username + " joined "+ RoomId);
  return (
    <BrowserRouter>
      <div  > 
        <header  >
          <Routes>
          <Route path="/" exact element={<Whiteboard   />} />
            {/* <Route path="/" exact element={<Homepage setUsername={setUsername} setRoomId={setRoomId} />} />
            <Route path="/chat" exact element={<Space username={Username} roomid={RoomId} />} /> */}
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
