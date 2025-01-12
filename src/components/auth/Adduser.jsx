import React, { useState } from 'react';
import "../../style/login.css";
import { makeApi } from "../../api/callApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

function AddUserForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await makeApi("/api/register-user", "POST", {
        username,
        mobileNumber,
        password,
        role
      });
     
    } catch (error) {
      console.error("Error adding user:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div className='main_login_page_div_admin'>
        <form className="form_main">
          <p className="heading">Add New User</p>

          <div className="inputContainer">
            <input
              type="text"
              className="inputField"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <input
              type="number"
              className="inputField"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <input
              type="password"
              className="inputField"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <select
              className="inputField"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {loading ? (
            <div className='loginloader'></div>
          ) : (
            <div className='w-100 text-center'>
              <button id="button" onClick={(e) => handleSubmit(e)}>Add User</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default AddUserForm;
