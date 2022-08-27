const req_body = {
  id: "753a94a0-9ecc-4093-aa9d-8b3952d15d9c",
  // sync id

  _id: "278707d2-4fac-4f2f-b54c-1d9ad33e72f3",
  // task id

  _rev: 8,
  // revision

  _deleted: false,
  // is in trash?

  title: "A8",
  // task title

  done: false,
  // task is done?

  _createdAt: 1660950963784.0,
  // task created at

  _updatedAt: 1660951016658.0,
  // task updated at

  _hash: "8e78c76279bd7e399f9a4223dd2e577c",
  // hashed task

  type: "create, update, delete",
  // sync query type

  _v: 10000000000000 * task_data._rev + task_data.updatedAt,
  // revision to sort task
};

const res_body = {
  sucsess: ["753a94a0-9ecc-4093-aa9d-8b3952d15d9c"],
  // sync sucsessful task id(s)

  error: ["753a94a0-9ecc-4093-aa9d-8b3952d15d9c"],
  // sync error task id(s)
};
