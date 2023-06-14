import axios from "axios";
const API_URL = "https://thrift-store.herokuapp.com/api/product";

class ProductService {
  allInStock() {
    return axios.get(API_URL);
  }

  findByName(name) {
    return axios.get(API_URL + "/findByName/" + name, {
      withCredentials: true,
    });
  }

  findById(_id) {
    return axios.get(API_URL + "/findById/" + _id, {
      withCredentials: true,
    });
  }

  all() {
    return axios.get(API_URL + "/allProduct", {
      withCredentials: true,
    });
  }

  popular() {
    return axios.get(API_URL + "/popular");
  }

  addFavorite(_id) {
    return axios.post(
      API_URL + "/addFavorite/" + _id,
      {},
      {
        withCredentials: true,
      }
    );
  }

  getFavorite(_id) {
    return axios.get(API_URL + "/favorite/" + _id, {
      withCredentials: true,
    });
  }

  deleteFavorite(_id) {
    return axios.delete(API_URL + "/deleteFavorite/" + _id, {
      withCredentials: true,
    });
  }

  addProduct(title, size, stock, price, description, popular) {
    return axios.post(
      API_URL + "/addProduct",
      {
        title,
        size,
        stock,
        price,
        description,
        popular,
      },
      { withCredentials: true }
    );
  }

  imageUpload(_id, formData) {
    return axios.post(
      API_URL + "/image/" + _id,
      formData,
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  imagedDlete(_id) {
    return axios.delete(API_URL + "/image/" + _id, { withCredentials: true });
  }

  patch(_id, title, size, stock, price, description, popular) {
    return axios.patch(
      API_URL + "/" + _id,
      { title, size, stock, price, description, popular },
      { withCredentials: true }
    );
  }

  delete(_id) {
    return axios.delete(API_URL + "/" + _id, { withCredentials: true });
  }
}

export default new ProductService();
