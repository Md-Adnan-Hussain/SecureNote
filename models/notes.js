const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    index: { expires: 0 },
  },
  email: {
    type: String,
    default: null,
  },
});

noteSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
