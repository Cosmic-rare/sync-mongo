import { check } from "express-validator";

export default [
  check("type").not().isEmpty(),
  check("data._id").isUUID(),
  check("data._rev").isInt(),
  check("data._deleted").isBoolean(),
  check("data.title").not().isEmpty(),
  check("data.done").isBoolean(),
  check("data._createdAt").isInt(),
  check("data._updatedAt").isInt(),
  check("data._hash").isMD5(),
  check("data.id").not().isEmpty(),
];
