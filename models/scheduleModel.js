import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The schedule name is required
  pdfPath: { type: String, required: false }, // The file path is optional
  pdfName: { type: String, required: false }, // The display name is optional
  schedules: [
    {
      Subject: { type: String, required: false },
      Day: { type: String, required: false },
      Time: { type: String, required: false },
      Room: { type: String, required: false },
      Campus: { type: String, required: false },
      Instructor: { type: String, required: false },
    },
  ],
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
