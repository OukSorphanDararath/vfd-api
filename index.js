import express from "express";
import http from "http";
import { Server as socketIoServer } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import schedulesRoute from "./routes/schedulesRoute.js";
import contactRoute from "./routes/contactRoute.js";
import facultiesRoute from "./routes/facultiesRoute.js";

const app = express();
const server = http.createServer(app);
const io = new socketIoServer(server, {
  cors: {
    origin: "*", // Allow all origins (for testing purposes)
  },
});

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for handling CORS POLICY
app.use(cors()); // Allow specific origin

// Define API routes
app.use("/schedules", schedulesRoute);
app.use("/contacts", contactRoute);
app.use("/faculties", facultiesRoute);

// WebRTC signaling with Socket.io
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("offer", (data) => {
//     console.log("Received offer from client:", data);
//     // Broadcast the offer to all other clients (admin side in this case)
//     socket.broadcast.emit("offer", data);
//   });

//   socket.on("answer", (data) => {
//     console.log("Received answer from admin:", data);
//     // Broadcast the answer back to the client who made the offer
//     socket.broadcast.emit("answer", data);
//   });

//   socket.on("icecandidate", (data) => {
//     console.log("Received ICE candidate:", data);
//     // Broadcast the ICE candidate to the other peer
//     socket.broadcast.emit("icecandidate", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// Connect to MongoDB
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Fallback route for all other routes
app.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});
