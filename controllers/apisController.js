let Note = require("../models/notes.js");
let NotesList = require("../models/notesList.js");
let nodemailer = require("nodemailer");

async function notifyUser(note) {
  if (!note.email) return null;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: note.email,
    subject: "Your Note Has Been Accessed",
    text: `The following note has been accessed:\n\n${note.content}`,
  };

  await transporter.sendMail(mailOptions);

  return `Mail has been sent to ${note.email}`;
}

module.exports.createNote = async (req, res) => {
  try {
    let { content, expire, email, pass } = req.body;

    console.log(content, expire, email, pass);

    const expiryDate = expire ? new Date(Date.now() + expire * 1000) : null;

    const newNote = new Note({
      content,
      pass: pass || null,
      expiry: expiryDate,
      email: email || null,
    });

    await newNote.save();

    const notesList = await NotesList.findOne();
    if (notesList) {
      notesList.noteIds.push(newNote._id);
      await notesList.save();
    } else {
      const newNotesList = new NotesList({
        noteIds: [newNote._id],
      });
      await newNotesList.save();
    }

    return res.status(201).json({
      noteId: newNote._id,
      url: `SampleUrl/${newNote._id}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports.getNote = async (req, res) => {
  try {
    const id = req.params.id;

    console.log(id);

    const note = await Note.findById(id);
    if (note) {
      const noteContent = note.content;

      let notificationMessage = null;
      if (note.email) {
        notificationMessage = await notifyUser(note);
      }

      await Note.deleteOne({ _id: id });

      return res.status(200).json({
        content: noteContent,
        success: true,
        notification: notificationMessage,
      });
    }

    const notesList = await NotesList.findOne();
    if (notesList && notesList.noteIds.includes(id)) {
      return res.status(200).json({
        message: "Note has been accessed already and deleted.",
        success: true,
      });
    }

    return res.status(404).json({
      message: "No such note created.",
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
