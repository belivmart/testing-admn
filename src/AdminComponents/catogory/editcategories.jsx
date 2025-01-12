// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader"; 
// import uploadToCloudinary from "../../utils/cloudinaryUpload";


// function Editcategories() {
//   const navigate = useNavigate();
//   const { Id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [Updateloader, setUpdateLoader] = useState(false);
//   const [product, setProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     active: "",
//   });
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await makeApi(`/api/get-single-category/${Id}`, "GET");
//         setProduct(response.data);
//         setFormData({
//           name: response.data.name,
//           image: response.data.image,
//           active: response.data.active,
//         });
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [Id]);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setUpdateLoader(true);

//       const updateProduct = await makeApi(
//         `/api/update-category/${Id}`,
//         "PUT",
//         formData
//       );
//       console.log("Product updated successfully!", updateProduct);
//     } catch (error) {
//       console.error("Error updating product:", error);
//     } finally {
//       setUpdateLoader(false);
//       navigate("/admin/all-categories");
//     }
//   };
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div>
//       <>
//         {loading ? (
//           <Loader />
//         ) : (
//           <div className="main_update_product_page">
//             <div>
//               <Link to={"/admin/allproducts"}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="26"
//                   height="36"
//                   fill="currentColor"
//                   className="bi bi-arrow-left back_arrow_icon"
//                   viewBox="0 0 16 16"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
//                   />
//                 </svg>
//               </Link>
//             </div>
//             <div className="update-product-container">
//               <h2>Update Product</h2>
//               <form onSubmit={handleSubmit}>
//                 <div>
//                   <label>Name:</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData?.name}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label>Description:</label>
//                   <textarea
//                     name="active"
//                     value={formData?.active}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <button type="submit" className="update_product_button">
//                   {Updateloader ? <Loader /> : <div>Update Product</div>}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </>
//     </div>
//   );
// }

// export default Editcategories;

import React, { useState, useEffect } from "react";
import { makeApi } from "../../api/callApi";
import { Link, useParams, useNavigate } from "react-router-dom";
import uploadToCloudinary from "../../utils/cloudinaryUpload";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [active, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [closed, setClosed] = useState("");

  const { Id } = useParams(); // Get category ID from URL
  const navigate = useNavigate(); // Use to navigate after successful update

  // Fetch category details by ID when the component mounts
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await makeApi(`/api/get-single-category/${Id}`, "GET");
        const category = response.data;
        setName(category.name);
        setDescription(category.active);
        setThumbnail(category.image); // Assuming `image` is the category image URL
        setClosed(category.closed);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setErrorMessage("Error fetching category details.");
      }
    };
    fetchCategoryDetails();
  }, [Id]);

  // Handle category form submission (updating category)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = { name, active, image: thumbnail };

      const response = await makeApi(`/api/update-category/${Id}`, "PUT", updatedFormData);
      if (response.status === 200) {
        alert("Category updated successfully");
        navigate("/admin/all-categories"); // Navigate back to the categories list
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setErrorMessage("Error updating category. Please try again.");
    }
  };

  // Handle file upload for category image
  const handleThumbnailUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const uploadedImageUrl = await uploadToCloudinary(file, setUploadProgress);
        setThumbnail(uploadedImageUrl); // Set the new image URL after upload
        setThumbnailUploadProgress(100); // Assuming upload is complete
      }
    } catch (error) {
      console.log("Thumbnail upload error", error);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <Link to={"/admin/all-categories"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="36"
            fill="currentColor"
            className="bi bi-arrow-left back_arrow_icon back_button_add_catogory"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </Link>
        <div className="my-4">
          <h3>Edit Category</h3>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="form-group">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="active" className="form-label">
                Description:
              </label>
              <input
                id="active"
                className="form-control"
                value={active}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="closed" className="form-label">
                Closed:
              </label>
                  {/* dropdown */}

              <select
                id="closed"
                className="form-select"
                value={closed}
                onChange={(e) => setClosed(e.target.value)}
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>

            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                Category Image:
              </label>
              <input
                type="file"
                name="file"
                id="file"
                className="form-control"
                onChange={handleThumbnailUpload}
              />
            </div>
            {thumbnail && (
              <div>
                <img src={thumbnail.replace('http://', 'https://')} alt="Thumbnail" style={{ maxWidth: "100px" }} />
              </div>
            )}
            <button type="submit" className="btn btn-primary mt-3">
              Update Category
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
