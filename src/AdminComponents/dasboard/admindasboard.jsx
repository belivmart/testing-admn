// import React, { useState, useEffect } from "react";

// import { makeApi } from "../../api/callApi";
// import "../../adminCss/dashboard/adminDashboard.css";

// const AdminDashboard = () => {
//   const [metrics, setMetrics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const response = await makeApi("/api/metrics", "GET"); // Replace `/metrics` with your actual endpoint
//         setMetrics(response.data);
//       } catch (err) {
//         setError("Failed to fetch metrics. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMetrics();
//   }, []);

//   if (loading) {
//     return <div className="admin-dashboard">Loading metrics...</div>;
//   }

//   if (error) {
//     return <div className="admin-dashboard error">{error}</div>;
//   }

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>
//       <div className="metrics-container">
//         <div className="metric-box">
//           <h2>Total Orders</h2>
//           <p>{metrics.totalOrders}</p>
//         </div>
//         <div className="metric-box">
//           <h2>Total Delivered Orders</h2>
//           <p>{metrics.totalDeliveredOrders}</p>
//         </div>
//         <div className="metric-box">
//           <h2>Total Delivered Products</h2>
//           <p>{metrics.totalDeliveredProducts}</p>
//         </div>
//         <div className="metric-box">
//           <h2>Total Net Profit</h2>
//           <p>₹{metrics.totalNetProfit.toFixed(2)}</p>
//         </div>
//         <div className="metric-box">
//           <h2>Today's Sales</h2>
//           <p>₹{metrics.todaySales.toFixed(2)}</p>
//         </div>
//         <div className="metric-box">
//           <h2>Today's Net Profit</h2>
//           <p>₹{metrics.todayNetProfit.toFixed(2)}</p>
//         </div>
//         <div className="metric-box">
//           <h2>Overall Sales</h2>
//           <p>₹{metrics.overallSales.toFixed(2)}</p>
//         </div>
//       </div>

//       <h2>Top Selling Products</h2>
//       <div className="top-products">
//         {metrics.topSellingProducts.length > 0 ? (
//           metrics.topSellingProducts.map((product, index) => (
//             <div className="product-box" key={index}>
//               <h3>{product.name}</h3>
//               <p>Quantity Sold: {product.quantity}</p>
//               <p>Total Revenue: ₹{product.totalRevenue.toFixed(2)}</p>
//             </div>
//           ))
//         ) : (
//           <p>No top-selling products available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// src/OverallReport.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const OverallReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the overall report from the backend API
  useEffect(() => {
    axios
      .get('http://localhost:5008/api/overall-report') // Replace with your backend API URL
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch the report');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="report-container">
      <h2>Overall Sales Report</h2>
      
      {/* Display overall metrics */}
      <div className="report-item">
        <strong>Total Sales: </strong>
        <span>₹{data.totalSales}</span>
      </div>
      <div className="report-item">
        <strong>Total Net Profit: </strong>
        <span>₹{data.totalNetProfit}</span>
      </div>
      <div className="report-item">
        <strong>Total Products Delivered: </strong>
        <span>{data.totalProductsDelivered}</span>
      </div>
      <div className="report-item">
        <strong>Total Orders: </strong>
        <span>{data.totalOrders}</span>
      </div>

      {/* Display top-selling products */}
      <h3>Top 50 Selling Products</h3>
      <table className="top-selling-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity Sold</th>
            <th>Total Revenue</th>
            <th>Net Profit</th>
          </tr>
        </thead>
        <tbody>
          {data.topSellingProducts.map((product) => (
            <tr key={product.name}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>₹{product.totalRevenue.toFixed(2)}</td>
              <td>₹{product.netProfit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OverallReport;
