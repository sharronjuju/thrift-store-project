import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const NavComponent = ({
  currentUser,
  setCurrentUser,
  setSearchName,
}) => {
  const navigate = useNavigate();
  let [searchValue, setSearchValue] = useState("");
  let [navBar, setNavBar] = useState("hide");

  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功!");
    setCurrentUser(null);
    if (navBar === "show") {
      setNavBar("hide");
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchName(searchValue);
      setSearchValue("");
      navigate("/search");
    }
  };

  const handleBarsShow = () => {
    if (navBar === "hide") {
      setNavBar("show");
    }
  };

  const handleBarsHide = () => {
    if (navBar === "show") {
      setNavBar("hide");
    }
  };

  return (
    <div>
      <div className="navbase">
        <nav>
          <div className="search">
            <div className="magnifier">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ color: "#2f2f2f" }}
              />
            </div>
            <input
              type="text"
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              value={searchValue}
            />
            <div className="searchBox"></div>
          </div>
          <div onClick={handleBarsShow} className="bars">
            <FontAwesomeIcon icon={faBars} style={{ color: "#000000" }} />
          </div>
          <ul className={`navBar ${navBar === "show" ? "barShow" : ""}`}>
            <div onClick={handleBarsHide} className="faXmark">
              <FontAwesomeIcon icon={faXmark} size="xl" />
            </div>
            <li>
              <Link onClick={handleBarsHide} to="/">
                首頁
              </Link>
            </li>
            <li>
              <Link onClick={handleBarsHide} to="/shop">
                所有商品
              </Link>
            </li>
            {currentUser && currentUser.role == "consumer" && (
              <li>
                <Link onClick={handleBarsHide} to="/favorite">
                  收藏清單
                </Link>
              </li>
            )}
            {currentUser && currentUser.role == "consumer" && (
              <li>
                <Link onClick={handleBarsHide} to="/shoppingCart">
                  購物車
                </Link>
              </li>
            )}
            {!currentUser && (
              <li>
                <Link onClick={handleBarsHide} to="/login">
                  登入
                </Link>
              </li>
            )}
            {currentUser && currentUser.role == "manager" && (
              <li>
                <Link onClick={handleBarsHide} to="/productUpload">
                  上架商品
                </Link>
              </li>
            )}
            {currentUser && currentUser.role == "manager" && (
              <li>
                <Link onClick={handleBarsHide} to="/allOrder">
                  管理訂單
                </Link>
              </li>
            )}
            {currentUser && (
              <li>
                <Link to="/" onClick={handleLogout}>
                  登出
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavComponent;
