import express from "express";
import { validationResult } from "express-validator";
import syncValidator from "./syncValidator";
import { Task1, Task2 } from "./schema";

const router = express.Router();
const command_type = ["create", "update", "delete"];

router.post("/", syncValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (!command_type.includes(req.body.type)) {
    return res.status(404).json({ errors: ["can't find command"] });
  }

  if (req.body.type === "delete") {
    await Task1.findByIdAndRemove(req.body.data._id);
    return res.status(200).json({});
  }

  const data = req.body.data;
  delete data.id;

  const task = await Task1.findOne({ _id: data._id });

  if (task) {
    if (task._rev < data._rev) {
      // copy "task" from Task1 to Task2
      await Task1.findOneAndUpdate({ _id: data._id }, data);

      return new Task2({
        _uid: task._id,
        _rev: task._rev,
        _deleted: task._deleted,
        title: task.title,
        done: task.done,
        _createdAt: task._createdAt,
        _updatedAt: task._updatedAt,
        _hash: task._hash,
        _movedAt: Date.now(),
      })
        .save()
        .then(() => {
          console.log("move to table 2 and update table 1");
          return res.status(200).json({});
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({});
        });
    } else {
      data._uid = data._id;
      delete data._id;

      return new Task2({
        ...data,
        _movedAt: Date.now(),
      })
        .save()
        .then(() => {
          console.log("move to table 2 only");
          return res.status(200).json({});
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({});
        });
    }
  } else {
    return new Task1(data)
      .save()
      .then(() => {
        return res.status(200).json({});
      })
      .catch(() => {
        return res.status(500).json({});
      });
  }
});

export default router;
