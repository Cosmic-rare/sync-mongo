import mongoose from "mongoose";

const TaskType = new mongoose.Schema({
  task_id: String,
  title: String,
  done: Boolean,
  _rev: Number,
  _deleted: Boolean,
  _createdAt: Number,
  _updatedAt: Number,
  _hash: String,
  _v: Number,
});

export const Task = mongoose.model("Task", TaskType);
