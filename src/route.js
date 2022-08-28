import express from "express";
import Ajv from "ajv";
import { Task } from "./schema";

const router = express.Router();
const ajv = new Ajv();

const bodySchema = {
  required: ["datas", "error_messages"],
  type: "object",
  properties: {
    datas: {
      type: "array",
    },
    error_messages: {
      type: "boolean",
    },
  },
};

const taskSchema = {
  required: [
    "sync_id",
    "_id",
    "_rev",
    "_deleted",
    "title",
    "done",
    "_createdAt",
    "_updatedAt",
    "_hash",
    "type",
  ],
  type: "object",
  properties: {
    type: {
      type: "string",
      pattern: "^(create|update|delete)+$",
    },
    sync_id: { type: "string" },
    _id: { type: "string" },
    _rev: { type: "number" },
    _deleted: { type: "boolean" },
    title: { type: "string" },
    done: { type: "boolean" },
    _createdAt: { type: "number" },
    _updatedAt: { type: "number" },
    _hash: { type: "string" },
  },
};

const bodyValidate = ajv.compile(bodySchema);
const taskValidate = ajv.compile(taskSchema);

router.post("/", async (req, res) => {
  const errorTasks = [];
  const sucsessTasks = [];

  const bodyValid = bodyValidate(req.body);

  if (!bodyValid) {
    return res.status(400).json({ errors: bodyValidate.errors });
  }

  req.body.datas?.map((val, index) => {
    const taskValid = taskValidate(val);
    if (!taskValid) {
      errorTasks.push(
        !req.body.error_messages
          ? val.sync_id
            ? val.sync_id
            : null
          : {
              id: val.sync_id ? val.sync_id : null,
              message: taskValidate.errors,
            }
      );
    } else {
      /*
      if req.body.type == delete
        delete task(s) by val._id

      create task by val
      */
      sucsessTasks.push(val._id);
    }
  });

  return res.status(200).json({ sucsess: sucsessTasks, error: errorTasks });
});

export default router;
