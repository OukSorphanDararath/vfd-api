import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The schedule name is required
  pdfPath: { type: String, required: false }, // The file path is optional
  pdfName: { type: String, required: false }, // The display name is optional
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
