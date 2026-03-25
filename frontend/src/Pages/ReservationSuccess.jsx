import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/ReservationSuccess.css";
import { useEffect } from "react";

export default function ReservationSuccess() {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [data, navigate]);

  return (
    <div className="success-page">
      <div className="top-banner">✔ Reservation submitted successfully!</div>

      <div className="success-card">
        <div className="check-icon">✓</div>

        <h2>Reservation Confirmed!</h2>
        <p>We'll send you a confirmation message shortly at {data?.phone}</p>

        <div className="details-box">
          <p>
            <strong>Name:</strong> {data?.full_name}
          </p>
          <p>
            <strong>Date:</strong> {data?.date}
          </p>
          <p>
            <strong>Guests:</strong> {data?.number_of_guests}
          </p>
        </div>
      </div>
    </div>
  );
}
