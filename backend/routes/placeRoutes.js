const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const User = require("../models/User");

// Add place endpoint
router.post("/placeadd", async (req, res) => {
  const {
    createdUserID,
    placeName,
    placeImgUrl,
    placeDescription,
    placeAddress,
  } = req.body;

  if (!createdUserID || !placeName || !placeDescription || !placeImgUrl) {
    return res
      .status(400)
      .json({ error: "Бүх нэмэх газрын талбарыг бөглөнө үү" });
  }

  try {
    const user = await User.findById(createdUserID);
    if (!user) {
      return res.status(403).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    const newPlace = new Place({
      createdUserID,
      placeName,
      placeImgUrl,
      placeDescription,
      placeAddress,
    });

    await newPlace.save();

    // Add place to user's createdPlaces
    user.createdPlaces.push(newPlace._id);
    await user.save();

    res.status(201).json({
      message: "Амжилттай бүртгэгдлээ",
      place: newPlace,
      user: {
        id: user._id,
        username: user.username,
        userImgUrl: user.userImgUrl,
        createdPlaces: user.createdPlaces,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Delete place endpoint
router.delete("/places/:id", async (req, res) => {
  const placeId = req.params.id;
  const { userId } = req.body; // Assuming you send userId in the request body

  if (!userId) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Газрын мэдээлэл олдсонгүй" });
    }

    if (place.createdUserID !== userId) {
      return res
        .status(403)
        .json({ error: "Зөвхөн өөрийн газрыг устгах боломжтой" });
    }

    // Remove place from user's createdPlaces
    await User.findByIdAndUpdate(userId, {
      $pull: { createdPlaces: placeId },
    });

    // Delete the place
    await Place.findByIdAndDelete(placeId);

    res.status(200).json({
      message: "Газрын мэдээлэл амжилттай устгагдлаа",
      deletedPlace: place,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Update place endpoint
router.put("/places/:id", async (req, res) => {
  const placeId = req.params.id;
  const { placeName, placeImgUrl, placeDescription, placeAddress, userId } =
    req.body;

  if (!placeName || !placeDescription || !placeImgUrl || !userId) {
    return res
      .status(400)
      .json({ error: "Бүх заавал бөглөх талбарыг бөглөнө үү" });
  }

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Газрын мэдээлэл олдсонгүй" });
    }

    if (place.createdUserID !== userId) {
      return res
        .status(403)
        .json({ error: "Та энэ газрыг өөрчлөх эрхгүй байна" });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      {
        placeName,
        placeImgUrl,
        placeDescription,
        placeAddress: placeAddress || place.placeAddress,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Газрын мэдээлэл амжилттай шинэчлэгдлээ",
      place: updatedPlace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// Get user places
router.get("/userPlaces/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const places = await Place.find({ createdUserID: userId });
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
