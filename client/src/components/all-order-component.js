import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrderService from "../services/order.service";

export const AllOrderComponent = ({ currentUser, setCurrentOrderId }) => {
  const [allOrderData, setAllOrderData] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.role == "consumer") {
      OrderService.getAllOrder()
        .then((data) => {
          setAllOrderData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (currentUser && currentUser.role == "manager") {
      OrderService.getAllOrderManage()
        .then((data) => {
          setAllOrderData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  const handleTakeToOneOrder = (e) => {
    setCurrentOrderId(e.currentTarget.id);
  };

  return (
    <div className="allOrder">
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
        <h4>所有訂單 &#9588;</h4>
        {allOrderData.length > 0 &&
          allOrderData.map((order) => {
            return (
              <section key={order._id}>
                <Link onClick={handleTakeToOneOrder} id={order._id} to="/order">
                  <div className="order">
                    <div className="left">
                      <div className="title">
                        <p>訂單編號</p>
                        <p>日期</p>
                      </div>
                      <div className="data">
                        <p>{order._id}</p>
                        <p>{order.date.substr(0, 10)}</p>
                      </div>
                    </div>
                    <div className="right">
                      <p>NT.{order.totalprice}</p>
                      {order.progress == "processing" && (
                        <p className="progress">進行中</p>
                      )}
                      {order.progress == "finished" && (
                        <p className="progress">已完成</p>
                      )}
                    </div>
                  </div>
                </Link>
                <hr />
              </section>
            );
          })}
      </main>
    </div>
  );
};

export default AllOrderComponent;
