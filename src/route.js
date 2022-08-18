import express from "express";
import { validationResult } from "express-validator";
import syncValidator from "./syncValidator";
import { Task1 } from "./schema";

const router = express.Router();
const command_type = ["create", "update", "delete"];

router.post("/", syncValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (command_type.includes(req.body.type)) {
    if (req.body.type === "delete") {
      await Task1.findByIdAndRemove(req.body.data._id);
      console.log("delete");
    } else {
      const data = req.body.data;
      delete data.id;

      const task = await Task1.findOne({ _id: data._id });

      if (task) {
        if (task._rev < data._rev) {
          await Task1.findOneAndUpdate({ _id: data._id }, data);
        }
      } else {
        return new Task1(data).save().catch(() => {
          return res.status(500).json({});
        });
      }
    }
  }

  return res.status(200).json({});
});

export default router;
