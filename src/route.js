import express from "express";
import { Task1, Task2 } from "./schema";

const router = express.Router();
const command_type = ["create", "update", "delete"];

router.post("/", async (req, res) => {
  if (req.body.type === "delete") {
    // delete task1 by req.body.data._id
  }

  const data = req.body.data;
  delete data.id;

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
