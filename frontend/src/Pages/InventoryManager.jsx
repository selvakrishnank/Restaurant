import { useEffect, useState } from "react";
import { getInventory, updateStock } from "../api/inventoryApi";
import AddInventoryModal from "./AddInventoryModal";
import "./CSS/InventoryManager.css";
import { useNavigate } from "react-router-dom";

export default function InventoryManager() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadItems = async () => {
    const data = await getInventory();
    setItems(data);
  };

  const total = items.length;

  const outOfStock = items.filter((i) => i.quantity === 0).length;

  const lowStock = items.filter((i) => i.quantity <= i.minimum_stock).length;

  const wellStocked = items.filter((i) => i.quantity > i.minimum_stock).length;

  const lowStockItems = items.filter((i) => i.quantity <= i.minimum_stock);

  const outOfStockItems = items.filter((i) => i.quantity === 0);

  const increaseStock = async (id) => {
    await updateStock(id, 10);
    setSuccess("Stock increased successfully");
    loadItems();
  };

  const decreaseStock = async (id) => {
    await updateStock(id, -10);
    setSuccess("Stock decreased successfully");
    loadItems();
  };

  return (
    <>
      {success && <div className="success-alert">✔ {success}</div>}

      <div className="inventory-page">
        <div className="inventory-header">
          <div>
            <h2>Inventory Management</h2>
            <p>Track and manage restaurant inventory</p>
          </div>

          <div className="header-buttons">
            <button className="add-item-btn" onClick={() => setShowModal(true)}>
              + Add Item
            </button>

            <button className="dashboard-btn" onClick={() => navigate(-1)}>
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="inventory-stats">
          <div className="card">
            <div>
              <p>Total Items</p>
              <h3>{total}</h3>
            </div>
            <span className="icon">📦</span>
          </div>

          <div className="card">
            <div>
              <p>Low Stock</p>
              <h3>{lowStock}</h3>
            </div>
            <span className="icon">📉</span>
          </div>

          <div className="card">
            <div>
              <p>Out of Stock</p>
              <h3>{outOfStock}</h3>
            </div>
            <span className="icon">⚠️</span>
          </div>

          <div className="card">
            <div>
              <p>Well Stocked</p>
              <h3>{wellStocked}</h3>
            </div>
            <span className="icon">📈</span>
          </div>
        </div>

        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="stock-alerts">
            <h4>⚠ Stock Alerts</h4>

            {outOfStockItems.length > 0 && (
              <div className="alert-section">
                <p className="alert-title">Out of Stock:</p>

                {outOfStockItems.map((item) => (
                  <span key={item.id} className="alert-badge red">
                    {item.name}
                  </span>
                ))}
              </div>
            )}

            {lowStockItems.length > 0 && (
              <div className="alert-section">
                <p className="alert-title">Low Stock:</p>

                {lowStockItems.map((item) => (
                  <span key={item.id} className="alert-badge orange">
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="inventory-list">
          <h3>Inventory Items</h3>

          {items.length === 0 ? (
            <>
              <p className="inventory-desc">
                No items yet. Add your first inventory item.
              </p>

              <div className="empty">
                📦
                <p>No inventory items yet</p>
                <button
                  className="add-first-btn"
                  onClick={() => setShowModal(true)}
                >
                  + Add First Item
                </button>
              </div>
            </>
          ) : (
            items.map((item) => {
              const status =
                item.quantity === 0
                  ? "Out of Stock"
                  : item.quantity <= item.minimum_stock
                    ? "Low Stock"
                    : "In Stock";

              return (
                <div key={item.id} className="inventory-item">
                  <div className="item-left">
                    <div className="item-header">
                      <h4>{item.name}</h4>

                      <span
                        className={
                          status === "In Stock"
                            ? "stock-badge"
                            : status === "Low Stock"
                              ? "low-badge"
                              : "out-badge"
                        }
                      >
                        {status}
                      </span>
                    </div>

                    <p>
                      Current Stock:
                      <b> {item.quantity} </b>
                      {item.unit}
                    </p>

                    <p>Minimum Level: {item.minimum_stock}</p>
                  </div>

                  <div className="stock-buttons">
                    <button onClick={() => decreaseStock(item.id)}>- 10</button>

                    <button onClick={() => increaseStock(item.id)}>+ 10</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showModal && (
          <AddInventoryModal
            closeModal={() => setShowModal(false)}
            refresh={loadItems}
            showSuccess={() => setSuccess("Inventory item added successfully")}
          />
        )}
      </div>
    </>
  );
}
