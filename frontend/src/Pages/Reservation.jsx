import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CSS/Reservation.css";

export default function Reservation() {
  const navigate = useNavigate();

  const [full_name, setFullName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [number_of_guests, setGuests] = useState(2);
  const [special_requests, setRequests] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      full_name,
      phone_number,
      date,
      time,
      number_of_guests,
      special_requests,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reservations/reservations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert("Reservation successful ✅");
        navigate("/reservation-success", { state: data });
      } else {
        alert("Error: " + JSON.stringify(result));
      }
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Server not responding ❌");
    }
  };

  return (
    <div className="reservation-container">
      <div className="reserve-wrapper">
        <div className="reservation-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h1 className="title">Table Reservations</h1>
        </div>

        <div className="reservation-content">
          <div className="reservation-card">
            <h2>Make a Reservation</h2>
            <p className="subtitle">Reserve your table at Eatrova</p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <b>Full Name *</b>
                  </label>
                  <input
                    type="text"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <b>Phone Number *</b>
                  </label>
                  <input
                    type="text"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="999-999-9999"
                    pattern="[6-9]{1}[0-9]{9}"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <b>Date *</b>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <b>Time *</b>
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <b>Number of Guests</b>
                </label>
                <input
                  type="number"
                  value={number_of_guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  <b>Special Requests (Optional)</b>
                </label>
                <textarea
                  value={special_requests}
                  onChange={(e) => setRequests(e.target.value)}
                />
              </div>

              <button type="submit" className="reserve-btn">
                Reserve Table
              </button>
            </form>
          </div>

          <div className="info-card">
            <h3>Information</h3>

            <div className="info-box hours">
              <h4>Operating Hours</h4>
              <p>Mon-Thu: 11:00 AM - 10:00 PM</p>
              <p>Fri-Sat: 11:00 AM - 11:00 PM</p>
              <p>Sunday: 10:00 AM - 9:00 PM</p>
            </div>

            <div className="info-box policy">
              <h4>Reservation Policy</h4>
              <ul>
                <li>Reservations held for 15 min</li>
                <li>24hr cancellation notice</li>
                <li>Large groups call ahead</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
