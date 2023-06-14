import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export const GetGoogleUser = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  useEffect(() => {
    AuthService.getCurrentUser()
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data.data));
        window.alert("登入成功，即將被導向至首頁");
        setCurrentUser(AuthService.getCurrentUserFromLocalStorage());
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return <div></div>;
};

export default GetGoogleUser;
