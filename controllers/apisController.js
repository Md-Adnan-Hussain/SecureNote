let Note = require("../models/notes.js");
let NotesList = require("../models/notesList.js");
let nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-key";

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

let notifyUser = async (note) => {
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

  try {
    await transporter.sendMail(mailOptions);
    return `Mail has been sent to ${note.email}`;
  } catch (error) {
    console.error("Error sending email:", error);
    return `Failed to send mail to ${note.email}`;
  }
};

module.exports.createNote = async (req, res) => {
  try {
    let { content, expire, email, pass } = req.body;

    const expireMapping = {
      1: 60 * 60,
      2: 60 * 60 * 24,
      3: 60 * 60 * 24 * 7,
      4: 60 * 60 * 24 * 30,
    };

    const expireSeconds = expireMapping[expire] || 60 * 60 * 24 * 365;

    const expiryDate = new Date(Date.now() + expireSeconds * 1000);

    const encryptedContent = encrypt(content);

    const newNote = new Note({
      content: encryptedContent,
      pass: pass || null,
      expiry: expiryDate,
      email: email || null,
    });

    await newNote.save();

    let notesList = await NotesList.findOne();
    if (notesList) {
      notesList.noteIds.push(newNote._id);
      await notesList.save();
    } else {
      const newNotesList = new NotesList({
        noteIds: [newNote._id],
      });
      await newNotesList.save();
    }

    notesList = await NotesList.find({});

    console.log(newNote, "\n", notesList);

    req.session.newNote = { id: newNote._id, pass: pass };
    res.redirect("/link");
  } catch (error) {
    console.error(error);
    res.status(500).render("notes/error.ejs", { message: error.message });
  }
};

module.exports.getNote = async (req, res) => {
  try {
    const id = req.params.id;

    console.log(id);

    const note = await Note.findById(id);
    if (note) {
      const noteContent = decrypt(note.content);

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
    res.status(500).render("notes/error.ejs", { message: error.message });
  }
};
