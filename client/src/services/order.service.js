import axios from "axios";
const API_URL = "https://thrift-store.herokuapp.com/api/order";

class OrderService {
  addToCar(_id) {
    return axios.post(
      API_URL + "/" + _id,
      {},
      {
        withCredentials: true,
      }
    );
  }

  getShoppingCar() {
    return axios.get(API_URL + "/shoppingCart", {
      withCredentials: true,
    });
  }

  removeProduct(_id) {
    return axios.patch(
      API_URL + "/" + _id,
      {},
      {
        withCredentials: true,
      }
    );
  }

  checkout(realname, phone, address) {
    return axios.patch(
      API_URL + "/checkout",
      { realname, phone, address },
      {
        withCredentials: true,
      }
    );
  }

  getOneOrder(_id) {
    return axios.get(API_URL + "/oneOrder/" + _id, {
      withCredentials: true,
    });
  }

  getAllOrder() {
    return axios.get(API_URL + "/all", {
      withCredentials: true,
    });
  }

  getAllOrderManage() {
    return axios.get(API_URL + "/manager/all", {
      withCredentials: true,
    });
  }

  getOneOrderManage(_id) {
    return axios.get(API_URL + "/manager/" + _id, {
      withCredentials: true,
    });
  }

  changeOrderProgress(_id) {
    return axios.patch(
      API_URL + "/manager/" + _id,
      {},
      {
        withCredentials: true,
      }
    );
  }
}

export default new OrderService();
