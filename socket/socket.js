module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("socket user connected!");
    io.on("join-room", (id) => {});
  });
};
