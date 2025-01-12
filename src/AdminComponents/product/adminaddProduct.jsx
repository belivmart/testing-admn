// import React, { useState, useEffect } from "react";
// import "../../adminCss/product/adminaddProduct.css";
// import { makeApi } from "../../api/callApi";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchCategory } from "../../utils/CFunctions";
// import uploadToCloudinary from "../../utils/cloudinaryUpload";
// import Loader from "../../components/loader/loader"; // Importing Loader component

// function AdminaddProduct() {
//   const [categories, setCategories] = useState([]);
//   const [Loading, setLoading] = useState(false); // For the categories fetch and form submission
//   const [name, setName] = useState("");
//   const [shopname, setShopname] = useState("");
//   const [price, setPrice] = useState();
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [thumbnail, setThumbnail] = useState("");
//   const [category, setCategory] = useState("");
//   const [availableTimes, setAvailableTimes] = useState([]);
//   const [minorderquantity, setMinorderquantity] = useState("");
//   const [packof, setPackof] = useState("");
//   const [ourprice, setOurprice] = useState();
//   const [FinalPrice, setFinalPrice] = useState(0);
//   const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

//   const calculateFinalPrice = (price, discountPercentage) => {
//     const finalPrice = price - (price * (discountPercentage / 100));
//     return Math.round(finalPrice); // Round the value to the nearest integer
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);  // Show loader during submission

//     const requiredFields = [];
//     if (!name) requiredFields.push("Name");
//     if (!price) requiredFields.push("Price");
//     if (!category) requiredFields.push("Category");
//     if (!thumbnail) requiredFields.push("Thumbnail");

//     if (requiredFields.length > 0) {
//       const fieldNames = requiredFields.join(", ");
//       toast.error(`Please fill all required fields: ${fieldNames}`);
//       setLoading(false);  // Hide loader if there are missing fields
//       return;
//     }

//     const finalPrice = calculateFinalPrice(price, discountPercentage);

//     try {
//       const response = await makeApi("/api/create-product", "POST", {
//         name,
//         shopname,
//         price,
//         discountPercentage,
//         FinalPrice: finalPrice,
//         thumbnail,
//         category,
//         availableTimes,
//         minorderquantity,
//         packof,
//         ourprice
//       });

//       toast.success("Product added successfully!");

//       // Clear the form fields after successful product creation
//       setName("");
//       setOurprice();
//       setShopname("");
//       setPrice("");
//       setDiscountPercentage(0);
//       setThumbnail("");
//       setCategory("");
//       setAvailableTimes([]);
//       setMinorderquantity("");
//       setPackof("");
//       setFinalPrice(0);
//       setThumbnailUploadProgress(0);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       toast.error("Failed to add product.");
//     } finally {
//       setLoading(false);  // Hide loader after submission
//     }
//   };

//   const handleThumbnailUpload = async (event) => {
//     try {
//       const file = event.target.files[0];
//       if (file) {
//         const uploadedImageUrl = await uploadToCloudinary(file, setThumbnailUploadProgress);
//         setThumbnail(uploadedImageUrl);
//         setThumbnailUploadProgress(100);
//       }
//     } catch (error) {
//       console.log("Thumbnail upload error", error);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);  // Show loader while categories are being fetched
//     fetchCategory()
//       .then((data) => setCategories(data))
//       .catch((error) => console.log("Error fetching categories:", error))
//       .finally(() => setLoading(false));  // Hide loader after categories are fetched
//   }, []);

//   return (
//     <div className="add-product-container">
//       <div className="header-section">
//         <Link to={"/admin/allproducts"}>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="26"
//             height="36"
//             fill="currentColor"
//             className="bi bi-arrow-left back_arrow_icon"
//             viewBox="0 0 16 16"
//           >
//             <path
//               fillRule="evenodd"
//               d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
//             />
//           </svg>
//         </Link>
//         <div className="add_product_text">Add Product</div>
//         <ToastContainer />
//       </div>

//       {/* Show the Loader component when loading */}
//       {Loading && <Loader />}

//       <form onSubmit={handleSubmit} className="form-section">
//         {/* Product Name */}
//         <div className="section-wrapper">
//           <h3>Product Details</h3>
//           <input
//             type="text"
//             className="add_product_input_filed"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="text"
//             className="add_product_input_filed"
//             placeholder="Shop Name"
//             value={shopname}
//             onChange={(e) => setShopname(e.target.value)}
//           />
//         </div>

//         {/* Price and Discount */}
//         <div className="section-wrapper">
//           <h3>Price & Discount</h3>
//           <input
//             type="number"
//             className="add_product_input_filed"
//             placeholder="Price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//           <input
//             type="number"
//             className="add_product_input_filed"
//             placeholder="Discount Percentage"
//             value={discountPercentage}
//             onChange={(e) => setDiscountPercentage(e.target.value)}
//           />
//           <input
//             type="number"
//             className="add_product_input_filed"
//             placeholder="Final Price"
//             value={calculateFinalPrice(price, discountPercentage)}
//             readOnly
//           />
//         </div>
//         {/* our price */}
//         <div className="section-wrapper">
//           <h3>Our Price</h3>
//           <input
//             type="number"
//             className="add_product_input_filed"
//             placeholder="Our Price"
//             value={ourprice}
//             onChange={(e) => setOurprice(e.target.value)}
//           />
//         </div>

//         {/* Available Times */}
//         <div className="section-wrapper">
//           <h3>Available Times</h3>
//           <input
//             type="text"
//             className="add_product_input_filed"
//             placeholder="Available Times (comma separated)"
//             value={availableTimes}
//             onChange={(e) => setAvailableTimes(e.target.value.split(","))}
//           />
//         </div>

//         {/* Min Order Quantity */}
//         <div className="section-wrapper">
//           <h3>Minimum Order Quantity</h3>
//           <input
//             type="number"
//             className="add_product_input_filed"
//             placeholder="Minimum Order Quantity"
//             value={minorderquantity}
//             onChange={(e) => setMinorderquantity(e.target.value)}
//           />
//         </div>

//         {/* Pack of */}
//         <div className="section-wrapper">
//           <h3>Pack Of</h3>
//           <input
//             type="number"
//             className="add_product_input_filed"
//             placeholder="Pack Of"
//             value={packof}
//             onChange={(e) => setPackof(e.target.value)}
//           />
//         </div>

//         {/* Thumbnail Upload */}
//         <div className="section-wrapper">
//           <h3>Product Thumbnail</h3>
//           <div className="file-upload-form">
//             <label htmlFor="file" className="file-upload-label">
//               <div className="file-upload-design">
//                 <svg viewBox="0 0 1024 1024" className="add_product_upload_image">
//                   <path className="path1" d="M384 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z"></path>
//                   <path className="path2" d="M853.333333 725.333333v106.666667H170.666667v-106.666667H106.666667v106.666667c0 35.413333 28.586667 64 64 64h682.666666c35.413333 0 64-28.586667 64-64v-106.666667h-64z"></path>
//                   <path className="path3" d="M469.333333 554.666667l85.333334-113.066667 128 170.666667H341.333333L213.333333 469.333333l170.666667-213.333333 85.333333 106.666667 149.333334-192h-448c-35.413333 0-64 28.586667-64 64v554.666666h64v-405.333333l128 149.333333 85.333333 106.666667z"></path>
//                   <path className="path4" d="M725.333333 298.666667m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z"></path>
//                 </svg>
//               </div>
//             </label>
//             <input
//               type="file"
//               name="file"
//               id="file"
//               className="file-upload-input"
//               onChange={handleThumbnailUpload}
//             />
//             {thumbnailUploadProgress > 0 && (
//               <div className="upload-progress">
//                 {thumbnailUploadProgress}% {thumbnailUploadProgress < 100 && <div className="loader"></div>}
//               </div>
//             )}
//             {thumbnail && (
//               <img
//                 loading="lazy"
//                 src={thumbnail}
//                 alt="Thumbnail"
//                 width={150}
//                 height={150}
//               />
//             )}
//           </div>
//         </div>

//         {/* Category */}
//         <div className="section-wrapper">
//           <h3>Category</h3>
//           <select
//             className="add_product_input_filed"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="">Select Category</option>
//             {categories.map((category) => (
//               <option key={category._id} value={category._id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Submit Button */}
//         <div className="submit-section">
//           <button type="submit" className="admin_add_product_button">
//             Add Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AdminaddProduct;

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
  const [shopPrices, setShopPrices] = useState([{ shopname: "", price: "" }]);
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
      setShopPrices([{ shopname: "", price: "" }]);
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
