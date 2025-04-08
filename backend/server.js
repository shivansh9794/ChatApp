import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

connectDB();
const app = express();
const port=8000;
app.use(express.json())
app.use(cors('*'));

// app.use(notFound)
// app.use(errorHandler)

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const server = app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port} `);
});

const io = new Server(server, {
    pingTimeout:6000,
    cors: {
        origin:'*'
    },
})

io.on("connection",(socket)=>{
    console.log("connected to Socket.Io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('user Joined room :'+room);
    });

    socket.on('new message',(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.users)return console.log("Chat.Users Not Defined");
        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    })

    // typing 
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});

