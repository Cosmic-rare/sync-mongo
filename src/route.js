import express from "express";
import { Task } from "./schema";
import { bodyValidate, CU_taskValidate, taskValidate } from "./validaitor";

const router = express.Router();

router.get("/", async (req, res) => {
  const keys = await Task.aggregate([
    {
      $group: {
        _id: "$_uid",
        _v: { $max: "$_v" },
      },
    },
  ]);

  keys.map((val, index) => {
    keys[index]._uid = val._id;
    delete keys[index]._id;
  });

  const tasks = await Task.find({ $or: keys });

  return res.status(200).json({ data: tasks });
});

router.get("/last", async (req, res) => {
  const lastUpdate = await Task.aggregate([
    { $sort: { _updatedAt: -1 } },
    { $limit: 1 },
  ]);

  return res.status(200).json({ lastUpdate: lastUpdate[0]._updatedAt });
});

router.post("/", async (req, res) => {
  const errorTasks = [];
  const sucsessTasks = [];

  const bodyValid = bodyValidate(req.body);

  if (!bodyValid) {
    return res.status(400).json({ errors: bodyValidate.errors });
  }

  req.body.datas?.map(async (val, index) => {
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
        case "update":
          const CU_taskValid = CU_taskValidate(val);

          if (!CU_taskValid) {
            errorTasks.push(
              !req.body.error_messages
                ? val.sync_id
                  ? val.sync_id
                  : null
                : {
                    id: val.sync_id ? val.sync_id : null,
                    message: CU_taskValid.errors,
                  }
            );
          } else {
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
              console.log(`emit task ${newTask}`);
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
          }
          break;

        case "delete":
          sucsessTasks.push(val.sync_id);
          console.log(`emit delete id ${val.sync_id}`);
          await Task.deleteMany({ _uid: val._id });
      }
    }
  });

  return res.status(200).json({ sucsess: sucsessTasks, error: errorTasks });
});

export default router;
