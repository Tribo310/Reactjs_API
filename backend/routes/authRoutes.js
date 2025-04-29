const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Нэвтрэх нэр болон нууц үгийг бөглөнө үү" });
  }

  try {
    const user = await User.findOne({ username: email, password });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Нэвтрэх нэр эсвэл нууц үг буруу байна" });
    }

    // Don't send password back
    const userResponse = {
      id: user._id,
      username: user.username,
      userImgUrl: user.userImgUrl,
      createdPlaces: user.createdPlaces,
    };

    return res.status(200).json({
      message: "Амжилттай нэвтэрлээ",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, password, userImgUrl } = req.body;

  if (!username || !password || !userImgUrl) {
    return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Нууц үг 6 тэмдэгтээс дээш байх ёстой" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Хэрэглэгчийн нэр бүртгэлтэй байна" });
    }

    const newUser = new User({
      username,
      password,
      userImgUrl,
      createdPlaces: [],
    });

    await newUser.save();

    // Don't send password back
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      userImgUrl: newUser.userImgUrl,
      createdPlaces: newUser.createdPlaces,
    };

    res
      .status(201)
      .json({ message: "Амжилттай бүртгэгдлээ", user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
