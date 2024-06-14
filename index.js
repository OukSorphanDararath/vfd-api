import express, { request } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
// import { Schedule } from "./models/scheduleModel.js";
import schedulesRoute from "./routes/schedulesRoute.js";
import cors from "cors";

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());
app.use("/files", express.static("files"));

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to MERN Stack");
});

app.use("/schedules", schedulesRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
