import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import '../App.css';
import Chats from './Chats';
import Canvas from './Canvas';

const socket = io.connect("http://localhost:5000");

export default function Board({ username, roomid }) {

    useEffect(() => {
        console.log('room joined');
        socket.emit('joinroom', { username, roomid });
    }, []);


    return (
        <div className='Container' >
            <Canvas socket={socket} username={username} roomid={roomid}></Canvas>
            <Chats socket={socket} username={username} roomid={roomid}></Chats>

        </div>
    );
}