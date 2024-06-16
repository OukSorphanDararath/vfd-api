import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Assuming 'name' is required
  phone: { type: String, required: true },
  telegram: { type: String, required: true },
  img: { type: String }, // Assuming 'file' is required and stores file path
});

export const Contact = mongoose.model("Contact", contactSchema);
