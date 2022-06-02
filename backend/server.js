const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",

    }
});

io.on("connection", async (socket) => {
    socket.on('joinroom', ({ username, roomid }) => {

        socket.join(roomid);

        socket.to(roomid).emit('message', {
            message: `${username} joined`,
            sender: "",
            room: roomid
        });

    })
    socket.on('message', (payload) => {
        console.log(payload.room);
        io.to(payload.room).emit('message', payload);
    })
    socket.on('drawing', (payload) => {
        //console.log("drawign recieved")
        socket.to(payload.room).emit('drawing', payload);
    })

});

server.listen(5000, () => {
    console.log("server chalu hai bro");
});