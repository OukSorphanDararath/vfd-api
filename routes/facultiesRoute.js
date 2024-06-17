// routes/facultiesRoute.js
import express from "express";
import { Faculties } from "../models/facultiesModel.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setup multer for image and PDFs upload (combined storage setup)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Using a single directory for simplicity
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// CRUD Routes for Faculties

// Create a new Faculty with majors and img
router.post(
  "/",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { facultiesName } = req.body;
      const imgFile = req.files["img"] ? req.files["img"][0] : null;
      const pdfFiles = req.files["pdfs"] || [];

      // Process majors from req.body
      const majors = [];
      let index = 0;
      while (req.body[`majors[${index}][majorName]`] !== undefined) {
        majors.push({
          majorName: req.body[`majors[${index}][majorName]`],
          pdf: pdfFiles[index] ? pdfFiles[index].path : null,
        });
        index++;
      }

      const faculty = new Faculties({
        facultiesName,
        img: imgFile ? imgFile.path : null,
        majors,
      });

      await faculty.save();
      res.status(201).send(faculty);
    } catch (error) {
      console.error("Error creating faculty:", error);
      res.status(500).send({ error: error.message });
    }
  }
);

// Read all Faculties
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculties.find();
    res.status(200).send(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).send({ error: error.message });
  }
});

// Read a specific Faculty by ID
router.get("/:id", async (req, res) => {
  try {
    const faculty = await Faculties.findById(req.params.id);
    if (!faculty) {
      return res.status(404).send({ error: "Faculty not found" });
    }
    res.status(200).send(faculty);
  } catch (error) {
    console.error("Error fetching faculty by ID:", error);
    res.status(500).send({ error: error.message });
  }
});

// Update a Faculty by ID with new img and/or pdfs
router.put(
  "/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "pdfs", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { facultiesName } = req.body;
      const imgFile = req.files["img"] ? req.files["img"][0] : null;
      const pdfFiles = req.files["pdfs"] || [];

      // Process majors from req.body
      const majors = [];
      let index = 0;
      while (req.body[`majors[${index}][majorName]`] !== undefined) {
        majors.push({
          majorName: req.body[`majors[${index}][majorName]`],
          pdf: pdfFiles[index] ? pdfFiles[index].path : null,
        });
        index++;
      }

      const updateData = {
        facultiesName,
        majors,
      };

      // If a new img file is uploaded, include it in the update
      if (imgFile) {
        updateData.img = imgFile.path;
      }

      const faculty = await Faculties.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!faculty) {
        return res.status(404).send({ error: "Faculty not found" });
      }
      res.status(200).send(faculty);
    } catch (error) {
      console.error("Error updating faculty:", error);
      res.status(500).send({ error: error.message });
    }
  }
);

// Delete a Faculty by ID
router.delete("/:id", async (req, res) => {
  try {
    const faculty = await Faculties.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).send({ error: "Faculty not found" });
    }
    res.status(200).send({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).send({ error: error.message });
  }
});

export default router;
