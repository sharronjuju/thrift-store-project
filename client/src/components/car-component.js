import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../services/order.service";

export const CarComponent = ({ setCurrentOneProduct, setCurrentOrderId }) => {
  const navigate = useNavigate();
  const [shoppingCarData, setShoppingCarData] = useState("");
  let [realname, setRealname] = useState("");
  let [phone, setPhone] = useState("");
  let [address, setAddress] = useState("");
  let [message, setMessage] = useState("");

  useEffect(() => {
    OrderService.getShoppingCar()
      .then((data) => {
        setShoppingCarData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleRemoveProduct = (e) => {
    OrderService.removeProduct(e.currentTarget.id)
      .then(() => {
        OrderService.getShoppingCar()
          .then((data) => {
            setShoppingCarData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleTakeToOneProduct = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
  };

  const handleRealname = (e) => {
    setRealname(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleSendOrder = (e) => {
    e.preventDefault();
    OrderService.checkout(realname, phone, address)
      .then((data) => {
        setCurrentOrderId(data.data._id);
        navigate("/order");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div className="shoppingCar">
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
        <h4>購物車 &#9588; </h4>
        <div className="products">
          {shoppingCarData ? (
            shoppingCarData.product.map((product) => {
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
                        <Link
                          onClick={handleTakeToOneProduct}
                          id={product._id}
                          to="/product"
                        >
                          <p>{product.title}</p>
                        </Link>
                        <p>NT.{product.price}</p>
                        <p>{product.size}</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveProduct} id={product._id}>
                      移除
                    </button>
                  </div>
                  <hr />
                </section>
              );
            })
          ) : (
            <p></p>
          )}
        </div>
        {/* 表格填寫 */}
        {shoppingCarData && shoppingCarData.product.length > 0 && (
          <div className="caculate">
            <div className="price">
              <p>商品合計</p>
              <p>NT.{shoppingCarData.totalprice}</p>
            </div>
            <div className="deliveryFee">
              <p>運費</p>
              <p>NT.60</p>
            </div>
            <hr />
            <div className="total">
              <p>總金額</p>
              <p>NT.{shoppingCarData.totalprice + 60}</p>
            </div>
          </div>
        )}
        {message && (
          <div className="message">
            {message} <br />
          </div>
        )}
        <br />
        {shoppingCarData && shoppingCarData.product.length > 0 && (
          <form>
            <section>
              <div>
                <label htmlFor="realname">真實姓名</label>
                <input onChange={handleRealname} type="text" name="realname" />
              </div>
              <div>
                <label htmlFor="phone">手機號碼</label>
                <input onChange={handlePhone} type="text" name="phone" />
              </div>
              <div>
                <label htmlFor="address">711門市</label>
                <div className="seven">
                  <input onChange={handleAddress} type="text" name="address" />
                  <Link
                    target="_blank"
                    to="https://www.ibon.com.tw/retail_inquiry.aspx#gsc.tab=0"
                  >
                    查詢
                  </Link>
                </div>
              </div>
              <div className="carSubmit">
                <p>
                  <br />
                  付款方式
                  <br />
                  貨到付款
                </p>
                <button onClick={handleSendOrder} type="submit">
                  送出訂單
                </button>
              </div>
            </section>
          </form>
        )}
        <Link to="/allOrder">
          <hr />
          <h5>查看所有訂單</h5>
        </Link>
      </main>
    </div>
  );
};

export default CarComponent;
