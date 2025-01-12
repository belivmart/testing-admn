import React, { useState, useEffect } from "react";
import "../../adminCss/product/adminaddProduct.css";
import { makeApi } from "../../api/callApi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCategory } from "../../utils/CFunctions";
import uploadToCloudinary from "../../utils/cloudinaryUpload";
import Loader from "../../components/loader/loader";

function AdminAddProduct() {
  const [categories, setCategories] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shopPrices, setShopPrices] = useState([{ shopname: "", price: "", poistionId: "", active: "true" }]);
  const [discountPercentage, setDiscountPercentage] = useState(0); 
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [minorderquantity, setMinorderquantity] = useState("");
  const [packof, setPackof] = useState("");
  const [ourprice, setOurprice] = useState("");
  const [FinalPrice, setFinalPrice] = useState(0);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

  const calculateFinalPrice = (price, discountPercentage) => {
    const finalPrice = price - (price * (discountPercentage / 100));
    return Math.round(finalPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = [];
    if (!name) requiredFields.push("Name");
    if (!price && shopPrices.length === 0) requiredFields.push("Price or Shop Prices");
    if (!category) requiredFields.push("Category");
    if (!thumbnail) requiredFields.push("Thumbnail");

    if (requiredFields.length > 0) {
      const fieldNames = requiredFields.join(", ");
      toast.error(`Please fill all required fields: ${fieldNames}`);
      setLoading(false);
      return;
    }

    const finalPrice = calculateFinalPrice(price, discountPercentage);

    try {
      const response = await makeApi("/api/create-product", "POST", {
        name,
        shopPrices,
        price,
        discountPercentage,
        FinalPrice: finalPrice,
        thumbnail,
        category,
        availableTimes,
        minorderquantity,
        packof,
        ourprice,
      });

      toast.success("Product added successfully!");

      // Reset the form fields
      setName("");
      setShopPrices([{ shopname: "", price: "", poistionId: "", active: "true" }]);
      setPrice("");
      setDiscountPercentage(0);
      setThumbnail("");
      setCategory("");
      setAvailableTimes([]);
      setMinorderquantity("");
      setPackof("");
      setFinalPrice(0);
      setThumbnailUploadProgress(0);
    } catch (error) {
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const uploadedImageUrl = await uploadToCloudinary(file, setThumbnailUploadProgress);
        setThumbnail(uploadedImageUrl);
        setThumbnailUploadProgress(100);
      }
    } catch (error) {
      toast.error("Thumbnail upload failed.");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCategory()
      .then((data) => setCategories(data))
      .catch(() => toast.error("Failed to fetch categories."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="add-product-container">
      <div className="header-section">
        <Link to={"/admin/allproducts"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="36"
            fill="currentColor"
            className="bi bi-arrow-left back_arrow_icon"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </Link>
        <div className="add_product_text">Add Product</div>
        <ToastContainer />
      </div>

      {Loading && <Loader />}

      <form onSubmit={handleSubmit} className="form-section">
        <div className="section-wrapper">
          <h3>Product Details</h3>
          <input
            type="text"
            className="add_product_input_filed"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="section-wrapper">
          <h3>Shop Prices</h3>
          {shopPrices.map((shopPrice, index) => (
            <div key={index} className="shop-price-row">
              <input
                type="text"
                className="add_product_input_filed"
                placeholder="Shop Name"
                value={shopPrice.shopname}
                onChange={(e) => {
                  const updatedShopPrices = [...shopPrices];
                  updatedShopPrices[index].shopname = e.target.value;
                  setShopPrices(updatedShopPrices);
                }}
              />
              <input
                type="number"
                className="add_product_input_filed"
                placeholder="Price"
                value={shopPrice.price}
                onChange={(e) => {
                  const updatedShopPrices = [...shopPrices];
                  updatedShopPrices[index].price = e.target.value;
                  setShopPrices(updatedShopPrices);
                }}
              />
              <input
                type="number"
                className="add_product_input_filed"
                placeholder="Position ID"
                value={shopPrice.poistionId}
                onChange={(e) => {
                  const updatedShopPrices = [...shopPrices];
                  updatedShopPrices[index].poistionId = e.target.value;
                  setShopPrices(updatedShopPrices);
                }}
              />
               <select
                className="add_product_input_filed"
                value={shopPrice.active}
                onChange={(e) => {
                  const updatedShopPrices = [...shopPrices];
                  updatedShopPrices[index].active = e.target.value;
                  setShopPrices(updatedShopPrices);
                }}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              
              <button
                type="button"
                className="remove-shop-price-btn"
                onClick={() => {
                  const updatedShopPrices = shopPrices.filter((_, i) => i !== index);
                  setShopPrices(updatedShopPrices);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-shop-price-btn"
            onClick={() => setShopPrices([...shopPrices, { shopname: "", price: "" }])}
          >
            Add Shop Price
          </button>
        </div>

        <div className="section-wrapper">
          <h3>Price & Discount</h3>
          <input
            type="number"
            className="add_product_input_filed"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            className="add_product_input_filed"
            placeholder="Discount Percentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <input
            type="number"
            className="add_product_input_filed"
            placeholder="Final Price"
            value={calculateFinalPrice(price, discountPercentage)}
            readOnly
          />
        </div>

        <div className="section-wrapper">
          <h3>Product Thumbnail</h3>
          <input
            type="file"
            onChange={handleThumbnailUpload}
          />
          {thumbnailUploadProgress > 0 && <div>Upload Progress: {thumbnailUploadProgress}%</div>}
          {thumbnail && <img src={thumbnail} alt="Thumbnail" width="100" />}
        </div>

        <div className="section-wrapper">
          <h3>Category</h3>
          <select
            className="add_product_input_filed"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="admin_add_product_button">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AdminAddProduct;
