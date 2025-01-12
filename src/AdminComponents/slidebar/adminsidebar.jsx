import React, { useState, useEffect } from "react";
import "../../adminCss/sidebar/adminsidebar.css";
import { Link } from "react-router-dom";
import { makeApi } from "../../api/callApi";

function Adminsidebar() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isOpen, setIsOpen] = useState(true); // State to track sidebar open/close
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle mobile navbar
  const [userRole, setUserRole] = useState(null); // Store user role

  const handleMenuItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const checkUserRole = async () => {
        try {
          const response = await makeApi("/api/my-profile", "GET");
          setUserRole(response.data.user.role); // Set the user's role to state
        } catch (error) {
          console.log(error);
        }
      };
      checkUserRole();
    }
  }, []);

  return (
    <div className={`main_admin_sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Sidebar Toggle Button */}
      <button className="toggleButton" onClick={toggleSidebar}>
        {isOpen ? "Hide" : "Show"}
      </button>

      {/* Hamburger Menu for Mobile */}
      <button className="hamburger-menu" onClick={toggleMobileMenu}>
        &#9776; {/* Hamburger icon */}
      </button>

      <div className="admin_sidebar">
        <div className="admin_sidebar_header">
          <div className="admin_sidebar_header_logo">
            <img
              loading="lazy"
              alt="logo"
              src="https://res.cloudinary.com/dunzldpvc/image/upload/v1724845466/S-logo.2bd09d912f48dc27084b_hcprcw.png"
              className="admin_sidebar_header_logo_img"
            />
          </div>
        </div>

        {/* Navbar / Sidebar Menu List */}
        <div
          className={`admin_sidebar_menu_list ${
            isMenuOpen ? "show" : ""
          } ${window.innerWidth <= 500 ? "mobile" : ""}`}
        >
          {/* Render for Admin */}
          {userRole === "admin" && (
            <>
              <Link className="Link_tag" to={"/admin/allproducts"}>
                <div
                  className={`admin_sidebar_menu_items ${
                    selectedItem === "All Products" ? "selected" : ""
                  }`}
                  onClick={() => handleMenuItemClick("All Products")}
                >
                  Products
                </div>
              </Link>

              <Link className="Link_tag" to={"/admin/all-orders"}>
                <div
                  className={`admin_sidebar_menu_items ${
                    selectedItem === "All Orders" ? "selected" : ""
                  }`}
                  onClick={() => handleMenuItemClick("All Orders")}
                >
                  Orders
                </div>
              </Link>

              <Link className="Link_tag" to={"/admin/all-categories"}>
                <div
                  className={`admin_sidebar_menu_items ${
                    selectedItem === "Service" ? "selected" : ""
                  }`}
                  onClick={() => handleMenuItemClick("Service")}
                >
                  Service
                </div>
              </Link>

              <Link className="Link_tag" to={"/admin/saller"}>
                <div
                  className={`admin_sidebar_menu_items ${
                    selectedItem === "Saller" ? "selected" : ""
                  }`}
                  onClick={() => handleMenuItemClick("Saller")}
                >
                  Saller
                </div>
              </Link>
            </>
          )}

          {/* Render for User */}
          {userRole === "user" && (
            <>
              <Link className="Link_tag" to={"/admin/all-orders"}>
                <div
                  className={`admin_sidebar_menu_items ${
                    selectedItem === "All Orders" ? "selected" : ""
                  }`}
                  onClick={() => handleMenuItemClick("All Orders")}
                >
                  Orders
                </div>
              </Link>

              <Link className="Link_tag" to={"/admin/saller"}>
                <div
                  className={`admin_sidebar_menu_items ${
                    selectedItem === "Saller" ? "selected" : ""
                  }`}
                  onClick={() => handleMenuItemClick("Saller")}
                >
                  Saller
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Adminsidebar;
