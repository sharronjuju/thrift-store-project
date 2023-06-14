import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import ProductService from "../services/product.service";
import OrderService from "../services/order.service";
import Footer from "./footer-component";

export const ProductComponent = ({ currentOneProduct, currentUser }) => {
  const [currentOneProductData, setCurrentOneProductData] = useState("");
  useEffect(() => {
    if (currentOneProduct) {
      ProductService.findById(currentOneProduct)
        .then((data) => {
          setCurrentOneProductData(data.data);
          sessionStorage.setItem("currentProduct", JSON.stringify(data.data));
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      let data = JSON.parse(sessionStorage.getItem("currentProduct"));
      setCurrentOneProductData(data);
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

  return (
    <div className="oneProduct">
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
      <section className="imgTop">
        <div className="imgRepalce">
          <img src={currentOneProductData && currentOneProductData.file[0]} />
        </div>
      </section>
      <main>
        <section className="img">
          {currentOneProductData &&
            currentOneProductData.file.map((file, index) => {
              return (
                <div className="imgRepalce" key={index}>
                  <img src={file} />
                </div>
              );
            })}
        </section>
        <section className="text">
          <div className="productTitle">
            <h3>{currentOneProductData && currentOneProductData.title}</h3>
            <h4>NT:{currentOneProductData && currentOneProductData.price}</h4>
          </div>
          <div className="productDescription">
            <h4>{currentOneProductData && currentOneProductData.size}</h4>
            <p>{currentOneProductData && currentOneProductData.description}</p>
            <hr />
            <div className="addCar">
              <button
                onClick={handleAddToCar}
                id={currentOneProductData && currentOneProductData._id}
              >
                <h4>加入購物車</h4>
              </button>
              <button
                onClick={handleAddFavorite}
                id={currentOneProductData && currentOneProductData._id}
                className="heart"
              >
                <FontAwesomeIcon icon={faHeart} size="xl" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductComponent;
