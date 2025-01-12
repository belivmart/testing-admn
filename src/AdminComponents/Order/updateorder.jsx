import React, { useState, useEffect } from "react";
import { makeApi } from "../../api/callApi";
import "../../adminCss/order/updateorder.css";
import Loader from "../../components/loader/loader";

const UpdateOrderPopup = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatedOrderData, setUpdatedOrderData] = useState({
    paymentMethod: "",
    deliveredAt: "",
    status: "",
    deliveredBy: "",
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await makeApi(
          `/api/get-second-order-by-id/${orderId}`,
          "GET"
        );
        const orderData = response.data.order;
        setOrder(orderData);
        setUpdatedOrderData({
          paymentMethod: orderData?.paymentMethod,
          deliveredAt: orderData?.deliveredAt
            ? new Date(orderData?.deliveredAt).toISOString().slice(0, 16)
            : "",
          status: orderData.status,
          deliveredBy: orderData?.deliveredBy || "",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrderData({
      ...updatedOrderData,
      [name]: value,
    });
  };

  const handleUpdateOrder = async () => {
    try {
      const response = await makeApi(
        `/api/update-second-order-by-id/${orderId}`,
        "PUT",
        updatedOrderData
      );
      console.log(response, "updated");
      onClose(); // Close popup after updating
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="popup-container">
      {order && (
        <div className="popup-content-for-update-page">
          <h2>Update Order</h2>
          <div className="update_page_payment_details">
            <h3>Payment Details:</h3>
            {/* Payment Method Dropdown */}
            <label>Payment Method:</label>
            <select
              name="paymentMethod"
              className="update_order_input_fileds"
              value={updatedOrderData?.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="">Select Payment Method</option>
              <option value="COD">COD</option>
              <option value="Online">Online</option>
            </select>

            <div>
              <label>Delivered At:</label>
              <input
                type="datetime-local"
                className="update_order_input_fileds"
                name="deliveredAt"
                value={updatedOrderData?.deliveredAt}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label>Status:</label>
              <select
                name="status"
                className="update_order_input_fileds"
                value={updatedOrderData?.status}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
              </select>
            </div>

            {/* Show "Delivered By" dropdown if status is "Delivered" */}
            {updatedOrderData?.status === "Delivered" && (
              <div>
                <label>Delivered By:</label>
                <select
                  name="deliveredBy"
                  className="update_order_input_fileds"
                  value={updatedOrderData?.deliveredBy}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Deliverer</option>
                  <option value="Vaibhav">Vaibhav</option>
                  <option value="Manish">Manish</option>
                  <option value="Rakesh">Rakesh</option>
                </select>
              </div>
            )}
          </div>

          <div className="button-group">
            <button onClick={handleClose}>Close</button>
            <button onClick={handleUpdateOrder}>Update Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateOrderPopup;
