const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./initialize-db");
const { connectDB } = require("./connect-db");
const { addNewTask, updateTask } = require("./communicate-db");
let app = express();

require("dotenv").config();

app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const { assembleUserState } = require("./utility");

const authenticationTokens = [];
app.post("/authenticate", async (req, res) => {
  let { username, password } = req.body;
  let db = await connectDB();
  let collection = db.collection(`users`);
  let user = await collection.findOne({ name: username });
  if (!user) {
    return res.status(500).send(`User not found`);
  }
  let hash = md5(password);
  let passwordCorrect = hash === user.passwordHash;
  if (!passwordCorrect) {
    return res.status(500).send("Password incorrect");
  }

  let token = uuidv4();

  authenticationTokens.push({
    token,
    userID: user.id,
  });

  let state = await assembleUserState(user);

  res.send({ token, state });
});

app.post("/user/create", async (req, res) => {
  let { username, password } = req.body;
  let db = await connectDB();
  let collection = db.collection(`users`);
  let user = await collection.findOne({ name: username });
  if (user) {
    res
      .status(500)
      .send({ message: "A user with that account name already exists." });
    return;
  }

  let userID = uuidv4();
  let groupID = uuidv4();

  await collection.insertOne({
    name: username,
    id: userID,
    passwordHash: md5(password),
  });

  await db.collection(`groups`).insertOne({
    id: groupID,
    owner: userID,
    name: `To Do`,
  });

  await db.collection(`groups`).insertOne({
    id: uuidv4(),
    owner: userID,
    name: `In Progress`,
  });

  await db.collection(`groups`).insertOne({
    id: uuidv4(),
    owner: userID,
    name: `Finished`,
  });

  let state = await assembleUserState({ id: userID, name: username });

  res.status(200).send({ userID, state });
});

app.post("/task/new", async (req, res) => {
  // let task = req.body.task;
  await addNewTask(req.body.task);
  res.status(200).send();
});

app.post("/task/update", async (req, res) => {
  await updateTask(req.body.task);
  res.status(200).send();
});

app.post("/comment/new", async (req, res) => {
  let comment = req.body.comment;
  let db = await connectDB();
  let collection = db.collection(`comments`);
  await collection.insertOne(comment);
  res.status(200).send();
});

if (process.env.NODE_ENV === `production`) {
  app.use(express.static(path.join(__dirname, "../../build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve("build/index.html"));
  });
}

const port = process.env.PORT || 7777;
app.listen(port, console.info("Server running, listening on port ", port));
