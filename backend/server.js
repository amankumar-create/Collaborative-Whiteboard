const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

const users = {};

io.on("connection", async (socket) => {
    socket.once('joinRoom', ({ username, roomid }) => {
        users[socket.id] = {};
        users[socket.id].username  = username;
        users[socket.id].room  = roomid;
        console.log(users);
        socket.join(roomid);
        socket.to(roomid).emit('message', {
            message: `${username} joined`,
            type : "new_user"
        });

    })
    socket.on('sendMessage', (payload) => {
        console.log(payload.room);
        io.to(payload.room).emit('message',{
            message: `${users[socket.id].username}: ${payload.message}`, 
            type:"user_message"
        });
    })
    socket.on('drawing', (payload) => {
        //console.log("drawign recieved")
        socket.to(payload.room).emit('drawing', payload);
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        var name = users[socket.id].username;
        var room = users[socket.id].room;
        delete users[socket.id];
        io.to(room).emit('message',{
            message: `${name} left the room`, 
            type:"user_left"
        });
      });

});

server.listen(5000, () => {
    console.log("server chalu hai bro");
});