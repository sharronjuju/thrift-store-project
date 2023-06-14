import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";

export const ImageUploadComponent = ({
  currentOneProduct,
  setCurrentOneProduct,
}) => {
  const navigate = useNavigate();
  const [currentOneProductData, setCurrentOneProductData] = useState("");
  useEffect(() => {
    ProductService.findById(currentOneProduct)
      .then((data) => {
        setCurrentOneProductData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const formData = new FormData();
  const handleFile = (e) => {
    let data = [...e.target.files];
    data.forEach((file) => {
      formData.append("file", file);
    });
  };
  const handleFileUpload = (e) => {
    e.preventDefault();
    ProductService.imageUpload(currentOneProductData._id, formData)
      .then((data) => {
        ProductService.findById(currentOneProduct)
          .then((data) => {
            setCurrentOneProductData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleTakeToOneProduct = (e) => {
    setCurrentOneProduct(e.currentTarget.id);
    navigate("/product");
  };

  const handleDeleteImage = (e) => {
    let name = e.currentTarget.id;
    let splitName = name.split("/");
    let fileID = splitName[splitName.length - 1];
    ProductService.imagedDlete(fileID)
      .then(() => {
        ProductService.findById(currentOneProduct)
          .then((data) => {
            setCurrentOneProductData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="imageUpload">
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
        <section>
          <form>
            <label htmlFor="file">
              <h4>選擇圖片</h4>
            </label>
            <input
              onChange={handleFile}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              name="file"
              multiple
            ></input>
          </form>
          <div>
            <button onClick={handleFileUpload}>
              <p>上傳&emsp;&and;</p>
            </button>
            <button
              onClick={handleTakeToOneProduct}
              id={currentOneProductData && currentOneProductData._id}
            >
              <p>查看商品頁面</p>
            </button>
          </div>
        </section>
        <section className="img">
          {currentOneProductData &&
            currentOneProductData.file.map((file) => {
              return (
                <div>
                  <div className="imgRepalce">
                    <img src={file} />
                  </div>
                  <button onClick={handleDeleteImage} id={file}>
                    <p>刪除</p>
                  </button>
                </div>
              );
            })}
        </section>
      </main>
    </div>
  );
};

export default ImageUploadComponent;
