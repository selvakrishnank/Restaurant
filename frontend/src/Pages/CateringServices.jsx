import { useEffect, useState } from "react";
import {
  getOrders,
  confirmOrder,
  cancelOrder,
  startPrep,
  completeOrder,
} from "../api/cateringApi";

import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";

import CreateCateringModal from "../components/CreateCateringModal/CreateCateringModal";
import { useNavigate } from "react-router-dom";
import "./CSS/CateringServices.css";

export default function CateringServices() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleConfirm = async (id) => {
    await confirmOrder(id);
    loadOrders();
  };

  const handleCancel = async (id) => {
    await cancelOrder(id);
    loadOrders();
  };

  const handleStart = async (id) => {
    await startPrep(id);
    loadOrders();
  };

  const handleComplete = async (id) => {
    await completeOrder(id);
    loadOrders();
  };

  /* STATS */
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const totalGuests = orders.reduce((sum, o) => sum + o.guests, 0);
  const revenue = orders.reduce((sum, o) => sum + Number(o.price), 0);

  return (
    <div className="catering-page">

      {/* MODAL */}
      {showModal && (
        <CreateCateringModal
          closeModal={() => setShowModal(false)}
          refresh={loadOrders}
        />
      )}

      {/* HEADER */}
      <div className="top-bar" onClick={() => navigate(-1)}>← Back</div>

      <div className="header">
        <div>
          <h2>Catering Services</h2>
          <p>Manage large event orders and catering bookings</p>
        </div>

        <button className="new-btn" onClick={() => setShowModal(true)}>
          + New Catering Order
        </button>
      </div>

      {/* ✅ STATS WITH ICONS */}
      <div className="stats">

        <div className="card stat-card">
          <div className="stat-left orange">
            <FaUtensils />
          </div>
          <div>
            <p>Total Orders</p>
            <h3>{totalOrders}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-left yellow">
            <FaClock />
          </div>
          <div>
            <p>Pending</p>
            <h3>{pending}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-left blue">
            <FaCheckCircle />
          </div>
          <div>
            <p>Confirmed</p>
            <h3>{confirmed}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-left purple">
            <FaUsers />
          </div>
          <div>
            <p>Total Guests</p>
            <h3>{totalGuests}</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-left green">
            <FaDollarSign />
          </div>
          <div>
            <p>Est. Revenue</p>
            <h3>${revenue}</h3>
          </div>
        </div>

      </div>

      {/* ORDERS */}
      {orders.map((order) => (
        <div key={order.id} className="orders-card">

          {/* LEFT */}
          <div className="left">
            <div className="title-row">
              <h3>{order.name}</h3>

              <span className="tag">{order.event_type}</span>

              <span
                className={
                  order.status === "confirmed"
                    ? "badge blue"
                    : order.status === "pending"
                    ? "badge yellow"
                    : order.status === "in_progress"
                    ? "badge purple"
                    : "badge green"
                }
              >
                {order.status}
              </span>
            </div>

            <p>📅 {order.date} {order.time}</p>
            <p>👥 {order.guests} guests</p>
            <p>📞 {order.phone}</p>
          </div>

          {/* RIGHT */}
          <div className="right">

            {/* TOP RIGHT */}
            <div className="right-top">

              <h2 className="price">${order.price}</h2>

              {order.status === "pending" && (
                <div className="btn-group">
                  <button
                    className="confirm-btn"
                    onClick={() => handleConfirm(order.id)}
                  >
                    Confirm
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {order.status === "confirmed" && (
                <button
                  className="prep-btn"
                  onClick={() => handleStart(order.id)}
                >
                  Start Prep
                </button>
              )}

              {order.status === "in_progress" && (
                <button
                  className="complete-btn"
                  onClick={() => handleComplete(order.id)}
                >
                  Complete
                </button>
              )}

              {order.status === "completed" && (
                <span className="done-text">Completed</span>
              )}

            </div>

            {/* BOTTOM RIGHT */}
            <div className="right-bottom">
              <p className="venue">📍 {order.venue}</p>

              <p className="note">
                <strong>Note:</strong> {order.requests}
              </p>
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}