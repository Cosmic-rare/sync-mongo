import express from "express";
import { Task } from "./schema";
import { bodyValidate } from "./validaitor";

const router = express.Router();

router.get("/", async (req, res) => {
  const keys = await Task.aggregate([
    {
      $group: {
        _id: "$task_id",
        _v: { $max: "$_v" },
      },
    },
  ]);

  keys.map((val, index) => {
    keys[index].task_id = val._id;
    delete keys[index]._id;
  });

  return res.status(200).json({
    tasks: await Task.find(keys.length === 0 ? {} : { $or: keys }).select(
      "-_id"
    ),
  });
});

router.post("/", async (req, res) => {
  // 同じデータに関する処理を追加

  if (!bodyValidate(req.body)) {
    return res.status(400).json({ ok: false, errors: bodyValidate.errors });
  }

  const bodyData = req.body.task;

  switch (req.body.type) {
    case "create":
    case "update":
      try {
        await new Task({
          ...bodyData,
          _v: 10000000000000 * bodyData._rev + bodyData._updatedAt,
        }).save();

        req.io.emit("CU_task", bodyData);
      } catch (err) {
        return res.status(500).json({ ok: false });
      }

      break;

    case "delete":
      req.io.emit("D_task", bodyData.task_id);
      await Task.deleteMany({ task_id: bodyData.task_id });
  }

  return res.status(200).json({ ok: true, sync_id: req.body.sync_id });
});

// task_idで取得する(復元とかのやつ)

export default router;
