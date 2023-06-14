import axios from "axios";
const API_URL = "https://thrift-store.herokuapp.com/api/user";

class AuthService {
  login(username, password) {
    return axios.post(
      API_URL + "/login",
      {
        username,
        password,
      },
      { withCredentials: true }
    );
  }

  loginFromGoogle() {
    return axios.get(API_URL + "/google", { withCredentials: true });
  }

  logout() {
    localStorage.removeItem("user");
    return axios.get(API_URL + "/logout");
  }
  register(email, password) {
    return axios.post(API_URL + "/register", {
      email,
      password,
    });
  }
  managerRegister(email, password, productkey) {
    return axios.post(API_URL + "/manager/register", {
      email,
      password,
      productkey,
    });
  }
  getCurrentUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getCurrentUser() {
    return axios.get(API_URL, { withCredentials: true });
  }
}

export default new AuthService();
