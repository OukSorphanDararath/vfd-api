import mongoose from "mongoose";

// Define the Major Schema
const majorSchema = new mongoose.Schema({
  majorName: {
    type: String,
    required: true,
  },
  pdf: {
    type: String, // File path as a string
    required: true,
  },
});

// Define the Faculty Schema
const facultiesSchema = new mongoose.Schema({
  facultiesName: {
    type: String,
    required: true,
  },
  img: { type: String },
  majors: [majorSchema], // Embedding majors as a sub-document
});

// Create and export the Faculties model
export const Faculties = mongoose.model("Faculties", facultiesSchema);
