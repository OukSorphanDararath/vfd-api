import express from "express";
import http from "http";
import { Server as socketIoServer } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import schedulesRoute from "./routes/schedulesRoute.js";
import contactRoute from "./routes/contactRoute.js";
import facultiesRoute from "./routes/facultiesRoute.js";
import announcementsRoute from "./routes/announcementRoute.js";

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
app.use("/announcements", announcementsRoute);

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
