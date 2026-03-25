import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateQuantity, removeCartItem } from "../api/cartApi";
import { placeOrder } from "../api/orderApi";

import "./CSS/CartPage.css";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [name, setName] = useState("");
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");

  const loadCart = async () => {
    const data = await getCart(token);
    setCart(data.items || []);
  };

  useEffect(() => {
    loadCart();

    fetch("http://127.0.0.1:8000/api/tables/")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Table load error:", err));
  }, []);

  const increaseQty = async (item) => {
    await updateQuantity(item.id, item.quantity + 1, token);
    loadCart();
  };

  const decreaseQty = async (item) => {
    if (item.quantity === 1) {
      await removeCartItem(item.id, token);
    } else {
      await updateQuantity(item.id, item.quantity - 1, token);
    }
    loadCart();
  };

  const removeItem = async (item) => {
    await removeCartItem(item.id, token);
    loadCart();
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleOrder = async () => {
    if (!tableId) {
      alert("Please select a table ❗");
      return;
    }

    try {
      const data = {
        name,
        table_number: tableId,
      };

      await placeOrder(data, token);

      await fetch("http://127.0.0.1:8000/api/create-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_price: total,
        }),
      });

      setCart([]);

      navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <button className="empty-back-btn" onClick={() => navigate("/home")}>
          ← Back to Menu
        </button>

        <div className="empty-content">
          <div className="cart-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items from our menu!</p>

          <button className="browse-btn" onClick={() => navigate("/home")}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <button className="back-btn" onClick={() => navigate("/home")}>
        ← Back to Menu
      </button>

      <h2 className="cart-title">Your Cart</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-card">
              <img src={item.image} alt={item.name} />

              <div className="item-info">
                <h3>{item.name}</h3>
                <p>${item.price} each</p>

                <div className="qty-control">
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item)}>+</button>
                </div>
              </div>

              <div className="item-price">
                <span>${(item.price * item.quantity).toFixed(2)}</span>

                <button className="delete-btn" onClick={() => removeItem(item)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h3>Order Summary</h3>

          <div className="summary-row-input">
            <span>Name (Optional)</span>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="summary-row-input">
            <span>Table *</span>

            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">Select Table</option>

              {tables
                .filter((table) => table.status === "available")
                .map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="order-btn" onClick={handleOrder}>
            Place Order
          </button>

          <button className="split-btn">Split Bill</button>

          <p className="note">Your order will be prepared fresh by our chefs</p>
        </div>
      </div>
    </div>
  );
}
