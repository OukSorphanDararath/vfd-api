import express from "express";
import { Schedule } from "../models/scheduleModel.js";

const router = express.Router();

// Route to save a new Schedule with optional file path and PDF name
router.post("/", async (request, response) => {
  try {
    const { name, pdfPath, pdfName } = request.body;

    if (!name) {
      return response.status(400).json({ message: "'name' is required" });
    }

    const newSchedule = {
      name,
      pdfPath: pdfPath || null, // Store the file path if provided, else null
      pdfName: pdfName || null, // Store the display name if provided, else null
    };

    const schedule = await Schedule.create(newSchedule);

    return response.status(201).json(schedule);
  } catch (error) {
    console.error("Error saving schedule:", error.message);
    response
      .status(500)
      .json({ message: "Failed to save schedule", error: error.message });
  }
});

// Route to get all schedules
router.get("/", async (request, response) => {
  try {
    const schedules = await Schedule.find({});
    response.status(200).json({ count: schedules.length, data: schedules });
  } catch (error) {
    console.error("Error fetching schedules:", error.message);
    response
      .status(500)
      .json({ message: "Failed to fetch schedules", error: error.message });
  }
});

// Route to get a schedule by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return response.status(404).json({ message: "Schedule not found" });
    }

    response.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule by ID:", error.message);
    response
      .status(500)
      .json({ message: "Failed to fetch schedule", error: error.message });
  }
});

// Route to update a schedule by id
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { name, pdfPath, pdfName } = request.body;

    if (!name) {
      return response.status(400).json({ message: "'name' is required" });
    }

    const updateData = { name };

    if (pdfPath !== undefined) {
      updateData.pdfPath = pdfPath; // Update the file path if provided
    }
    if (pdfName !== undefined) {
      updateData.pdfName = pdfName; // Update the display name if provided
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updateData, {
      new: true,
      useFindAndModify: false,
    });

    if (!updatedSchedule) {
      return response.status(404).json({ message: "Schedule not found" });
    }

    response.status(200).json({
      message: "Schedule updated successfully",
      data: updatedSchedule,
    });
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    response
      .status(500)
      .json({ message: "Failed to update schedule", error: error.message });
  }
});

// Route to delete a schedule by id
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return response.status(404).json({ message: "Schedule not found" });
    }

    response.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error.message);
    response
      .status(500)
      .json({ message: "Failed to delete schedule", error: error.message });
  }
});

export default router;
