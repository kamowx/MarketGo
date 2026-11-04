import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import Adminsignup from "./screens/adminsignup";
import Adminsignin from "./screens/adminsignin";
import Signin from "./screens/signin";
import Deliverysignin from "./screens/deliverysignin";
import Deliveryinfo from "./screens/deliveryinfo";
import Sellersignin from "./screens/sellersignin";
import Sellerinfo from "./screens/sellerinfo";
import Profile from "./screens/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/adminsignup" element={<Adminsignup />} />
        <Route path="/adminsignin" element={<Adminsignin />} />
        <Route path="/deliverysignin" element={<Deliverysignin />} />
        <Route path="/deliveryinfo" element={<Deliveryinfo />} />
        <Route path="/sellersignin" element={<Sellersignin />} />
        <Route path="/sellerinfo" element={<Sellerinfo />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
