import { useState } from "react";
import { createOrder } from "../../api/cateringApi";
import "./CreateCateringModal.css";

export default function CateringModal({ closeModal, refresh }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    event_type: "corporate",   // ✅ FIXED
    guests: 50,
    date: "",
    time: "",
    venue: "",
    requests: "",
  });

  const baseRate = 30;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const estimatedCost = form.guests * baseRate;

  // ✅ FINAL SUBMIT (CONNECTED TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        event_type: form.event_type.toLowerCase(),
      };

      if (!payload.time) payload.time = null;

      await createOrder(payload);

      refresh();     // 🔥 reload orders in parent
      closeModal();  // close modal

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Create Catering Order</h2>
          <button onClick={closeModal}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="row">
            <div>
              <label>Client Name *</label>
              <input
                name="name"
                placeholder="Company or Person name"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone Number *</label>
              <input
                name="phone"
                placeholder="+1-555-0000"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <label>Email</label>
          <input
            name="email"
            placeholder="client@email.com"
            onChange={handleChange}
          />

          {/* Row 2 */}
          <div className="row">
            <div>
              <label>Event Type</label>
              <select name="event_type" onChange={handleChange}>
                <option value="corporate">Corporate Event</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="party">Party</option>
              </select>
            </div>

            <div>
              <label>Guest Count</label>
              <input
                name="guests"
                type="number"
                value={form.guests}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="row">
            <div>
              <label>Event Date *</label>
              <input type="date" name="date" onChange={handleChange} />
            </div>

            <div>
              <label>Event Time</label>
              <input type="time" name="time" onChange={handleChange} />
            </div>
          </div>

          {/* Venue */}
          <label>Venue</label>
          <input
            name="venue"
            placeholder="Event location address"
            onChange={handleChange}
          />

          {/* Special Requests */}
          <label>Special Requests</label>
          <textarea
            name="requests"
            placeholder="Dietary restrictions, setup requirements, etc."
            onChange={handleChange}
          />

          {/* COST */}
          <div className="cost-box">
            <strong>Estimated Cost:</strong> ${estimatedCost.toFixed(2)}
            <span>(Base rate: $30 per person)</span>
          </div>

          {/* ✅ BUTTON (NO onClick) */}
          <button type="submit" className="submit-btn">
            Create Order
          </button>

        </form>
      </div>
    </div>
  );
}