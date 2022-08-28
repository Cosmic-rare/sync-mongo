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
  required: ["type", "title", "_id"],
  type: "object",
  properties: {
    type: {
      type: "string",
      pattern: "^(create|update|delete)+$",
    },
    title: {
      type: "string",
    },
    _id: {
      type: "string",
    },
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
          ? val._id
            ? val._id
            : null
          : { id: val._id ? val._id : null, message: taskValidate.errors }
      );
    } else {
      sucsessTasks.push(val._id);
    }
  });

  return res.status(200).json({ sucsess: sucsessTasks, error: errorTasks });

  /*
  if req.body.type == delete
    delete task1 by req.body.data._id
  */

  /*
  if task1.find by req.body.data._id 
    if task1._rev < req.body.data._rev
      update task1 by req.body.data
      create task2 by task1.findOne by req.body.data.id
    else 
       create task2 by req.body.data
  else 
   create task1 by req.body.data
  */
});

export default router;
