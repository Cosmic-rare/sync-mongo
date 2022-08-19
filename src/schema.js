import mongoose from "mongoose";

const Task1Type = new mongoose.Schema({
  _id: String,
  _rev: Number,
  _deleted: Boolean,
  title: String,
  done: Boolean,
  _createdAt: Number,
  _updatedAt: Number,
  _hash: String,
});

const Task2Type = new mongoose.Schema({
  _uid: String,
  _rev: Number,
  _deleted: Boolean,
  title: String,
  done: Boolean,
  _createdAt: Number,
  _updatedAt: Number,
  _hash: String,
  _movedAt: Number,
});

export const Task1 = mongoose.model("Task1", Task1Type);
export const Task2 = mongoose.model("Task2", Task2Type);
