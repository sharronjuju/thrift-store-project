import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export const ManagerRegisterComponent = () => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let [productkey, setProductkey] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleProductkey = (e) => {
    setProductkey(e.target.value);
  };
  const handleRegister = (e) => {
    e.preventDefault();
    AuthService.managerRegister(email, password, productkey)
      .then(() => {
        window.alert("註冊成功，您將被導向登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div className="register">
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
        {message && (
          <div className="message">
            {message}
            <br />
            <br />
          </div>
        )}
        <section>
          <h3>管理員註冊</h3>
        </section>
        <form>
          <div>
            <label htmlFor="email">
              <h4>Email 電子信箱</h4>
            </label>
            <input onChange={handleEmail} type="text" name="email" />

            <label htmlFor="password">
              <h4>Password 密碼</h4>
            </label>
            <input onChange={handlePassword} type="password" name="password" />

            <label htmlFor="productkey">
              <h4>認證代碼</h4>
            </label>
            <input
              onChange={handleProductkey}
              type="password"
              name="productkey"
            />
          </div>
          <section>
            <button onClick={handleRegister}>
              <p>註冊</p>
            </button>
          </section>
        </form>
      </main>
    </div>
  );
};

export default ManagerRegisterComponent;
