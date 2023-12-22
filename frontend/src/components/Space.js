import io from "socket.io-client";
import { nanoid } from "nanoid";
import { useState, useEffect, memo } from "react";
import "../App.css";
import Chats from "./Chats";
 
import ActiveUsers from "./ActiveUsers";
import Whiteboard from "./Whiteboard";

const socket = io.connect("http://localhost:5000");
// const socket = io.connect("https://whiteboardbackend-mc0t.onrender.com");

const Space = ({ username, roomid }) => {
    
    useEffect(() => {
      console.log("room joined");

      socket.emit("joinRoom", { username, roomid });
    }, [username]);

  return (
    <div>
        <Whiteboard socket={socket} />
        <ActiveUsers roomid={roomid} socket={socket}></ActiveUsers>
        {/* <Canvas socket={socket} username={username} roomid={roomid}></Canvas> */}
        <Chats socket={socket} username={username} roomid={roomid}></Chats>
        
    </div>
  );
};
export default Space;
