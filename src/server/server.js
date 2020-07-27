const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./initialize-db");
const { authenticationRoute } = require("./authenticate");

const { connectDB } = require("./connect-db");
const { addNewTask, updateTask } = require("./communicate-db");
let app = express();

require("dotenv").config();

app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());

authenticationRoute(app);

if (process.env.NODE_ENV === `production`) {
  app.use(express.static(path.join(__dirname, "../../build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve("build/index.html"));
  });
}

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

const port = process.env.PORT || 7777;
console.log("port = ", port);
app.listen(port, console.info("Server running, listening on port ", port));
