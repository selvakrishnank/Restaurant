import React, { useEffect, useState } from "react";
import "./CSS/ManagerDashboard.css";
import EditMenuModal from "../components/EditMenuModal/EditMenuModal";
import AddMenuModal from "../components/AddMenuModal/AddMenuModal";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getRecentOrders,
  getMenuItems,
  toggleMenuItem,
  deleteMenuItem,
  updateMenuItem,
} from "../api/managerApi";

import {
  FaShoppingBag,
  FaDollarSign,
  FaChartLine,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ManagerDashboard() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    try {
      const statsData = await getDashboardStats();
      const ordersData = await getRecentOrders();
      const menuData = await getMenuItems();

      setStats(statsData || {});
      setOrders(ordersData || []);
      setMenuItems(menuData || []);
    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (id) => {
    try {
      await toggleMenuItem(id);
      loadData();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      loadData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateMenuItem(id, data);

      loadData();
      setSelectedItem(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const filteredMenu =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h2>Manager Dashboard</h2>
          <p>Manage menu and view reports</p>
        </div>

        <div className="header-buttons">
          <button
            onClick={() => navigate("/inventory")}
            className="btn-outline"
          >
            Inventory
          </button>
          <button onClick={() => navigate("/")} className="btn-outline">
            Logout
          </button>
        </div>
      </div>

      <hr />

      <div className="stats">
        <div className="cards stats-card">
          <div>
            <h4>Total Orders</h4>
            <p>{stats?.total_orders || 0}</p>
          </div>
          <FaShoppingBag />
        </div>

        <div className="card stat-card">
          <div>
            <h4>Total Revenue</h4>
            <p>${Number(stats?.total_revenue || 0).toFixed(2)}</p>
          </div>
          <FaDollarSign />
        </div>

        <div className="card stat-card">
          <div>
            <h4>Avg Order Value</h4>
            <p>${Number(stats?.avg_order_value || 0).toFixed(2)}</p>
          </div>
          <FaChartLine />
        </div>

        <div className="card stat-card">
          <div>
            <h4>Menu Items</h4>
            <p>{stats?.menu_items || 0}</p>
          </div>
          <FaUtensils />
        </div>
      </div>

      <div className="quick-access">
        <h3>Quick Access</h3>

        <div className="quick-grid">
          <div className="quick-card" onClick={() => navigate("/shifts")}>
            <FaCalendarAlt />
            <span>Shift Management</span>
          </div>

          <div className="quick-card" onClick={() => navigate("/floor")}>
            <FaUtensils />
            <span>Floor Plan</span>
          </div>

          <div className="quick-card" onClick={() => navigate("/inventory")}>
            <FaShoppingBag />
            <span>Inventory</span>
          </div>

          <div className="quick-card" onClick={() => navigate("/catering")}>
            <FaDollarSign />
            <span>Catering</span>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-header">
          <h3>Menu Management</h3>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New Item
          </button>
        </div>

        <div className="menu-tabs">
          <button
            className={selectedCategory === "All" ? "active-tab" : ""}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          <button
            className={selectedCategory === "Starters" ? "active-tab" : ""}
            onClick={() => setSelectedCategory("Starters")}
          >
            Starters
          </button>

          <button
            className={selectedCategory === "Main" ? "active-tab" : ""}
            onClick={() => setSelectedCategory("Main")}
          >
            Main
          </button>

          <button
            className={selectedCategory === "Desserts" ? "active-tab" : ""}
            onClick={() => setSelectedCategory("Desserts")}
          >
            Desserts
          </button>

          <button
            className={selectedCategory === "Drinks" ? "active-tab" : ""}
            onClick={() => setSelectedCategory("Drinks")}
          >
            Drinks
          </button>
        </div>

        <div className="menu-list">
          {filteredMenu.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="menu-left">
                <img src={item.image} alt={item.name} className="menu-image" />

                <div className="menu-info">
                  <h4>{item.name}</h4>

                  <span className="badge">{item.category}</span>

                  <p>{item.description}</p>
                </div>
              </div>

              <div className="menu-actions">
                <span className="menu-price">
                  ${Number(item.price).toFixed(2)}
                </span>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={item.is_available}
                    onChange={() => handleToggle(item.id)}
                  />

                  <span className="slider"></span>
                </label>

                <button
                  className="edit-btn"
                  onClick={() => setSelectedItem(item)}
                >
                  ✏
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>

        {orders.length === 0 ? (
          <p className="no-orders">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="recent-order-card">
              <div className="order-left">
                <h4>ORD-{order.id}</h4>

                <p>
                  Table {order.table_number} • {order.items_count} items
                </p>
              </div>

              <div className="order-right">
                <span className="order-price">
                  ${Number(order.total).toFixed(2)}
                </span>

                <span className="order-status">Completed</span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <EditMenuModal
          item={selectedItem}
          closeModal={() => setSelectedItem(null)}
          onUpdate={handleUpdate}
        />
      )}

      {showAddModal && (
        <AddMenuModal
          closeModal={() => setShowAddModal(false)}
          refresh={loadData}
        />
      )}
    </div>
  );
}
