import express from "express";
import { Schedule } from "../models/scheduleModel.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
})
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

router.put("/:id", upload.single("file"), async (request, response) => {
  try {
    const { id } = request.params;
    const { name, file: filePathFromBody } = request.body;
    const fileFromMulter = request.file; // File information from multer

    // Check if name is provided
    if (!name) {
      return response.status(400).send({ message: "name is required" });
    }

    // Prepare the update object
    let updateData = { name };
    let unsetData = {};

    if (fileFromMulter) {
      // If a file is uploaded via multer, update the 'pdf' field with the uploaded file path
      updateData.pdf = fileFromMulter.filename;
    } else if (
      filePathFromBody === null ||
      filePathFromBody === "null" ||
      filePathFromBody === undefined ||
      filePathFromBody === "undefined"
    ) {
      // If the file field in the body is 'null' or the string "null", remove the 'pdf' field
      unsetData.pdf = 1; // This tells MongoDB to unset (remove) the 'pdf' field
    } else if (filePathFromBody) {
      updateData.pdf = filePathFromBody;
    }

    // Build the update query
    const updateQuery = {};
    if (Object.keys(updateData).length > 0) {
      updateQuery.$set = updateData;
    }
    if (Object.keys(unsetData).length > 0) {
      updateQuery.$unset = unsetData;
    }

    // Log update query for debugging
    console.log("Update query:", updateQuery);

    // Perform the update operation
    const result = await Schedule.findByIdAndUpdate(id, updateQuery, {
      new: true,
      useFindAndModify: false,
    });

    if (!result) {
      return response.status(404).json({ message: "Schedule not found" });
    }

    return response
      .status(200)
      .send({ message: "Schedule updated successfully", data: result });
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
