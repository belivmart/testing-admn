// import "../../adminCss/adminUpdateProduct.css";
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";
// import uploadToCloudinary from "../../utils/cloudinaryUpload"; 
// import { fetchCategory } from "../../utils/CFunctions";


// function UpdateProduct() {
//   const navigate = useNavigate();
//   const { productId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [updateloader, setUpdateLoader] = useState(false);
//   const [product, setProduct] = useState(null);
//   const [sizes, setSizes] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [showConfirm, setShowConfirm] = useState({ show: false, sizeId: null });
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     discountPercentage: "",
//     category: "",
//     thumbnail: "",
//     image: [],
//   });

//   // Fetch product data on mount
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await makeApi(`/api/get-single-product/${productId}`, "GET");

//         const productData = response.data.product;
//         setProduct(productData);

//         // Set form data with the product details
//         setFormData({
//           name: productData.name || "",
//           price: productData.price || "",
//           discountPercentage: productData.discountPercentage || "",
//           category: productData.category._id || "",
//           thumbnail: productData.thumbnail || "",
//           active: productData.active ,
//         });
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
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle image upload to cloudinary
//   const handleImageUpload = async (e, type) => {
//     const file = e.target.files[0];
//     try {
//       const url = await uploadToCloudinary(file, setUploadProgress);
//       if (type === "thumbnail") {
//         setFormData({ ...formData, thumbnail: url });
//       } else {
//         setFormData({ ...formData, image: [...formData.image, url] });
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   // Handle image removal
//   const handleImageRemove = (index) => {
//     const updatedImages = formData.image.filter((_, i) => i !== index);
//     setFormData({ ...formData, image: updatedImages });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setUpdateLoader(true);
//       await makeApi(`/api/update-product/${productId}`, "PUT", formData);

//       console.log("Product updated successfully!");
//       navigate("/admin/allproducts");
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
//               </div>

//               {/* Category Section */}
//               <div className="form-section">
//                 <h3>Category</h3>
//                 <div className="form-group">
//                   <label>Category:</label>
//                   <input
//                     type="text"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     disabled
//                   />
//                 </div>
//               </div>
//               <div className="form-section">
//                 <h3>active</h3>
//                 <div className="form-group">
//                   <label>active:</label>
//                   <input
//                     type="text"
//                     name="active"
//                     value={formData.active}
//                     onChange={handleChange}
//                     disabled
//                   />
//                 </div>
//               </div>

//               {/* Images Section */}
//               <div className="form-section">
//                 <h3>Images</h3>
//                 <div className="update_product_Image_section">
//                   <label>Thumbnail:</label>
//                   <input
//                     type="file"
//                     onChange={(e) => handleImageUpload(e, "thumbnail")}
//                   />
//                   {formData.thumbnail && (
//                     <img
//                       src={formData.thumbnail}
//                       alt="Thumbnail" 
//                       className="update_product_image_thumbnail"
//                     />
//                   )}
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
