import { useNavigate } from "react-router-dom";
import "./Header.css";
import exitIcon from "../../assets/exit.png";

export default function Header({ totalItems = 0 }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          Eatrova
        </h2>
        <p className="subtitle">Browse our delicious menu</p>
      </div>

      <div className="header-actions">
        <button className="outline" onClick={() => navigate("/reserve")}>
          📅 Reserve Table
        </button>

        <button className="cart" onClick={() => navigate("/cart")}>
          🛒 View Cart
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>

        <button className="out" onClick={() => navigate("/")}>
          <img src={exitIcon} alt="Exit" />
        </button>
      </div>
    </header>
  );
}
