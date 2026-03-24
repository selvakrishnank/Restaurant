import React, { useEffect, useState } from "react";
import "./CSS/OrderTracking.css";
import { useNavigate } from "react-router-dom";
import { getCurrentOrder, getOrderHistory } from "../api/orderApi";

function OrderTracking() {
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);

  const token = localStorage.getItem("access");

  // Load Orders
  const loadOrders = async () => {
    const current = await getCurrentOrder(token);
    const history = await getOrderHistory(token);

    setCurrentOrder(current);
    setPreviousOrders(history);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (!currentOrder) return <p>Loading...</p>;

  return (
    <div className="tracking-page">
      {/* Header */}

      <div className="tracking-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back to Menu
        </button>

        <h2>Order Tracking</h2>
      </div>

      {/* Current Order */}

      <div className="order-card">
        <div className="order-top">
          <div>
            <h3>Current Order - ORD-{currentOrder.id}</h3>

            <p className="table-info">Table {currentOrder.table_number}</p>
          </div>

          <span className="status-badge">{currentOrder.status}</span>
        </div>

        {/* Progress */}

        <div className="progress-container">
          <div
            className={`step ${currentOrder.status === "received" ? "active" : ""}`}
          >
            <div className="circle">⏱</div>
            <p>Order Received</p>
          </div>

          <div
            className={`step ${currentOrder.status === "preparing" ? "active" : ""}`}
          >
            <div className="circle">👨‍🍳</div>
            <p>Being Prepared</p>
          </div>

          <div
            className={`step ${currentOrder.status === "ready" ? "active" : ""}`}
          >
            <div className="circle">🍽</div>
            <p>Ready to Serve</p>
          </div>

          <div
            className={`step ${currentOrder.status === "served" ? "active" : ""}`}
          >
            <div className="circle">✓</div>
            <p>Served</p>
          </div>
        </div>

        {/* Order Items */}

        <div className="items">
          <h4>Order Items:</h4>

          {currentOrder.items?.map((item, index) => {
            const price = Number(item.price) || 0;

            return (
              <div key={index} className="item-row">
                <div className="item-left">
                  <p>{item.name}</p>

                  <span>Qty: {item.quantity}</span>
                </div>

                <div className="item-price">${price.toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        <hr />

        {/* Total */}

        <div className="total">
          <p>Total Amount</p>

          <p className="total-price">
            ${(Number(currentOrder.total) || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Previous Orders */}

      <h3 className="previous-title">Previous Orders</h3>

      {previousOrders.map((order) => (
        <div className="previous-card" key={order.id}>
          <div>
            <h4>ORD-{order.id}</h4>

            <p>Table {order.table_number}</p>

            <span>{order.items.length} item(s)</span>
          </div>

          <div className="prev-right">
            <span className="status-badge">{order.status}</span>

            <p>${(Number(order.total) || 0).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderTracking;
