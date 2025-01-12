import React, { useState, useEffect } from "react";
import { makeApi } from "../../api/callApi";
import "./TodayReport.css";

const TodayReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodayReport = async () => {
      try {
        const response = await makeApi("/api/today-report", "GET");
        setReport(response.data);
      } catch (err) {
        setError("Failed to fetch today's report. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayReport();
  }, []);

  if (loading) {
    return <div className="today-report">Loading today's report...</div>;
  }

  if (error) {
    return <div className="today-report error">{error}</div>;
  }

  return (
    <div className="today-report">
      <h1>Today's Report</h1>
      <div className="report-container">
        <div className="report-box">
          <h2>Total Orders</h2>
          <p>{report.totalTodayOrders || "N/A"}</p>
        </div>
        <div className="report-box">
          <h2>Total Delivered Orders</h2>
          <p>{report.totalTodayDeliveredOrders || "N/A"}</p>
        </div>
        <div className="report-box">
          <h2>Total Spent Money</h2>
          <p>₹{report.todaySales || "₹0.00"}</p>
        </div>
        <div className="report-box">
          <h2>Total Net Profit</h2>
          <p>₹{report.todayNetProfit || "₹0.00"}</p>
        </div>
        <div className="report-box">
          <h2>Today's Sold Products</h2>
          <p>{report.todaySoldProducts || "N/A"}</p>
        </div>
      </div>

      <h2>Today's Top Selling Products</h2>
      <div className="top-products">
        {report.topSellingProducts?.length > 0 ? (
          report.topSellingProducts.map((product, index) => (
            <div className="product-box" key={index}>
              <h3>{product.name}</h3>
              <p>Quantity Sold: {product.quantity}</p>
              <p>Total Revenue: ₹{product.totalRevenue || "₹0.00"}</p>
              <p>Net Profit: ₹{product.netProfit || "₹0.00"}</p>
            </div>
          ))
        ) : (
          <p>No top-selling products available for today.</p>
        )}
      </div>
    </div>
  );
};

export default TodayReport;
