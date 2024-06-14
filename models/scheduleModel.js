import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Assuming 'name' is required
  pdf: { type: String }, // Assuming 'file' is required and stores file path
  // other fields as needed
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
