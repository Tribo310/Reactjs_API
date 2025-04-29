const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Place = require("../models/Place");

// Get current user
router.get("/currentUser", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  try {
    const user = await User.findById(userId).populate("createdPlaces");
    if (!user) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // Don't send password back
    const userResponse = {
      id: user._id,
      username: user.username,
      userImgUrl: user.userImgUrl,
      createdPlaces: user.createdPlaces,
    };

    res.json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Get all users
router.get("/allUsers", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  try {
    const currentUser = await User.findById(userId).populate("createdPlaces");
    const otherUsers = await User.find({ _id: { $ne: userId } });

    // Don't send passwords back
    const currentUserResponse = currentUser
      ? {
          id: currentUser._id,
          username: currentUser.username,
          userImgUrl: currentUser.userImgUrl,
          createdPlaces: currentUser.createdPlaces,
        }
      : null;

    const otherUsersResponse = otherUsers.map((user) => ({
      id: user._id,
      username: user.username,
      userImgUrl: user.userImgUrl,
      createdPlaces: user.createdPlaces,
    }));

    res.status(200).json({
      currentUser: currentUserResponse,
      otherUsers: otherUsersResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
