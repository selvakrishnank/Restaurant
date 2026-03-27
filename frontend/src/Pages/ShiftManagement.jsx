import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddShiftModal from "../components/AddShiftModal/AddShiftModal";
import "./CSS/ShiftManagement.css";

export default function ShiftManagement() {
  const [shifts, setShifts] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);

  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadShifts = async () => {
    let url = "http://127.0.0.1:8000/api/shifts/";

    if (date) {
      url += `?date=${date}`;
    }

    const res = await fetch(url);

    const data = await res.json();

    setShifts(data);
  };

  useEffect(() => {
    loadShifts();
  }, [date]);

  const startShift = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/shifts/start/${id}/`, {
      method: "PATCH",
    });

    setToast("Shift status updated");

    loadShifts();
  };

  const endShift = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/shifts/end/${id}/`, {
      method: "PATCH",
    });

    setToast("Shift status updated");

    loadShifts();
  };

  const deleteShift = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/shifts/delete/${id}/`, {
      method: "DELETE",
    });

    loadShifts();
  };

  const totalShifts = shifts.length;

  const scheduledShifts = shifts.filter(
    (shift) => shift.status === "scheduled",
  ).length;

  const activeShifts = shifts.filter(
    (shift) => shift.status === "active",
  ).length;

  const missedShifts = shifts.filter(
    (shift) => shift.status === "missed",
  ).length;

  return (
    <div className="shift-page">
      {toast && <div className="toast-success">✔ {toast}</div>}

      <div className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
        <span>Back</span>
      </div>

      <div className="shift-header">
        <div>
          <h2 className="shift-title">Shift Management</h2>

          <p className="shift-subtitle">Schedule and manage employee shifts</p>
        </div>

        <button className="add-shift-btn" onClick={() => setShowModal(true)}>
          + Add Shift
        </button>
      </div>

      <div className="shift-filter">
        <label className="filter-label">Filter by Date:</label>

        <input
          className="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="shift-stats">
        <div className="stat-cards">
          <div className="stat-icon blue">
            <FaUsers />
          </div>

          <div>
            <p className="stat-title">Total Shifts</p>
            <h3 className="stat-number">{totalShifts}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCalendarAlt />
          </div>

          <div>
            <p className="stat-title">Scheduled</p>
            <h3 className="stat-number">{scheduledShifts}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaClock />
          </div>

          <div>
            <p className="stat-title">Active</p>
            <h3 className="stat-number">{activeShifts}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaExclamationCircle />
          </div>

          <div>
            <p className="stat-title">Missed</p>
            <h3 className="stat-number">{missedShifts}</h3>
          </div>
        </div>
      </div>

      <div className="shift-list">
        <h3 className="shift-date-title">Shifts for {date}</h3>

        {shifts.length === 0 ? (
          <p className="no-shifts">No shifts scheduled for this date</p>
        ) : (
          shifts.map((shift) => (
            <div key={shift.id} className="shift-card">
              <div className="shift-left">
                <div className="shift-top">
                  <span className="shift-name">{shift.employee_name}</span>

                  <span className="shift-role">{shift.role}</span>

                  <span className="shift-status">{shift.status}</span>
                </div>

                <div className="shift-time">
                  {shift.start_time} - {shift.end_time}
                </div>
              </div>

              <div className="shift-actions">
                {shift.status === "scheduled" && (
                  <button
                    className="start-btn"
                    onClick={() => startShift(shift.id)}
                  >
                    Start Shift
                  </button>
                )}

                {shift.status === "active" && (
                  <button
                    className="end-btn"
                    onClick={() => endShift(shift.id)}
                  >
                    End Shift
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => deleteShift(shift.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AddShiftModal
          closeModal={() => setShowModal(false)}
          refresh={loadShifts}
        />
      )}
    </div>
  );
}
