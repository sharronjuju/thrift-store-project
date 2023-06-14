import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";

export const ProductUploadComponent = ({ setCurrentOneProduct }) => {
  const navigate = useNavigate();
  let [title, setTitle] = useState("");
  let [size, setSize] = useState("");
  let [stock, setStock] = useState("");
  let [price, setPrice] = useState("");
  let [description, setDescription] = useState("");
  let [popular, setPopular] = useState("");
  let [message, setMessage] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleSize = (e) => {
    setSize(e.target.value);
  };
  const handleStock = (e) => {
    let stockValue = parseFloat(e.target.value);
    setStock(stockValue);
  };
  const handlePrice = (e) => {
    let priceValue = parseFloat(e.target.value);
    setPrice(priceValue);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handlePopular = (e) => {
    let popularValue = JSON.parse(e.target.value);
    setPopular(popularValue);
  };
  const handleUploadProduct = (e) => {
    e.preventDefault();
    ProductService.addProduct(title, size, stock, price, description, popular)
      .then((data) => {
        setCurrentOneProduct(data.data._id);
        navigate("/imageUpload");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div className="editProduct">
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
      <main>
        <form>
          <div className="left">
            <div className="title">
              <label htmlFor="title">
                <h4>商品名稱</h4>
              </label>
              <input onChange={handleTitle} type="text" name="title" />
            </div>
            <section>
              <div className="size">
                <label htmlFor="size">
                  <h4>尺寸</h4>
                </label>
                <select onChange={handleSize} id="size" name="size">
                  <option></option>
                  <option value="F">F</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div>
                <label htmlFor="stock">
                  <h4>數量</h4>
                </label>
                <input
                  onChange={handleStock}
                  type="number"
                  min="1"
                  name="stock"
                />
              </div>
              <div>
                <label htmlFor="price">
                  <h4>價格</h4>
                </label>
                <input onChange={handlePrice} type="text" name="price" />
              </div>
            </section>
            <div className="description">
              <label htmlFor="description">
                <h4>品項描述</h4>
              </label>
              <textarea
                onChange={handleDescription}
                name="description"
                max={50}
              ></textarea>
            </div>
            <div className="popular">
              <label htmlFor="popular">
                <h4>刊登於首頁</h4>
              </label>
              <select onChange={handlePopular} id="popular" name="popular">
                <option></option>
                <option value={false}>否</option>
                <option value={true}>是</option>
              </select>
            </div>
          </div>
          <button onClick={handleUploadProduct} type="submit">
            <p>下一步&emsp;&gt;</p>
          </button>
        </form>
        {message && (
          <div className="message">
            <br /> <br />
            {message}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductUploadComponent;
