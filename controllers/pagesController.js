module.exports.createNote = async (req, res) => {
  try {
    res.render("notes/home.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    res.status(500).render("notes/error.ejs", { message: error.message });
  }
};

module.exports.linkNote = async (req, res) => {
  try {
    const noteData = req.session.newNote;
    delete req.session.newNote;
    res.render("notes/link.ejs", { id: noteData.id, pass: noteData.pass });
  } catch (error) {
    console.log(error);
    res.status(500).render("notes/error.ejs", { message: error.message });
  }
};

module.exports.warning = async (req, res) => {
  try {
    res.render("notes/warning.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    res.status(500).render("notes/error.ejs", { message: error.message });
  }
};

module.exports.getNote = async (req, res) => {
  try {
    res.render("notes/note.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    res.status(500).render("notes/error.ejs", { message: error.message });
  }
};
