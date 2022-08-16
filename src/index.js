import express from "express";
import socket from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.Server(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  req.body.commands.map((val) => {
    console.log(val.type);
  });
  return res.status(200).json({});
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);
});

server.listen(PORT, () => {
  console.log(`dev server running at: http://localhost:${PORT}/`);
});
