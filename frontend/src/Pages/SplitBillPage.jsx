import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CSS/SplitBillPage.css";

export default function SplitBillPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cart = state?.cart || [];

  const [people, setPeople] = useState(2);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const perPerson = total / people;

  return (
    <div className="split-container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>Split Bill</h2>

      <div className="people-box">
        <label>Number of People</label>
        <input
          type="number"
          value={people}
          min="1"
          onChange={(e) => setPeople(Number(e.target.value))}
        />
      </div>

      <div className="items-boxs">
        <h3>Items</h3>
        {cart.map((item) => (
          <div key={item.id} className="item-row">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="total-box">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>

      <div className="split-result">
        <h2>Each Person Pays</h2>
        <h1>${perPerson.toFixed(2)}</h1>
      </div>
    </div>
  );
}
