import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ProductService from "../services/product.service";
import OrderService from "../services/order.service";

export const SearchComponent = ({
  currentUser,
  setCurrentOneProduct,
  searchName,
}) => {
  const [searchProduct, setSearchProduct] = useState([]);
  useEffect(() => {
    ProductService.findByName(searchName)
      .then((data) => {
        setSearchProduct(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleAddFavorite = (e) => {
    if (currentUser) {
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
    if (currentUser) {
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

  return (
    <div className="shopBase">
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
        {searchName && (
          <p className="all">
            {searchName}&ensp;
            <span>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="xs"
                style={{ color: "#000000" }}
              />
            </span>
          </p>
        )}
        <div>
          {searchProduct.map((product) => {
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
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SearchComponent;
