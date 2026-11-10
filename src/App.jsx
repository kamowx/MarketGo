import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import Signin from "./screens/signin";
import Deliverysignin from "./screens/deliverysignin";
import Deliveryinfo from "./screens/deliveryinfo";

import Profile from "./screens/profile";
import Editprofile from "./screens/editprofile";
import Home from "./screens/home";
import Myorders from "./screens/myorders";
import Favorites from "./screens/favorites";
import Orderstatus from "./screens/orderstatus";
import Mybalance from "./screens/mybalance";
import Stores from "./screens/stores";
import Product from "./screens/product";
import Storeinfo from "./screens/storeinfo";

// Новые страницы
import Cart from "./screens/cart";
import Checkout from "./screens/checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />

        <Route path="/deliverysignin" element={<Deliverysignin />} />
        <Route path="/deliveryinfo" element={<Deliveryinfo />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<Editprofile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myorders" element={<Myorders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/orderstatus/:id" element={<Orderstatus />} />
        <Route path="/mybalance" element={<Mybalance />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/storeinfo/:id" element={<Storeinfo />} />

        {/* Корзина и оформление заказа */}
        <Route path="/cart/:businessId" element={<Cart />} />
        <Route path="/checkout/:businessId" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
