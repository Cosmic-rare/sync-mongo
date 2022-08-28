import express from "express";
import { Task } from "./schema";
import { bodyValidate, taskValidate } from "./validaitor";

const router = express.Router();

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
      switch (val.type) {
        case "create":
          let createTask = val;
          createTask._uid = val._id;
          delete createTask._id, createTask.sync_id, createTask.type;

          try {
            const newTask = new Task({
              ...createTask,
              _v: 10000000000000 * createTask._rev + createTask._updatedAt,
            });
            newTask.save();
            sucsessTasks.push(val.sync_id);
          } catch (e) {
            errorTasks.push(
              !req.body.error_messages
                ? val.sync_id
                  ? val.sync_id
                  : null
                : {
                    id: val.sync_id ? val.sync_id : null,
                  }
            );
          }
          break;
        default:
          sucsessTasks.push(val._id);
      }
      /*
      if req.body.type == delete
        delete task(s) by val._id
      */
    }
  });

  return res.status(200).json({ sucsess: sucsessTasks, error: errorTasks });
});

export default router;
