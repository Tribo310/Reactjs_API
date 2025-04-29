const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

let users = [];
let places = [];
let currentUser = null;

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Нэвтрэх нэр болон нууц үгийг бөглөнө үү" });
  }

  const user = users.find(
    (u) => u.username === email && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ error: "Нэвтрэх нэр эсвэл нууц үг буруу байна" });
  }

  currentUser = {
    id: user.id,
    username: user.username,
    userImgUrl: user.userImgUrl,
    createdPLaces: user.createdPLaces || [],
  };

  return res.status(200).json({
    message: "Амжилттай нэвтэрлээ",
    user: currentUser,
  });
});

// Register endpoint
app.post("/api/register", (req, res) => {
  const { username, password, userImgUrl } = req.body;

  if (!username || !password || !userImgUrl) {
    return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү" });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ error: "Хэрэглэгчийн нэр бүртгэлтэй байна" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Нууц үг 6 тэмдэгтээс дээш байх ёстой" });
  }

  const newUser = {
    username,
    password,
    userImgUrl,
    id: uuidv4(),
    createdPLaces: [],
  };

  users.push(newUser);
  res.status(201).json({ message: "Амжилттай бүртгэгдлээ", user: newUser });
});

// Add place endpoint
app.post("/api/placeadd", (req, res) => {
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

  const user = users.find((u) => u.id === createdUserID);
  if (!user) {
    return res.status(403).json({ error: "Хэрэглэгч олдсонгүй" });
  }

  const newPlace = {
    createdUserID,
    placeName,
    placeImgUrl,
    placeDescription,
    placeAddress,
    id: uuidv4(),
  };

  places.push(newPlace);

  if (!user.createdPLaces) {
    user.createdPLaces = [];
  }
  user.createdPLaces.push(newPlace);

  res.status(201).json({
    message: "Амжилттай бүртгэгдлээ",
    place: newPlace,
    user: user,
  });
});
app.delete("/api/places/:id", (req, res) => {
  const placeId = req.params.id;

  // 1. Шалгах: currentUser байгаа эсэх
  if (!currentUser) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  // 2. Газрыг олох
  const placeIndex = places.findIndex((place) => place.id === placeId);
  if (placeIndex === -1) {
    return res.status(404).json({ error: "Газрын мэдээлэл олдсонгүй" });
  }

  // 3. Шалгах: энэ хэрэглэгчийн газар эсэх
  const place = places[placeIndex];
  if (place.createdUserID !== currentUser.id) {
    return res
      .status(403)
      .json({ error: "Зөвхөн өөрийн газрыг устгах боломжтой" });
  }

  // 4. Бүх жагсаалтаас устгах
  places.splice(placeIndex, 1);

  // 5. currentUser.createdPLaces-аас устгах
  if (currentUser.createdPLaces) {
    currentUser.createdPLaces = currentUser.createdPLaces.filter(
      (p) => p.id !== placeId
    );
  }

  // 6. Бусад хэрэглэгчдийн жагсаалтаас устгах
  users.forEach((user) => {
    if (user.createdPLaces) {
      user.createdPLaces = user.createdPLaces.filter((p) => p.id !== placeId);
    }
  });

  res.status(200).json({
    message: "Газрын мэдээлэл амжилттай устгагдлаа",
    deletedPlace: place,
    userPlacesCount: currentUser.createdPLaces
      ? currentUser.createdPLaces.length
      : 0,
  });
});

app.put("/api/places/:id", (req, res) => {
  const placeId = req.params.id;
  const { placeName, placeImgUrl, placeDescription, placeAddress } = req.body;

  if (!placeName || !placeDescription || !placeImgUrl) {
    return res
      .status(400)
      .json({ error: "Бүх заавал бөглөх талбарыг бөглөнө үү" });
  }

  const placeIndex = places.findIndex((place) => place.id === placeId);

  if (placeIndex === -1) {
    return res.status(404).json({ error: "Газрын мэдээлэл олдсонгүй" });
  }

  if (currentUser && places[placeIndex].createdUserID !== currentUser.id) {
    return res
      .status(403)
      .json({ error: "Та энэ газрыг өөрчлөх эрхгүй байна" });
  }

  const updatedPlace = {
    ...places[placeIndex],
    placeName,
    placeImgUrl,
    placeDescription,
    placeAddress: placeAddress || places[placeIndex].placeAddress,
  };

  places[placeIndex] = updatedPlace;

  if (currentUser) {
    const userPlaceIndex = currentUser.createdPLaces.findIndex(
      (p) => p.id === placeId
    );
    if (userPlaceIndex !== -1) {
      currentUser.createdPLaces[userPlaceIndex] = updatedPlace;
    }
  }

  res.status(200).json({
    message: "Газрын мэдээлэл амжилттай шинэчлэгдлээ",
    place: updatedPlace,
  });
});
// Сервер дээр аль хэдийн байгаа endpoint
app.get("/api/userPlaces/:userId", (req, res) => {
  const userId = req.params.userId;
  const userPlaces = places.filter((place) => place.createdUserID === userId);
  res.json(userPlaces);
});
// Get user places
app.get("/api/userPlaces/:userId", (req, res) => {
  const userId = req.params.userId;
  const userPlaces = places.filter((place) => place.createdUserID === userId);
  res.json(userPlaces);
});

// Get current user
app.get("/api/currentUser", (req, res) => {
  res.json(currentUser);
});

// Get all users
app.get("/api/allUsers", (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  const otherUsers = users.filter((user) => user.id !== currentUser.id);
  const currentUserPlaces = places.filter(
    (place) => place.createdUserID === currentUser.id
  );

  res.status(200).json({
    currentUser: {
      ...currentUser,
      createdPLaces: currentUserPlaces,
    },
    otherUsers,
  });
});

app.listen(3001, () => {
  console.log("Сервер 3001 порт дээр ажиллаж байна");
});
