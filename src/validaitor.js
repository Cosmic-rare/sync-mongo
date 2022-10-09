import Ajv from "ajv";
const ajv = new Ajv();

const bodySchema = {
  required: ["type", "sync_id", "task", "clientId"],
  type: "object",
  properties: {
    type: {
      type: "string",
      pattern: "^(create|update|delete)+$",
    },
    sync_id: { type: "string" },
    task: {
      required: [
        "task_id",
        "title",
        "done",
        "_rev",
        "_deleted",
        "_createdAt",
        "_updatedAt",
        "_hash",
      ],
      type: "object",
      properties: {
        task_id: { type: "string" },
        title: { type: "string" },
        done: { type: "boolean" },
        _rev: { type: "number" },
        _deleted: { type: "boolean" },
        _createdAt: { type: "number" },
        _updatedAt: { type: "number" },
        _hash: { type: "string" },
      },
    },
    clientId: { type: "string" },
  },
};

export const bodyValidate = ajv.compile(bodySchema);
