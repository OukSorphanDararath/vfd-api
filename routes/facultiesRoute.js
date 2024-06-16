import express from "express";
import { Faculties } from "../models/faculties.js";
import multer from "multer";

const router = express.Router();
// // Middleware for parsing JSON and form data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for serving static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// CRUD Routes for Faculties

// Create a new Faculties with majors
app.post('/', upload.array('pdfs', 10), async (req, res) => {
  try {
    const { facultyName, majors } = req.body;
    const files = req.files;

    // Process majors to include file paths
    const processedMajors = majors.map((major, index) => ({
      majorName: major.majorName,
      pdf: files[index] ? files[index].path : null
    }));

    const faculty = new Faculties({
      facultyName,
      majors: processedMajors
    });

    await faculty.save();
    res.status(201).send(faculty);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Read all Faculties
app.get('/', async (req, res) => {
  try {
    const faculties = await Faculties.find();
    res.status(200).send(faculties);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Read a specific Faculties by ID
app.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculties.findById(req.params.id);
    if (!faculty) {
      return res.status(404).send({ error: 'Faculties not found' });
    }
    res.status(200).send(faculty);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a Faculties by ID
app.put('/:id', upload.array('pdfs', 10), async (req, res) => {
  try {
    const { facultyName, majors } = req.body;
    const files = req.files;

    // Process majors to include file paths
    const processedMajors = majors.map((major, index) => ({
      majorName: major.majorName,
      pdf: files[index] ? files[index].path : major.pdf // Update with new file or keep old one
    }));

    const faculty = await Faculties.findByIdAndUpdate(
      req.params.id,
      { facultyName, majors: processedMajors },
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).send({ error: 'Faculties not found' });
    }
    res.status(200).send(faculty);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a Faculties by ID
app.delete('/:id', async (req, res) => {
  try {
    const faculty = await Faculties.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).send({ error: 'Faculties not found' });
    }
    res.status(200).send({ message: 'Faculties deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
