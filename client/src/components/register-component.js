import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export const RegisterComponent = () => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRegister = (e) => {
    e.preventDefault();
    AuthService.register(email, password)
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
        <section>
          <Link to="/login">
            <h3 className="left">會員登入 &emsp;/</h3>
          </Link>
          <h3 className="right">/&emsp; 會員註冊</h3>
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
          </div>
          <section>
            <button onClick={handleRegister}>
              <p>註冊會員</p>
            </button>
          </section>
        </form>
        {message && (
          <div className="message">
            <br />
            {message}
          </div>
        )}
      </main>
    </div>
  );
};

export default RegisterComponent;
