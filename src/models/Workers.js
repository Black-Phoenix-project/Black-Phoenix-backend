const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      enum: ["Faol", "Dam olishda"],
      default: "Faol",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
