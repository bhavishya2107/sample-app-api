var express = require("express");
var router = express.Router();
var userRouter = require('./users');

router.get("/", (req, res) => {
  res.send("<h1>Sample API</h1>");
});

router.use("/", userRouter);

module.exports = router;
