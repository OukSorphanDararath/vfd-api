import express from "express";
import { Announcement } from "../models/announcementModel.js";

const router = express.Router();

// Middleware to parse JSON and form-data requests
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Route for saving a new announcement
router.post("/", async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Received POST request body:", req.body);

    // Destructure required fields from request body
    const { title, image, content, pdfName, pdfPath } = req.body;

    // Validate the required fields
    if (!title || !image) {
      return res.status(400).send({
        message: "Title and image are required",
      });
    }

    // Create a new announcement object
    const newAnnouncement = { title, image, content, pdfName, pdfPath };

    // Save the announcement to the database
    const announcement = await Announcement.create(newAnnouncement);

    // Return the saved announcement
    return res.status(201).send(announcement);
  } catch (error) {
    console.error("Error saving announcement:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for getting all announcements from the database
router.get("/", async (req, res) => {
  try {
    // Fetch all announcements from the database
    const announcements = await Announcement.find({});

    // Return the announcements with a count
    return res
      .status(200)
      .json({ count: announcements.length, data: announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for getting a single announcement by ID
router.get("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Find the announcement by ID
    const announcement = await Announcement.findById(id);

    // Check if the announcement exists
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Return the found announcement
    return res.status(200).json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for updating an announcement by ID
router.put("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Log the incoming request body for debugging
    console.log("Received PUT request body:", req.body);

    // Destructure the fields from the request body
    const { title, image, content, pdfName, pdfPath } = req.body;

    // Validate the required fields
    if (!title || !image) {
      return res.status(400).send({ message: "Title and image are required" });
    }

    // Prepare the update object
    const updateData = { title, image, content, pdfName, pdfPath };

    // Perform the update operation
    const result = await Announcement.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true, // Return the updated document
        useFindAndModify: false, // Use the newer findOneAndUpdate() function
      }
    );

    // Check if the announcement was found and updated
    if (!result) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Return the updated announcement
    return res
      .status(200)
      .send({ message: "Announcement updated successfully", data: result });
  } catch (error) {
    console.error("Error updating announcement:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for deleting an announcement by ID
router.delete("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Delete the announcement by ID
    const result = await Announcement.findByIdAndDelete(id);

    // Check if the announcement was found and deleted
    if (!result) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Return a success message
    return res
      .status(200)
      .send({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
