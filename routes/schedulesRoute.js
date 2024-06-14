import express from "express";
import { Schedule } from "../models/scheduleModel.js";

const router = express.Router();

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route for Save a new Schedule
router.post("/", upload.single("file"), async (request, response) => {
  try {
    if (!request.body.name) {
      return response.status(400).send({
        message: "name is required",
      });
    }

    const newSchedule = {
      name: request.body.name,
      pdf: request?.file?.filename,
    };

    const schedule = await Schedule.create(newSchedule);

    return response.status(201).send(schedule);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Schedules from database
router.get("/", async (request, response) => {
  try {
    const schedules = await Schedule.find({});

    return response.status(200).json({
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get one Schedules from database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const schedule = await Schedule.findById(id);

    return response.status(200).json(schedule);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for update a book
router.put("/:id", async (request, response) => {
  try {
    if (!request.body.title || !request.body.url) {
      return response.status(400).send({
        message: "Send all required fields: title, url",
      });
    }

    const { id } = request.params;

    const result = await Schedule.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Schedule not found" });
    }

    return response
      .status(200)
      .send({ message: "Schedule updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Schedule.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Schedule not found" });
    }

    return response
      .status(200)
      .send({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
