module.exports.createNote = async (req, res) => {
  try {
    res.render("notes/home.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports.linkNote = async (req, res) => {
  try {
    res.render("notes/link.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports.warning = async (req, res) => {
  try {
    res.render("notes/warning.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports.getNote = async (req, res) => {
  try {
    res.render("notes/note.ejs", { message: "Hello" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
