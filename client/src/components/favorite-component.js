import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ProductService from "../services/product.service";
import OrderService from "../services/order.service";

export const FavoriteComponent = ({ currentUser, setCurrentOneProduct }) => {
  const [favoriteData, setFavoriteData] = useState("");

  useEffect(() => {
    ProductService.getFavorite(currentUser._id)
      .then((data) => {
        setFavoriteData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleTakeToOneProduct = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
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

  const handleDeleteFavorite = (e) => {
    ProductService.deleteFavorite(e.currentTarget.id)
      .then(() => {
        ProductService.getFavorite(currentUser._id)
          .then((data) => {
            setFavoriteData(data.data);
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
    <div className="favorite">
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
        <h4>收藏清單 &#9588; </h4>
        <div>
          {favoriteData &&
            favoriteData.map((favorite) => {
              return (
                <section key={favorite._id} className="product">
                  <div className="img">
                    <Link
                      onClick={handleTakeToOneProduct}
                      id={favorite._id}
                      to="/product"
                    ></Link>
                    <div className="imgRepalce">
                      <img src={favorite.file[0]} />
                    </div>
                  </div>
                  <div className="decription">
                    <div className="titlePrice">
                      <p>{favorite.title}</p>
                      <p>NT.{favorite.price}</p>
                    </div>
                    <div className="carXmark">
                      <button
                        onClick={handleAddToCar}
                        id={favorite._id}
                        className="cartShopping"
                      >
                        <FontAwesomeIcon icon={faCartShopping} size="xl" />
                      </button>
                      <button
                        onClick={handleDeleteFavorite}
                        id={favorite._id}
                        className="xmark"
                      >
                        <FontAwesomeIcon icon={faXmark} size="2xl" />
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

export default FavoriteComponent;
