import React, { useState, useEffect } from "react";
import { makeApi } from "../../api/callApi";
import uploadToCloudinary from "../../utils/cloudinaryUpload";
import Loader from "../../components/loader/loader";
import "../../adminCss/adminallsaller.css";

const Adduser = () => {
  const [sallers, setSallers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    shopname: "", 
    password: "",
    address: "",
    googlemapLink: "",
    mobileNumber: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editId, setEditId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSallers = async () => {
    setIsLoading(true);
    try {
      const response = await makeApi("/api/get-all-saller", "GET");
      setSallers(response.data);
    } catch (error) {
      console.error("Error fetching sallers:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSallers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (selectedFile) {
        const imageUrl = await uploadToCloudinary(
          selectedFile,
          setUploadProgress
        );
        formData.image = imageUrl;
      }

      const method = editId ? "PUT" : "POST";
      const endpoint = editId
        ? `/api/update-saller/${editId}`
        : "/api/create-saller";
      await makeApi(endpoint, method, formData);

      setFormData({
        name: "",
        shopname: "",
        password: "",
        address: "",
        googlemapLink: "",
        mobileNumber: "",
        image: "",
      });
      setSelectedFile(null);
      setEditId(null);
      setIsPopupOpen(false);
      fetchSallers();
    } catch (error) {
      console.error("Error saving saller:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await makeApi(`/api/delete-saller/${id}`, "DELETE");
      fetchSallers();
    } catch (error) {
      console.error("Error deleting saller:", error);
    }
    setIsLoading(false);
  };

  const openPopup = (saller = null) => {
    if (saller) {
      setFormData({
        name: saller.name,
        shopname: saller.shopname,
        password: "",
        address: saller.address,
        googlemapLink: saller.googlemapLink,
        mobileNumber: saller.mobileNumber,
        image: saller.image,
      });
      setEditId(saller._id);
    } else {
      setFormData({
        name: "",
        shopname: "",
        password: "",
        address: "",
        googlemapLink: "",
        mobileNumber: "",
        image: "",
      });
      setEditId(null);
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
  };

  return (
    <div className="saller_container">
      {isLoading && <Loader />}
      <h1 className="saller_title">Saller Management</h1>
      <button className="saller_add_btn" onClick={() => openPopup()}>
        Add Saller
      </button>
      <div className="saller_list">
        {sallers.map((saller) => (
          <div key={saller._id} className="saller_card">
            <p>Name: {saller.name}</p>
            <p>shopname: {saller.shopname}</p>
            <p>Address: {saller.address}</p>
            <p>Mobile: {saller.mobileNumber}</p>
            <p>Google Map Link: {saller.googlemapLink}</p>
            {saller.image && (
              <img src={saller.image} alt={saller.name} width={100} />
            )}
            <div className="saller_actions">
              <button onClick={() => openPopup(saller)} className="saller_edit_btn">
                Edit
              </button>
              <button onClick={() => handleDelete(saller._id)} className="saller_delete_btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="saller_popup">
          <div className="saller_popup_content">
            <button onClick={closePopup} className="saller_popup_close">
              &times;
            </button>
            <form onSubmit={handleSubmit} className="saller_form">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="saller_input"
              />
              <input
                type="text"
                name="shopname"
                placeholder="shopname"
                value={formData.shopname}
                onChange={handleInputChange}
                className="saller_input"
              />
              {/* <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="saller_input"
              /> */}
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="saller_input"
              />
              <input
                type="text"
                name="googlemapLink"
                placeholder="Google Map Link"
                value={formData.googlemapLink}
                onChange={handleInputChange}
                className="saller_input"
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="saller_input"
              />
              <input type="file" onChange={handleFileChange} className="saller_input" />
              {uploadProgress > 0 && (
                <div className="saller_upload_progress">Upload Progress: {uploadProgress}%</div>
              )}
              <button type="submit" className="saller_submit_btn">
                {editId ? "Update Saller" : "Add Saller"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adduser;
