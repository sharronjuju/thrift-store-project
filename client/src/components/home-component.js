import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrow from "../icons/arrow.svg";
import ProductService from "../services/product.service";
import Slider from "./slider";

export const HomeComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    ProductService.popular()
      .then((data) => {
        let popular = [];
        data.data.map((product, index) => {
          popular.push({ key: index + 1, src: product.file[0] });
        });
        setData(popular);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="homeBase">
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
        <div className="imgRepalce">
          <Slider data={data} />
        </div>
        <div className="homeAllProduct">
          <img src={arrow} alt="" />
          <Link to="/shop">
            <h1>Shop now</h1>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomeComponent;
