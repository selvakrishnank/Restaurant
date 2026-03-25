import { useEffect, useState } from "react";
import { getDashboard } from "../api/ownerApi";
import "./CSS/OwnerDashboard.css";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getDashboard();
    setData(res);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="icon">📈</div>

          <div>
            <h2>Owner Dashboard</h2>
            <p>Business analytics and staff management</p>
          </div>
        </div>

        <button onClick={() => navigate("/")} className="logouts-btn">
          ⎋ Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <h2>${Number(data.total_revenue).toFixed(2)}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Orders</h4>
          <h2>{data.total_orders}</h2>
        </div>

        <div className="stat-card">
          <h4>Avg Order Value</h4>
          <h2>${Number(data.avg_order_value).toFixed(2)}</h2>
        </div>

        <div className="stat-card">
          <h4>Active Staff</h4>
          <h2>{data.staff_count}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Order Status Overview</h3>

          {data.order_status.map((item, i) => (
            <div key={i} className="progress-row">
              <div className="progress-header">
                <span>{item.status}</span>
                <span>{item.count} orders</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.count * 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <h3>Revenue by Category</h3>

          {data.category_revenue.map((item, i) => (
            <div key={i} className="progress-row">
              <div className="progress-header">
                <span>{item.menu_item__category}</span>
                <span>${Number(item.total).toFixed(2)}</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill dark"
                  style={{ width: `${item.total}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <h3>Top Selling Items</h3>

          {data.top_items.map((item, i) => (
            <div key={i} className="list-item">
              <div className="lefts">
                <div className="rank">{i + 1}</div>

                <div className="item-info">
                  <p>{item.menu_item__name}</p>
                  <span>{item.total_sold} sold</span>
                </div>
              </div>

              <div className="price">${Number(item.revenue).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <h3>Staff Overview</h3>

          {data.staff.map((s, i) => (
            <div key={i} className="staff-item">
              <div className="staff-left">
                <div className="avatar">{s.employee_name?.charAt(0)}</div>

                <div>
                  <p>{s.employee_name}</p>
                  <span>{s.role}</span>
                </div>
              </div>

              <span className={`badge ${s.status}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="menu-performance">
        <h3>Menu Performance</h3>

        <div className="menu-grid">
          <div className="menu-card starters">
            <p>Starters</p>
            <h4>{data.menu_counts?.starters || 0} items</h4>
          </div>

          <div className="menu-card main">
            <p>Main Course</p>
            <h4>{data.menu_counts?.main || 0} items</h4>
          </div>

          <div className="menu-card desserts">
            <p>Desserts</p>
            <h4>{data.menu_counts?.desserts || 0} items</h4>
          </div>

          <div className="menu-card drinks">
            <p>Drinks</p>
            <h4>{data.menu_counts?.drinks || 0} items</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
