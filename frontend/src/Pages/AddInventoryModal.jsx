import { useState } from "react";
import { addInventory } from "../api/inventoryApi";
import "./CSS/AddInventoryModal.css";

export default function AddInventoryModal({ closeModal, refresh, showSuccess }) {

  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    unit: "",
    minimum_stock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addInventory(form);

    refresh();       // reload inventory
    if (showSuccess) showSuccess(); // success alert
    closeModal();    // close modal
  };

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        {/* HEADER */}

        <div className="modal-header">
          <div>
            <h2>Add Inventory Item</h2>
            <p>Add a new item to track in inventory</p>
          </div>

          <span className="close-btn" onClick={closeModal}>
            ✕
          </span>
        </div>

        {/* FORM */}

        <form className="modal-form" onSubmit={handleSubmit}>

          <label>Item Name *</label>

          <input
            type="text"
            name="name"
            placeholder="e.g., Tomatoes, Chicken Breast"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div className="form-row">

            <div>
              <label>Current Stock *</label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Unit *</label>

              <input
                name="unit"
                placeholder="kg, lbs, pcs"
                value={form.unit}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <label>Minimum Stock Level</label>

          <input
            type="number"
            name="minimum_stock"
            value={form.minimum_stock}
            onChange={handleChange}
          />

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-btn"
            >
              Add Item
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}