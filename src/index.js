import express from "express";
import socket from "socket.io";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { check, validationResult } from "express-validator";

const Task1Type = new mongoose.Schema({
  _uid: String,
  _rev: Number,
  _deleted: Boolean,
  title: String,
  done: Boolean,
  _createdAt: Number,
  _updatedAt: Number,
  _hash: String,
});

const app = express();
const server = http.Server(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});
const PORT = 4000;
const command_type = ["create", "update", "delete"];

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost/sync-db");
const Task1 = mongoose.model("Task1", Task1Type);

app.post(
  "/",
  [
    check("type").not().isEmpty(),
    check("data._id").isUUID(),
    check("data._rev").isInt(),
    check("data._deleted").isBoolean(),
    check("data.title").not().isEmpty(),
    check("data.done").isBoolean(),
    check("data._createdAt").isInt(),
    check("data._updatedAt").isInt(),
    check("data._hash").isMD5(),
    check("data.id").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (command_type.includes(req.body.type)) {
      console.log(req.body.data.id);
    }

    return res.status(200).json({});
  }
);

io.on("connection", (socket) => {
  console.log("connected", socket.id);
});

server.listen(PORT, () => {
  console.log(`dev server running at: http://localhost:${PORT}/`);
});
