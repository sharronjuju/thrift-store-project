import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/style.css";
import Layout from "./components/layout";
import HomeComponent from "./components/home-component";
import ShopComponent from "./components/shop-component";
import CarComponent from "./components/car-component";
import LoginComponent from "./components/login-component";
import FavoriteComponent from "./components/favorite-component";
import ProductUploadComponent from "./components/product-upload-component";
import ProductComponent from "./components/productcomponent";
import ProductEditComponent from "./components/product-edit-component";
import AllOrderComponent from "./components/all-order-component";
import OrderComponent from "./components/order-component";
import RegisterComponent from "./components/register-component";
import ManagerRegisterComponent from "./components/manager-register-component";
import ImageUploadComponent from "./components/image-upload-component";
import SearchComponent from "./components/search-component";
import GetGoogleUser from "./components/get-google-user-component";
import AuthService from "./services/auth.service";
function App() {
  let [currentUser, setCurrentUser] = useState(
    AuthService.getCurrentUserFromLocalStorage()
  );
  let [currentOneProduct, setCurrentOneProduct] = useState("");
  let [currentOrderId, setCurrentOrderId] = useState("");
  let [searchName, setSearchName] = useState("");
  let [editOrderId, setEditOrderId] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setSearchName={setSearchName}
            />
          }
        >
          <Route index element={<HomeComponent />} />
          <Route
            path="shop"
            element={
              <ShopComponent
                currentUser={currentUser}
                setCurrentOneProduct={setCurrentOneProduct}
              />
            }
          />
          <Route
            path="search"
            element={
              <SearchComponent
                currentUser={currentUser}
                setCurrentOneProduct={setCurrentOneProduct}
                searchName={searchName}
              />
            }
          />
          <Route
            path="shoppingCart"
            element={
              <CarComponent
                setCurrentOneProduct={setCurrentOneProduct}
                setCurrentOrderId={setCurrentOrderId}
              />
            }
          />
          <Route
            path="login"
            element={<LoginComponent setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="loginFromGoogle"
            element={<GetGoogleUser setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="favorite"
            element={
              <FavoriteComponent
                currentUser={currentUser}
                setCurrentOneProduct={setCurrentOneProduct}
              />
            }
          />
          <Route
            path="productUpload"
            element={
              <ProductUploadComponent
                setCurrentOneProduct={setCurrentOneProduct}
              />
            }
          />
          <Route
            path="product"
            element={
              <ProductComponent
                currentOneProduct={currentOneProduct}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="productEdit"
            element={
              <ProductEditComponent
                currentOneProduct={currentOneProduct}
                setCurrentOneProduct={setCurrentOneProduct}
              />
            }
          />
          <Route
            path="allOrder"
            element={
              <AllOrderComponent
                currentUser={currentUser}
                setCurrentOrderId={setCurrentOrderId}
              />
            }
          />
          <Route
            path="order"
            element={
              <OrderComponent
                currentUser={currentUser}
                currentOrderId={currentOrderId}
                setCurrentOneProduct={setCurrentOneProduct}
              />
            }
          />
          <Route path="register" element={<RegisterComponent />} />
          <Route
            path="managerRegister"
            element={<ManagerRegisterComponent />}
          />
          <Route
            path="imageUpload"
            element={
              <ImageUploadComponent
                currentOneProduct={currentOneProduct}
                setCurrentOneProduct={setCurrentOneProduct}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
