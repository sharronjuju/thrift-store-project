import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export const LoginComponent = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await AuthService.login(username, password);
      if (response.data == "No User Exists") {
        setMessage(response.data);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data));
        window.alert("登入成功，即將被導向至首頁");
        setCurrentUser(AuthService.getCurrentUserFromLocalStorage());
        navigate("/");
      }
    } catch (e) {
      setMessage(e.response.data);
    }
  };
  return (
    <div className="login">
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
          <h3 className="left">會員登入 &emsp;/</h3>
          <Link to="/register">
            <h3 className="right">/&emsp; 會員註冊</h3>
          </Link>
        </section>
        <form>
          <div>
            <label htmlFor="username">
              <h4>Email 電子信箱</h4>
            </label>
            <input onChange={handleUsername} type="text" name="username" />
            <label htmlFor="password">
              <h4>Password 密碼</h4>
            </label>
            <input onChange={handlePassword} type="password" name="password" />
          </div>
          <section>
            <a href="https://thrift-store.herokuapp.com/api/user/google">
              <p>透過Google登入</p>
            </a>
            <button onClick={handleLogin}>
              <p>登入</p>
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

export default LoginComponent;
