import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
// import {notFound,errorHandler} from './middleware/errorMiddleware.js'

connectDB();
const app = express();
app.use(express.json())
app.use(cors());

// app.use(notFound)
// app.use(errorHandler)

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

const io = new Server(server , {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    console.log(`User Connected : ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with id ${socket.id} joind room : ${data}`);
        
    });

    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id);
    });
});

server.listen(8000,()=>{
    console.log("SERVER IS RUNNING");
});