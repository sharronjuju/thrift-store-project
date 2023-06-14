import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ProductService from "../services/product.service";
import OrderService from "../services/order.service";
import Footer from "./footer-component";

export const ShopComponent = ({ currentUser, setCurrentOneProduct }) => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.role == "consumer") {
      ProductService.allInStock()
        .then((data) => {
          setProductData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (currentUser && currentUser.role == "manager") {
      ProductService.all()
        .then((data) => {
          setProductData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  const handleAddFavorite = (e) => {
    if (currentUser && currentUser.role == "consumer") {
      ProductService.addFavorite(e.currentTarget.id)
        .then(() => {
          window.alert("已加入收藏清單");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      window.alert("需先登入才能加入收藏");
    }
  };

  const handleAddToCar = (e) => {
    if (currentUser && currentUser.role == "consumer") {
      OrderService.addToCar(e.currentTarget.id)
        .then(() => {
          window.alert("已加入購物車");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      window.alert("需先登入才能加入購物車");
    }
  };

  const handleTakeToOneProduct = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
  };

  const handleTakeToEdit = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
    navigate("/productEdit");
  };

  const handleTakeToEditImage = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
    navigate("/imageUpload");
  };

  const handleDeletProduct = (e) => {
    ProductService.delete(e.currentTarget.id)
      .then(() => {
        ProductService.all()
          .then((data) => {
            setProductData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="shopBase">
      <div className="shopBackground">
        <header>
          <Link to="/">
            <h1>Jujus</h1>
          </Link>
          <h2>
            Juju
            <br />的<br />
            二手商店
          </h2>
        </header>
        <div className="mask"></div>
        <main>
          <p className="all">
            All&ensp;
            <span>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="xs"
                style={{ color: "#000000" }}
              />
            </span>
          </p>
          <div className="shopProducts">
            {productData.map((product) => {
              return (
                <section key={product._id} className="product">
                  <div className="img">
                    <Link
                      id={product._id}
                      onClick={handleTakeToOneProduct}
                      to="/product"
                    ></Link>
                    <div className="shopImg">
                      <img src={product.file[0]} />
                    </div>
                  </div>
                  <div className="decription">
                    <div className="titlePrice">
                      <p>{product.title}</p>
                      <p>NT.{product.price}</p>
                    </div>
                    <div className="heartCar">
                      <button
                        onClick={handleAddFavorite}
                        id={product._id}
                        className="heart"
                      >
                        <FontAwesomeIcon icon={faHeart} size="xl" />
                      </button>
                      <button
                        onClick={handleAddToCar}
                        id={product._id}
                        className="cartShopping"
                      >
                        <FontAwesomeIcon icon={faCartShopping} size="xl" />
                      </button>
                      {currentUser && currentUser.role == "manager" && (
                        <button
                          onClick={handleTakeToEdit}
                          id={product._id}
                          className="cartShopping"
                        >
                          <p>文案</p>
                        </button>
                      )}
                      {currentUser && currentUser.role == "manager" && (
                        <button
                          onClick={handleTakeToEditImage}
                          id={product._id}
                          className="cartShopping"
                        >
                          <p>圖像</p>
                        </button>
                      )}
                      {currentUser && currentUser.role == "manager" && (
                        <button
                          onClick={handleDeletProduct}
                          id={product._id}
                          className="xmark"
                        >
                          <FontAwesomeIcon icon={faXmark} size="2xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ShopComponent;
