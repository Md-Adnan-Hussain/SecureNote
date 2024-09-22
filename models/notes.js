const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  accessed: {
    type: Boolean,
    default: false,
  },
  pass: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
