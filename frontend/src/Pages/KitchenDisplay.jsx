import { useEffect, useState } from "react";
import "./CSS/KitchenDisplay.css";
import { useNavigate } from "react-router-dom";

export default function KitchenDisplay() {
  const [time, setTime] = useState("");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getPriority = (createdAt) => {
    const diff = Math.floor((new Date() - new Date(createdAt)) / 60000);

    if (diff >= 20) return "urgent";
    if (diff >= 10) return "medium";
    return "normal";
  };

  const loadOrders = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/orders/kitchen/orders/",
      );

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/${id}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const data = await res.json();
      console.log("Order updated:", data);

      if (status === "preparing") {
        setMessage("Started cooking order");
      }

      if (status === "ready") {
        setMessage("Order marked as ready for pickup");
      }

      setTimeout(() => {
        setMessage("");
      }, 3000);

      loadOrders();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    loadOrders();

    const orderInterval = setInterval(loadOrders, 5000);

    return () => {
      clearInterval(clock);
      clearInterval(orderInterval);
    };
  }, []);

  return (
    <div className="kds-container">
      {message && <div className="success-popup">✅ {message}</div>}

      <div className="kds-header">
        <div className="header-left">
          <span className="chef-icon">🍳</span>

          <div>
            <h2>Kitchen Display System</h2>
            <p>
              {time} • {orders.length} active orders
            </p>
          </div>
        </div>

        <button onClick={() => navigate("/")} className="logoutbtn">
          Logout
        </button>
      </div>

      <div className="orders-grid">
        {orders.map((order) => {
          const minutes = Math.floor(
            (new Date() - new Date(order.created_at)) / 60000,
          );

          const priority = getPriority(order.created_at);

          return (
            <div className="ordercard" key={order.id}>
              <div className="order-header">
                <div>
                  <h3>Table {order.table_number}</h3>

                  <p className="order-id">ORD-{order.id}</p>

                  <p className="order-time">⏱ {minutes} min ago</p>
                </div>

                <span className={`badge ${priority}`}>
                  {priority.toUpperCase()}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div className="order-item" key={i}>
                    <span className="qty">x{item.quantity}</span>

                    <div>
                      <p>{item.name}</p>

                      <span className="category">starters</span>
                    </div>
                  </div>
                ))}
              </div>

              {order.status === "received" && (
                <button
                  className="start-btn"
                  onClick={() => updateStatus(order.id, "preparing")}
                >
                  🍳 Start Cooking
                </button>
              )}

              {order.status === "preparing" && (
                <button
                  className="ready-btn"
                  onClick={() => updateStatus(order.id, "ready")}
                >
                  ✅ Mark Ready
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
