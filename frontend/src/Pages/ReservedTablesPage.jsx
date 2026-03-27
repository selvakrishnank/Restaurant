import { useEffect, useState } from "react";
import { getReservedTables, cancelReservation } from "../api/reservationApi";
import "./CSS/ReservedTablesPage.css";

export default function ReservedTablesPage() {
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    const data = await getReservedTables();
    setReservations(data || []);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;

    await cancelReservation(id);
    loadReservations(); 
  };

  return (
    <div className="reserved-container">
      <h2>🪑 Reserved Tables</h2>

      {reservations.length === 0 ? (
        <p>No reservations found</p>
      ) : (
        <div className="reserved-grid">
          {reservations.map((r) => (
            <div key={r.id} className="reserved-card">

              <div className="reserved-header">
                <h3>{r.table}</h3>
                <span className="badge">Reserved</span>
              </div>

              <p><b>Name:</b> {r.name}</p>
              <p><b>Phone:</b> {r.phone}</p>
              <p><b>Date:</b> {r.date}</p>
              <p><b>Time:</b> {r.time}</p>

              <button
                className="cancel-btn"
                onClick={() => handleCancel(r.id)}
              >
                ❌ Cancel Reservation
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}