import { useEffect, useState } from "react";
import {
  getReadyOrders,
  getPaymentOrders,
  updateOrderStatus,
  completePayment,
  getActiveTables,
} from "../api/orderApi";

import "./CSS/WaiterDashboard.css";
import bellIcon from "../assets/bell.png";
import debitIcon from "../assets/creditcard2.png";
import knifeIcon from "../assets/knife1.png";
import { useNavigate } from "react-router-dom";

export default function WaiterDashboard() {

  const navigate = useNavigate();

  const [readyOrders, setReadyOrders] = useState([]);
  const [awaitingPayments, setAwaitingPayments] = useState([]);
  const [activeTables, setActiveTables] = useState([]);

  // Load orders
  const loadOrders = async () => {
    try {

      const ready = await getReadyOrders();
      const payment = await getPaymentOrders();
      const active = await getActiveTables();

      setReadyOrders(ready || []);
      setAwaitingPayments(payment || []);
      setActiveTables(active || []);

    } catch (error) {

      console.error("Error loading orders:", error);

    }
  };

  // Mark Served
  const markServed = async (id) => {
    try {

      await updateOrderStatus(id, "served");
      loadOrders();

    } catch (error) {

      console.error("Serve error:", error);

    }
  };

  // Complete Payment
  const handlePayment = async (id) => {
    try {

      await completePayment(id);
      loadOrders();

    } catch (error) {

      console.error("Payment error:", error);

    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const activeTablesCount = activeTables.length;

  return (

    <div className="waiter-container">

      {/* Header */}

      <header className="waiter-header">

        <div>
          <h2>🍽 Waiter Dashboard</h2>
          <p>Serve orders and manage billing</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="logout-btns"
        >
          Logout
        </button>

      </header>

      <hr />

      {/* Stats */}

      <div className="stats-grid">

        <div className="statcard">
          <div>
            <p>Ready to Serve</p>
            <h3>{readyOrders.length}</h3>
          </div>
          <span className="icon">
            <img src={bellIcon} alt="" />
          </span>
        </div>

        <div className="statcard">
          <div>
            <p>Awaiting Payment</p>
            <h3>{awaitingPayments.length}</h3>
          </div>
          <span className="icon ">
            <img src={debitIcon} alt="" />
          </span>
        </div>

        <div className="statcard">
          <div>
            <p>Active Tables</p>
            <h3>{activeTablesCount}</h3>
          </div>
          <span className="icon ">
            <img src={knifeIcon} alt="" />
          </span>
        </div>

      </div>

      {/* Orders Section */}

      <div className="orders-section">

        {/* READY ORDERS */}

        <div className="orders-box">

          <h4>
            <img src={bellIcon} alt="" />
            Ready to Serve ({readyOrders.length})
          </h4>

          {readyOrders.length === 0 ? (

            <div className="empty-box">
              No orders ready
            </div>

          ) : (

            readyOrders.map((order) => (

              <div key={order.id} className="order-cards">

                <div className="order-header">

                  <h3>ORD-{order.id}</h3>

                  <span className="ready-badge">
                    Ready
                  </span>

                </div>

                <p className="table-info">
                  Table {order.table_number}
                </p>

                <div className="items-box">

                  {(order.items || []).map((item, i) => (

                    <div key={i} className="item-row">

                      <p>{item.name}</p>

                      <span>
                        Quantity: {item.quantity}
                      </span>

                    </div>

                  ))}

                </div>

                <div className="total-row">

                  <p>Total Amount</p>

                  <span>${order.total}</span>

                </div>

                <button
                  className="serve-btn"
                  onClick={() => markServed(order.id)}
                >
                  🍽 Mark as Served
                </button>

              </div>

            ))

          )}

        </div>

        {/* PAYMENT ORDERS */}

        <div className="orders-box">

          <h4>
            <img src={debitIcon} alt="" />
            Awaiting Payment ({awaitingPayments.length})
          </h4>

          {awaitingPayments.length === 0 ? (

            <div className="empty-box">
              No pending payments
            </div>

          ) : (

            awaitingPayments.map((order) => {

              const subtotal = Number(order.total) || 0;
              const tax = subtotal * 0.10;
              const total = subtotal + tax;

              return (

                <div key={order.id} className="billing-card">

                  <div className="billing-header">

                    <div>
                      <h3>ORD-{order.id}</h3>
                      <p>Table {order.table_number}</p>
                    </div>

                    <span className="billing-tag">
                      Billing
                    </span>

                  </div>

                  <div className="billing-box">

                    <div className="bill-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="bill-row">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <hr />

                    <div className="bill-row total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                  </div>

                  <button
                    className="complete-payment-btn"
                    onClick={() => handlePayment(order.id)}
                  >
                    ✓ Complete Payment
                  </button>

                </div>

              );

            })

          )}

        </div>

      </div>

      {/* ACTIVE TABLES */}

      <h3 className="active-title">
        All Active Tables
      </h3>

      <div className="active-grid">

        {activeTables.map((order) => {

          const total = Number(order.total) || 0;

          return (

            <div key={order.id} className="table-card">

              <div className="table-header">

                <h4>Table {order.table_number}</h4>

                <span className="status-badges">
                  {order.status}
                </span>

              </div>

              <p className="order-id">
                ORD-{order.id}
              </p>

              <p className="items-count">
                {(order.items || []).length} item(s)
              </p>

              <p className="table-price">
                ${total.toFixed(2)}
              </p>

            </div>

          );

        })}

      </div>

    </div>
  );
}