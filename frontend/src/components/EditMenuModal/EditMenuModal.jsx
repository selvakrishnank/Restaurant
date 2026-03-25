import React, { useState } from "react";
import "./EditMenuModal.css";

export default function EditMenuModal({ item, closeModal, onUpdate }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [category, setCategory] = useState(item.category);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name,
      description,
      price,
      category,
    };

    await onUpdate(item.id, updatedData);

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Edit Menu Item</h2>

          <button className="close-btn" onClick={closeModal}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Item Name</label>

          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-row">
            <div>
              <label>Price ($)</label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Starters</option>
                <option>Main</option>
                <option>Desserts</option>
                <option>Drinks</option>
              </select>
            </div>
          </div>

          <button className="update-btn">Update Item</button>
        </form>
      </div>
    </div>
  );
}
