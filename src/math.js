const express = require("express");

const math = express.Router();

math.use("/square/:n", (req, res) => {
  const n = parseInt(req.params.n, 10);
  res.json({ input: n, output: n * n });
});

math.use("/squareroot/:n", (req, res) => {
  const n = parseInt(req.params.n, 10);
  res.json({ input: n, output: Math.pow(n, 0.5) });
});

module.exports = math;
