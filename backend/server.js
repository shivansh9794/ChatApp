import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import Message from './model/messageModel.js';


connectDB();
const app = express();
const port = 8000;
app.use(express.json())
app.use(cors('*'));

// app.use(notFound)
// app.use(errorHandler)
app.get("/", (req, res) => {
    res.send("Chat Backend is working 🔥")
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const server = app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port} `);
});

const io = new Server(server, {
    pingTimeout: 6000,
    cors: {
        origin: '*'
    },
})

io.on("connection", (socket) => {
    console.log("connected to Socket.Io");

    // Message page Open
    socket.on("setup", (userData) => {
        socket.join(userData?._id);
        console.log(userData?._id);
        socket.emit('connected');
    });

    // Chat page Open
    socket.on("setupChat", (userData) => {
        socket.join(userData?._id);
        socket.emit('connected');
    });

    // Join Chat
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('user Joined room :' + room);
    });

    // New Message
    socket.on('new message', (newMessageReceived) => {
        const chat = newMessageReceived.chat;
        if (!chat.users) return console.log("Chat.Users Not Defined");

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;

            // Sending new message
            socket.in(user._id).emit("message received", newMessageReceived);

            // Emiting unseen increment function
            socket.in(user._id).emit("increment unseen", {
                chatId: chat._id,
                from: newMessageReceived.sender._id,
            });
        });
    });

    // Socket to Mark as Seen
    socket.on("mark seen", async ({ chatId, userId }) => {

        try {
            await Message.updateMany(
                {
                    chat: chatId,
                    seenBy: { $ne: userId },
                    sender: { $ne: userId },
                },
                { $addToSet: { seenBy: userId } }
            );

            // Emit unseen count reset
            socket.in(userId).emit("update unread count", {
                chatId,
                count: 0
            });
        } catch (err) {
            console.error(`[Error] Failed to mark messages as seen for Chat ${chatId}`, err);
        }
    });

    // typing 
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});