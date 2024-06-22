import express from "express";
import { Contact } from "../models/contactModel.js";

const router = express.Router();

// Middleware to parse JSON and form-data requests
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Route for saving a new contact
router.post("/", async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Received POST request body:", req.body);

    // Destructure required fields from request body
    const { name, phone, telegram, img } = req.body;

    // Validate the required fields
    if (!name || !phone || !telegram) {
      return res.status(400).send({
        message: "name, phone, and telegram are required",
      });
    }

    // Create a new contact object
    const newContact = { name, phone, telegram, img };

    // Save the contact to the database
    const contact = await Contact.create(newContact);

    // Return the saved contact
    return res.status(201).send(contact);
  } catch (error) {
    console.error("Error saving contact:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for getting all contacts from the database
router.get("/", async (req, res) => {
  try {
    // Fetch all contacts from the database
    const contacts = await Contact.find({});

    // Return the contacts with a count
    return res.status(200).json({ count: contacts.length, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for getting a single contact by ID
router.get("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Find the contact by ID
    const contact = await Contact.findById(id);

    // Check if the contact exists
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Return the found contact
    return res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for updating a contact by ID
router.put("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Log the incoming request body for debugging
    console.log("Received PUT request body:", req.body);

    // Destructure the fields from the request body
    const { name, phone, telegram, img } = req.body;

    // Validate the required fields
    if (!name || !phone || !telegram) {
      return res
        .status(400)
        .send({ message: "name, phone, and telegram are required" });
    }

    // Prepare the update object
    const updateData = { name, phone, telegram, img };

    // Perform the update operation
    const result = await Contact.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true, // Return the updated document
        useFindAndModify: false, // Use the newer findOneAndUpdate() function
      }
    );

    // Check if the contact was found and updated
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Return the updated contact
    return res
      .status(200)
      .send({ message: "Contact updated successfully", data: result });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for deleting a contact by ID
router.delete("/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Delete the contact by ID
    const result = await Contact.findByIdAndDelete(id);

    // Check if the contact was found and deleted
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Return a success message
    return res.status(200).send({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
