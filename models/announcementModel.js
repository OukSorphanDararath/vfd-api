import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: false },
  link: { type: String, require: false },
});

export const Announcement = mongoose.model("Announcement", announcementSchema);
