import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import OtherPlace from "./components/Place/OtherPlace";
import CurrentPlace from "./components/Place/CurrentPlace";
import PlaceAdd from "./PlaceAdd/PlaceAdd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PLace from "./components/Place/PLace";
import UserDetail from "./components/Place/UserDetail";
import React from "react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/places" element={<PLace />}></Route>
          <Route path="/place/:userid" element={<OtherPlace />}></Route>
          <Route path="/placeadd" element={<PlaceAdd />}></Route>
          <Route path="/me" element={<CurrentPlace />}></Route>
          <Route path="/users/:userId" element={<UserDetail />} />
          <Route></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
