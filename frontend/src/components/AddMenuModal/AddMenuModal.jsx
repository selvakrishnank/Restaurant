import { useState } from "react";
import { createMenuItem } from "../../api/managerApi";
import "../AddMenuModal/AddMenuModal.css";

export default function AddMenuModal({ closeModal, refresh }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Starters",
    is_available: true,
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("is_available", form.is_available);

    if (image) {
      data.append("image", image);
    }

    try {
      await createMenuItem(data);

      await refresh();

      closeModal();
    } catch (error) {
      console.error("Create menu error:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Add New Menu Item</h2>

          <button className="close-btn" onClick={closeModal}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <select name="category" value={form.category} onChange={handleChange}>
            <option value="Starters">Starters</option>
            <option value="Main">Main Course</option>
            <option value="Desserts">Desserts</option>
            <option value="Drinks">Drinks</option>
          </select>

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
}
