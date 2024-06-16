import mongoose from "mongoose";

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Assuming 'name' is required
  map: { type: String }, // Assuming 'file' is required and stores file path
});

export const Campus = mongoose.model("Schedule", campusSchema);
