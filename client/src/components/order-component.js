import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrderService from "../services/order.service";

export const OrderComponent = ({
  currentUser,
  currentOrderId,
  setCurrentOneProduct,
}) => {
  const [currentOrder, setCurrentOrder] = useState("");
  useEffect(() => {
    if (currentUser && currentUser.role == "consumer") {
      if (currentOrderId) {
        OrderService.getOneOrder(currentOrderId)
          .then((data) => {
            setCurrentOrder(data.data);
            sessionStorage.setItem("currentOrder", JSON.stringify(data.data));
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        let data = JSON.parse(sessionStorage.getItem("currentOrder"));
        setCurrentOrder(data);
      }
    }
    if (currentUser && currentUser.role == "manager") {
      if (currentOrderId) {
        OrderService.getOneOrderManage(currentOrderId)
          .then((data) => {
            setCurrentOrder(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        let data = JSON.parse(sessionStorage.getItem("currentOrder"));
        setCurrentOrder(data);
      }
    }
  }, []);

  const handleTakeToOneProduct = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
  };

  const handleChangeProgress = (e) => {
    OrderService.changeOrderProgress(e.currentTarget.id)
      .then(() => {
        OrderService.getOneOrderManage(currentOrderId)
          .then((data) => {
            setCurrentOrder(data.data);
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
    <div className="oneOrder">
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
        <div className="title">
          <h4>訂單編號</h4>
        </div>
        <div className="products">
          <p>{currentOrder && currentOrder._id}</p>
          {currentOrder &&
            currentOrder.product.map((product) => {
              return (
                <section key={product._id} className="product">
                  <div className="flexHandle">
                    <div className="flexHandletwo">
                      <div className="img">
                        <Link
                          onClick={handleTakeToOneProduct}
                          id={product._id}
                          to="/product"
                        ></Link>
                        <div className="imgRepalce">
                          <img src={product.file[0]} />
                        </div>
                      </div>
                      <div className="description">
                        <Link to="/product">
                          <p>{product.title}</p>
                        </Link>
                        <p>NT.{product.price}</p>
                        <p>{product.size}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                </section>
              );
            })}
        </div>
        <section className="left">
          <div className="caculate">
            {currentUser && currentUser.role == "consumer" && (
              <div>
                <p>商品合計</p>
                <p>NT.{currentOrder && currentOrder.totalprice}</p>
              </div>
            )}
            {currentUser && currentUser.role == "consumer" && (
              <div>
                <p>運費</p>
                <p>NT.60</p>
              </div>
            )}
            {currentUser && currentUser.role == "manager" && (
              <div>
                <p>收件人</p>
                <p>{currentOrder && currentOrder.realname}</p>
              </div>
            )}
            {currentUser && currentUser.role == "manager" && (
              <div>
                <p>手機</p>
                <p>{currentOrder && currentOrder.phone}</p>
              </div>
            )}
            {currentUser && currentUser.role == "manager" && (
              <div>
                <p>寄件門市</p>
                <p>{currentOrder && currentOrder.address}</p>
              </div>
            )}
            <hr />
            <div>
              <p>總金額</p>
              <p>NT.{currentOrder && currentOrder.totalprice + 60}</p>
            </div>
          </div>
          <div className="right">
            <p>{currentOrder && currentOrder.date.substr(0, 10)}</p>
            {currentOrder && currentOrder.progress == "processing" && (
              <p className="progress">進行中</p>
            )}
            {currentOrder && currentOrder.progress == "finished" && (
              <p className="progress">已完成</p>
            )}
            {currentOrder && currentOrder.progress == "pending" && (
              <p className="progress">購物車</p>
            )}
            {currentUser &&
              currentUser.role == "manager" &&
              currentOrder.progress == "processing" && (
                <button
                  onClick={handleChangeProgress}
                  id={currentOrder && currentOrder._id}
                >
                  <p>完成訂單</p>
                </button>
              )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderComponent;
