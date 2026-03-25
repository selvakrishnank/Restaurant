import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();

 useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order-tracking");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="success-page">
      <div className="success-card">

        <div className="check-circle">
          ✓
        </div>

        <h2>Order Placed Successfully!</h2>

        <p className="message">
          Your order has been sent to the kitchen. You can track its progress now.
        </p>

        <p className="redirect">
          Redirecting to order tracking...
        </p>

      </div>
    </div>
  );
}

export default OrderSuccess;