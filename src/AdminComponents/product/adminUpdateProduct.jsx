
import "../../adminCss/adminUpdateProduct.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import uploadToCloudinary from "../../utils/cloudinaryUpload"; 
import { fetchCategory } from "../../utils/CFunctions";
import { ToastContainer, toast } from "react-toastify";


function UpdateProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [updateloader, setUpdateLoader] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // State to store categories
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    shopname: "",
    price: "",
    discountPercentage: "",
    FinalPrice: "",
    category: "",
    thumbnail: "",
    availableTimes: [],
    minorderquantity: "",
    packof: "",
    active: "",
    setOurprice: "",
    shopPrices: [],
  });

  // Fetch categories and product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const response = await makeApi(`/api/get-single-product/${productId}`, "GET");
        const productData = response.data.product;
        setProduct(productData);

        // Set form data with product details
        setFormData({
          name: productData.name || "",
          shopname: productData.shopname || "",
          price: productData.price || "",
          discountPercentage: productData.discountPercentage || "",
          FinalPrice: productData.FinalPrice || "",
          category: productData.category._id || "",
          thumbnail: productData.thumbnail || "",
          availableTimes: productData.availableTimes.join(", ") || "", // Convert array to comma separated string
          minorderquantity: productData.minorderquantity || "",
          packof: productData.packof || "",
          active: productData.active || "", // Ensure 'active' status is set
          ourprice: productData.ourprice || "",
          shopPrices: productData.shopPrices || [],
        });

        // Fetch categories
        const categoryResponse = await fetchCategory();
        setCategories(categoryResponse);

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle Shop Price Changes

// Handle drag start for shop price reordering
const handleDragStart = (e, index) => {
  e.dataTransfer.setData("text/plain", index);
  e.target.style.opacity = "0.5";
};

// Handle drag over event
const handleDragOver = (e) => {
  e.preventDefault();
  e.target.style.backgroundColor = "#e8f5e9"; // Light green background on hover
};

// Handle drop event for reordering
const handleDrop = (e, targetIndex) => {
  e.preventDefault();
  const draggedIndex = e.dataTransfer.getData("text/plain");

  if (draggedIndex !== targetIndex) {
    const updatedShopPrices = [...formData.shopPrices];
    const [draggedItem] = updatedShopPrices.splice(draggedIndex, 1);
    updatedShopPrices.splice(targetIndex, 0, draggedItem);

    // Update positionId after reordering
    updatedShopPrices.forEach((shopPrice, index) => {
      shopPrice.poistionId = index + 1;
    });

    setFormData({ ...formData, shopPrices: updatedShopPrices });
  }

  e.target.style.backgroundColor = ""; // Reset background color
};


  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };

      // Recalculate Final Price when price or discountPercentage changes
      if (name === "price" || name === "discountPercentage") {
        const price = parseFloat(newFormData.price);
        const discountPercentage = parseFloat(newFormData.discountPercentage);

        if (!isNaN(price) && !isNaN(discountPercentage)) {
          let finalPrice = price - (price * discountPercentage) / 100;
          
          // Round the final price to the nearest whole number
          finalPrice = Math.round(finalPrice);

          newFormData.FinalPrice = finalPrice;
        } else {
          newFormData.FinalPrice = "";
        }
      }

      return newFormData;
    });
  };
  // Handle Shop Price Changes
const handleShopPriceChange = (e, index, field) => {
  const { value } = e.target;
  const updatedShopPrices = [...formData.shopPrices];
  updatedShopPrices[index][field] = value; // Update the field (shopname, price, active, etc.)

  // Recalculate the FinalPrice if price or discountPercentage changes
  if (field === "price" || field === "discountPercentage") {
    const price = parseFloat(updatedShopPrices[index].price);
    let discountPercentage = parseFloat(updatedShopPrices[index].discountPercentage);

    if (!isNaN(price) && !isNaN(discountPercentage)) {
      let finalPrice = price - (price * discountPercentage) / 100;
      // Round the final price to the nearest whole number
      finalPrice = Math.round(finalPrice);

      updatedShopPrices[index].FinalPrice = finalPrice;
    } else {
      updatedShopPrices[index].FinalPrice = "";
    }
  }

  // Update the form data with the new shopPrices array
  setFormData({ ...formData, shopPrices: updatedShopPrices });
};


  // Handle image upload to cloudinary
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      if (type === "thumbnail") {
        setFormData({ ...formData, thumbnail: url });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoader(true);
      await makeApi(`/api/update-product/${productId}`, "PUT", formData);
      toast.success("Product updated successfully!");
      // console.log("Product updated successfully!");
      // navigate("/admin/allproducts");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setUpdateLoader(false);
    }
  };


  const handleAddShopPrice = () => {
    const newShopPrice = {
      shopname: "",
      price: "",
      discountPercentage: "",
      FinalPrice: "",
      poistionId: formData.shopPrices.length + 1,
      ourprice: "",
      active: "true",
    };
    setFormData({ ...formData, shopPrices: [...formData.shopPrices, newShopPrice] });
  };

  const handleRemoveShopPrice = (index) => {
    const updatedShopPrices = [...formData.shopPrices];
    updatedShopPrices.splice(index, 1);
    // Reassign positionIds after removal
    updatedShopPrices.forEach((shopPrice, idx) => {
      shopPrice.poistionId = idx + 1;
    });
    setFormData({ ...formData, shopPrices: updatedShopPrices });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="main_update_product_page">
          <div>
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
          </div>
          <ToastContainer style={{ width: '300px' }} position="top-center" autoClose={3000} />

          <div className="update-product-container">
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
              {/* General Information Section */}
              <div className="form-section">
                <h3>General Information</h3>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Shop Name:</label>
                  <input
                    type="text"
                    name="shopname"
                    value={formData.shopname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="form-section">
                <h3>Pricing</h3>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Discount Percentage:</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Final Price:</label>
                  <input
                    type="number"
                    name="FinalPrice"
                    value={formData.FinalPrice || ""}
                    readOnly
                  />
                </div>
              </div>
              {/* ourprice */}
              <div className="form-group">
                <label>Our Price:</label>
                <input
                  type="number"
                  name="ourprice"
                  value={formData.ourprice}
                  onChange={handleChange}
                />
              </div>

              {/* Shop Prices Section */}
   {/* Shop Prices Section */}
<div className="form-section">
  <h3>Shop Prices</h3>
  <div className="shop-prices-container">
    {formData.shopPrices
      .sort((a, b) => a.poistionId - b.poistionId) // Sort by positionId
      .map((shopPrice, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="shop-price-item"
        >
          <input
            type="text"
            value={shopPrice.shopname}
            onChange={(e) => handleShopPriceChange(e, index, "shopname")}
            className="shop-price-input"
            placeholder="Shop Name"
          />
          <input
            type="number"
            value={shopPrice.price}
            onChange={(e) => handleShopPriceChange(e, index, "price")}
            className="shop-price-input"
            placeholder="Price"
          />
          <input
            type="number"
            value={shopPrice.discountPercentage}
            onChange={(e) => handleShopPriceChange(e, index, "discountPercentage")}
            className="shop-price-input"
            placeholder="Discount %"
          />
          <input
            type="number"
            value={shopPrice.FinalPrice || ""}
            readOnly
            className="shop-price-input"
            placeholder="Final Price"
          />
          <input
            type="text"
            value={shopPrice.poistionId}
            readOnly
            className="shop-price-position-id"
          />
          <input
            type="text"
            value={shopPrice.ourprice}
            onChange={(e) => handleShopPriceChange(e, index, "ourprice")}
            className="shop-price-position-id"
          />
          <select
            value={shopPrice.active}
            onChange={(e) => handleShopPriceChange(e, index, "active")}
            className="shop-price-select"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
                          type="button"
                          className="remove-button"
                          onClick={() => handleRemoveShopPrice(index)}
                        >
                          Remove
                        </button>
        </div>
        
      ))}
  </div>
  <button
                  type="button"
                  onClick={handleAddShopPrice}
                  className="add-shop-price-button"
                >
                  Add Shop Price
                </button>
</div>


              {/* Category Section */}
              <div className="form-section">
                <h3>Category</h3>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability Section */}
              <div className="form-section">
                <h3>Availability</h3>
                <div className="form-group">
                  <label>Available Times:</label>
                  <input
                    type="text"
                    name="availableTimes"
                    value={formData.availableTimes}
                    onChange={handleChange}
                    placeholder="e.g. 10AM - 10PM"
                  />
                </div>
              </div>

              {/* Minimum Order Quantity Section */}
              <div className="form-section">
                <h3>Order Quantity</h3>
                <div className="form-group">
                  <label>Min Order Quantity:</label>
                  <input
                    type="number"
                    name="minorderquantity"
                    value={formData.minorderquantity}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Pack Of:</label>
                  <input
                    type="number"
                    name="packof"
                    value={formData.packof}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Active Status Section */}
              <div className="form-section">
                <h3>Active Status</h3>
                <div className="form-group">
                  <label>Active:</label>
                  <select
                    name="active"
                    value={formData.active}
                    onChange={handleChange}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="form-section">
                <h3>Product Image</h3>
                <div className="form-group">
                  <label>Thumbnail:</label>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "thumbnail")}
                  />
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      className="update_product_image_thumbnail"
                    />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-section">
                <button
                  type="submit"
                  className="admin_panel_button"
                  disabled={updateloader}
                >
                  {updateloader ? <Loader /> : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateProduct;

// import "../../adminCss/adminUpdateProduct.css";
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";
// import uploadToCloudinary from "../../utils/cloudinaryUpload";
// import { fetchCategory } from "../../utils/CFunctions";
// import { ToastContainer, toast } from "react-toastify";

// function UpdateProduct() {
//   const navigate = useNavigate();
//   const { productId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [updateloader, setUpdateLoader] = useState(false);
//   const [product, setProduct] = useState(null);
//   const [categories, setCategories] = useState([]); // State to store categories
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [formData, setFormData] = useState({
//     name: "",
//     shopPrices: [],
//     price: "",
//     discountPercentage: "",
//     FinalPrice: "",
//     category: "",
//     thumbnail: "",
//     availableTimes: [],
//     minorderquantity: "",
//     packof: "",
//     active: "",
//     setOurprice: "",
//   });

//   // Fetch categories and product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         // Fetch product details
//         const response = await makeApi(`/api/get-single-product/${productId}`, "GET");
//         const productData = response.data.product;
//         setProduct(productData);

//         // Set form data with product details
//         setFormData({
//           name: productData.name || "",
//           shopPrices: productData.shopPrices || [],
//           price: productData.price || "",
//           discountPercentage: productData.discountPercentage || "",
//           FinalPrice: productData.FinalPrice || "",
//           category: productData.category._id || "",
//           thumbnail: productData.thumbnail || "",
//           availableTimes: productData.availableTimes.join(", ") || "", // Convert array to comma separated string
//           minorderquantity: productData.minorderquantity || "",
//           packof: productData.packof || "",
//           active: productData.active || "", // Ensure 'active' status is set
//           ourprice: productData.ourprice || "",
//         });

//         // Fetch categories
//         const categoryResponse = await fetchCategory();
//         setCategories(categoryResponse);

//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   // Handle input field change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     setFormData((prevData) => {
//       const newFormData = { ...prevData, [name]: value };

//       // Recalculate Final Price when price or discountPercentage changes
//       if (name === "price" || name === "discountPercentage") {
//         const price = parseFloat(newFormData.price);
//         const discountPercentage = parseFloat(newFormData.discountPercentage);

//         if (!isNaN(price) && !isNaN(discountPercentage)) {
//           let finalPrice = price - (price * discountPercentage) / 100;
          
//           // Round the final price to the nearest whole number
//           finalPrice = Math.round(finalPrice);

//           newFormData.FinalPrice = finalPrice;
//         } else {
//           newFormData.FinalPrice = "";
//         }
//       }

//       return newFormData;
//     });
//   };

//   // Handle image upload to cloudinary
//   const handleImageUpload = async (e, type) => {
//     const file = e.target.files[0];
//     try {
//       const url = await uploadToCloudinary(file, setUploadProgress);
//       if (type === "thumbnail") {
//         setFormData({ ...formData, thumbnail: url });
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   // Handle drag start for shop price reordering
//   const handleDragStart = (e, index) => {
//     e.dataTransfer.setData("text/plain", index);
//     e.target.style.opacity = "0.5";
//   };

//   // Handle drag over event
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.target.style.backgroundColor = "#e8f5e9"; // Light green background on hover
//   };

//   // Handle drop event for reordering
//   const handleDrop = (e, targetIndex) => {
//     e.preventDefault();
//     const draggedIndex = e.dataTransfer.getData("text/plain");

//     if (draggedIndex !== targetIndex) {
//       const updatedShopPrices = [...formData.shopPrices];
//       const [draggedItem] = updatedShopPrices.splice(draggedIndex, 1);
//       updatedShopPrices.splice(targetIndex, 0, draggedItem);

//       // Update positionId after reordering
//       updatedShopPrices.forEach((shopPrice, index) => {
//         shopPrice.poistionId = index + 1;
//       });

//       setFormData({ ...formData, shopPrices: updatedShopPrices });
//     }

//     e.target.style.backgroundColor = ""; // Reset background color
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setUpdateLoader(true);
//       await makeApi(`/api/update-product/${productId}`, "PUT", formData);
//       toast.success("Product updated successfully!");
//       // console.log("Product updated successfully!");
//       // navigate("/admin/allproducts");
//     } catch (error) {
//       console.error("Error updating product:", error);
//     } finally {
//       setUpdateLoader(false);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="main_update_product_page">
//           <div>
//             <Link to={"/admin/allproducts"}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="26"
//                 height="36"
//                 fill="currentColor"
//                 className="bi bi-arrow-left back_arrow_icon"
//                 viewBox="0 0 16 16"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
//                 />
//               </svg>
//             </Link>
//           </div>
//           <ToastContainer style={{ width: "300px" }} position="top-center" autoClose={3000} />

//           <div className="update-product-container">
//             <h2>Update Product</h2>
//             <form onSubmit={handleSubmit}>
//               {/* General Information Section */}
//               <div className="form-section">
//                 <h3>General Information</h3>
//                 <div className="form-group">
//                   <label>Name:</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Shop Name:</label>
//                   <input
//                     type="text"
//                     name="shopname"
//                     value={formData.shopname}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* Shop Prices Section */}
//               <div className="form-section">
//                 <h3>Shop Prices</h3>
//                 <div className="shop-prices-container">
//                   {formData.shopPrices
//                     .sort((a, b) => a.poistionId - b.poistionId)
//                     .map((shopPrice, index) => (
//                       <div
//                         key={index}
//                         draggable
//                         onDragStart={(e) => handleDragStart(e, index)}
//                         onDragOver={handleDragOver}
//                         onDrop={(e) => handleDrop(e, index)}
//                         className="shop-price-item"
//                       >
//                         <input
//                           type="text"
//                           value={shopPrice.shopname}
//                           onChange={(e) => {
//                             const updatedShopPrices = [...formData.shopPrices];
//                             updatedShopPrices[index].shopname = e.target.value;
//                             setFormData({ ...formData, shopPrices: updatedShopPrices });
//                           }}
//                           className="shop-price-input"
//                         />
//                         <input
//                           type="number"
//                           value={shopPrice.price}
//                           onChange={(e) => {
//                             const updatedShopPrices = [...formData.shopPrices];
//                             updatedShopPrices[index].price = e.target.value;
//                             setFormData({ ...formData, shopPrices: updatedShopPrices });
//                           }}
//                           className="shop-price-input"
//                         />
//                         <input
//                           type="text"
//                           value={shopPrice.poistionId}
//                           readOnly
//                           className="shop-price-position-id"
//                         />
//                         <select
//                           value={shopPrice.active}
//                           onChange={(e) => {
//                             const updatedShopPrices = [...formData.shopPrices];
//                             updatedShopPrices[index].active = e.target.value;
//                             setFormData({ ...formData, shopPrices: updatedShopPrices });
//                           }}
//                           className="shop-price-select"
//                         >
//                           <option value="true">Active</option>
//                           <option value="false">Inactive</option>
//                         </select>
//                       </div>
//                     ))}
//                 </div>
//               </div>

//               {/* Pricing Section */}
//               <div className="form-section">
//                 <h3>Pricing</h3>
//                 <div className="form-group">
//                   <label>Price:</label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Discount Percentage:</label>
//                   <input
//                     type="number"
//                     name="discountPercentage"
//                     value={formData.discountPercentage}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Final Price:</label>
//                   <input
//                     type="number"
//                     name="FinalPrice"
//                     value={formData.FinalPrice || ""}
//                     readOnly
//                   />
//                 </div>
//               </div>
              
//               {/* Submit Button */}
//               <div className="form-section">
//                 <button
//                   type="submit"
//                   className="admin_panel_button"
//                   disabled={updateloader}
//                 >
//                   {updateloader ? <Loader /> : "Update Product"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default UpdateProduct;
