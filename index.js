require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const notesRouter = require("./routes/noteRouter.js");

const mongodbStore = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

mongodbStore.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: mongodbStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
}

main()
  .then((res) => {
    console.log("Successfully connected to Database\n");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session(sessionOptions));

app.get("/", (req, res) => {
  res.send("App is working");
});

app.use("/api/notes", notesRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to http://localhost:${process.env.PORT} \n`);
});
