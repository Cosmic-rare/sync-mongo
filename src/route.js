import express from "express";

const router = express.Router();

import Ajv from "ajv";

const ajv = new Ajv();

const schema = {
  required: ["type"],
  type: "object",
  properties: {
    type: {
      type: "string",
      pattern: "create|update|delete",
    },
  },
};

const validate = ajv.compile(schema);

router.post("/", async (req, res) => {
  // バリデーションを実行
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({ errors: validate.errors });
  }
  return res.status(200).json({ status: "sucsess" });

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
