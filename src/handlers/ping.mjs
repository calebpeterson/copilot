export const ping = (req, res) => {
  console.log("Received ping");
  res.send("pong");
};
