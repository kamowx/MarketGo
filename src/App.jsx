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
import Editprofile from "./screens/editprofile";
import Home from "./screens/home";
import Myorders from "./screens/myorders";
import Favorites from "./screens/favorites";
import Orderstatus from "./screens/orderstatus";
import Mybalance from "./screens/mybalance";
import Stores from "./screens/stores";
import Storeinfo from "./screens/storeinfo";
import Product from "./screens/product";
import Admin from "./screens/admin";
import AdminHome from "./screens/adminhome";
import Adminsellerrequests from "./screens/adminsellerrequests";
import Admincourierrequests from "./screens/admincourierrequests";
import Adminsellers from "./screens/adminsellers";
import Admincouriers from "./screens/Admincouriers";
import Adminusers from "./screens/adminusers";
import Adminstores from "./screens/adminstores";
import Sellerproducts from "./screens/sellerproducts";
import Sellercheck from "./screens/sellercheck";
import Sellerprofile from "./screens/sellerprofile";
import AddNewProducts from "./screens/addnewproducts";
import Sellerneworders from "./screens/sellerneworders";
import Sellerneworderdetails from "./screens/sellerneworderdetails";
import Sellerconfirmedorders from "./screens/sellerconfirmedorders";
import Sellerconfirmeddetails from "./screens/sellerconfirmeddetails";
import Sellercourierorders from "./screens/sellercourierorders";
import Sellercourierdetails from "./screens/sellercourierdetails";
import Sellercompletedorders from "./screens/sellercompletedorders";

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
        <Route path="/editprofile" element={<Editprofile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myorders" element={<Myorders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/orderstatus" element={<Orderstatus />} />
        <Route path="/mybalance" element={<Mybalance />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/storeinfo" element={<Storeinfo />} />
        <Route path="/product" element={<Product />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminsellerrequests" element={<Adminsellerrequests />} />
        <Route path="/adminsellers" element={<Adminsellers />} />
        <Route path="/admincouriers" element={<Admincouriers />} />
        <Route path="/adminusers" element={<Adminusers />} />
        <Route path="/adminstores" element={<Adminstores />} />
        <Route path="/sellerproducts" element={<Sellerproducts />} />
        <Route path="/sellercheck" element={<Sellercheck />} />
        <Route path="/sellerprofile" element={<Sellerprofile />} />
        <Route path="/addnewproducts" element={<AddNewProducts />} />
        <Route path="/sellerneworders" element={<Sellerneworders />} />
        <Route path="/sellercourierorders" element={<Sellercourierorders />} />

        <Route
          path="/sellercompletedorders"
          element={<Sellercompletedorders />}
        />
        <Route
          path="/sellercourierdetails"
          element={<Sellercourierdetails />}
        />
        <Route
          path="/sellerconfirmeddetails"
          element={<Sellerconfirmeddetails />}
        />
        <Route
          path="/sellerconfirmedorders"
          element={<Sellerconfirmedorders />}
        />
        <Route
          path="/sellerneworderdetails"
          element={<Sellerneworderdetails />}
        />
        <Route
          path="/admincourierrequests"
          element={<Admincourierrequests />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
