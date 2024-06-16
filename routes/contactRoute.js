import express from "express";
import { Contact } from "../models/contactModel.js";
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
});
const upload = multer({ storage: storage });

// Route for Save a new Contact
router.post("/", upload.single("file"), async (request, response) => {
  try {
    if (!request.body.name || !request.body.phone || !request.body.telegram) {
      return response.status(400).send({
        message: "name, phone, telegram input are required",
      });
    }

    const newContact = {
      name: request.body.name,
      phone: request.body.phone,
      telegram: request.body.telegram,
      img: request?.file?.filename,
    };

    const contact = await Contact.create(newContact);

    return response.status(201).send(contact);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Schedules from database
router.get("/", async (request, response) => {
  try {
    const contacts = await Contact.find({});

    return response.status(200).json({
      count: contacts.length,
      data: contacts,
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

    const contact = await Contact.findById(id);

    return response.status(200).json(contact);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.put("/:id", upload.single("file"), async (request, response) => {
  try {
    const { id } = request.params;
    const { name, phone, telegram, file: filePathFromBody } = request.body;
    const fileFromMulter = request.file; // File information from multer

    // Check if name is provided
    if (!name) {
      return response.status(400).send({ message: "name is required" });
    }
    if (!phone) {
      return response.status(400).send({ message: "phone is required" });
    }
    if (!telegram) {
      return response.status(400).send({ message: "telegram is required" });
    }

    // Prepare the update object
    let updateData = { name, phone, telegram };
    let unsetData = {};

    if (fileFromMulter) {
      // If a file is uploaded via multer, update the 'img' field with the uploaded file path
      updateData.img = fileFromMulter.filename;
    } else if (
      filePathFromBody === null ||
      filePathFromBody === "null" ||
      filePathFromBody === undefined ||
      filePathFromBody === "undefined"
    ) {
      // If the file field in the body is 'null' or the string "null", remove the 'img' field
      unsetData.img = 1; // This tells MongoDB to unset (remove) the 'img' field
    } else if (filePathFromBody) {
      updateData.img = filePathFromBody;
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
    const result = await Contact.findByIdAndUpdate(id, updateQuery, {
      new: true,
      useFindAndModify: false,
    });

    if (!result) {
      return response.status(404).json({ message: "Contact not found" });
    }

    return response
      .status(200)
      .send({ message: "Contact updated successfully", data: result });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Contact.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Contact not found" });
    }

    return response
      .status(200)
      .send({ message: "Contact deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
