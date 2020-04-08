var express = require("express");
var router = express.Router();
var User = require("../../models/User");
var auth = require("../../modules/auth");
var jwt = require("jsonwebtoken");
var updatePW = auth.updatePW;

//register user
router.post("/users", async (req, res) => {
  try {
    var user = await User.create(req.body);
    res.json({ success: "true", user });
  } catch (error) {
    res.status(400).json(error);
  }
});

//login user
router.post("/users/login", async (req, res) => {
  var { email, password } = req.body;
  try {
    var user = await User.findOne({ email });
    if (!user) return res.json({ error: "email invalid" });

    //jwt token auth
    var payload = { UserId: user.id, email: user.email };
    var token = await jwt.sign(payload, process.env.SECRET);
    user.token = token;
    var updateUser = await User.findByIdAndUpdate(
      user.id,
      {
        lastActive: new Date(),
      },
      { new: true }
    );

    if (updateUser.disable) {
      return res.json({ success: true, msg: "User disabled by admin" });
    }

    res.json({ success: "true", token, updateUser });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//get all users
router.get("/users", async (req, res) => {
  try {
    var user = await User.find({});
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/users/:id", async (req, res) => {
  try {
    var user = await User.findByIdAndUpdate(
      req.params.id,
      { disable: true },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    var user = await User.findByIdAndUpdate(
      req.params.id,
      { disable: false },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
