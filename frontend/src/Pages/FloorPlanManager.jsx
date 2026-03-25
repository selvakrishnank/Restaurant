import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./CSS/FloorPlanManager.css";

export default function FloorPlanManager() {
  const [tables, setTables] = useState([]);
  const [zone, setZone] = useState("all");
  const navigate = useNavigate();

  const loadTables = async () => {
    let url = "http://127.0.0.1:8000/api/tables/";

    if (zone !== "all") {
      url += `?zone=${zone}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      setTables(data);
    } catch (error) {
      console.log("Error loading tables", error);
    }
  };

  useEffect(() => {
    loadTables();
  }, [zone]);

  const changeStatus = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/tables/update/${id}/`, {
      method: "PATCH",
    });

    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === id) {
          let newStatus = "available";

          if (table.status === "available") newStatus = "occupied";
          else if (table.status === "occupied") newStatus = "reserved";
          else newStatus = "available";

          return { ...table, status: newStatus };
        }

        return table;
      }),
    );
  };

  const total = tables.length;
  const available = tables.filter((t) => t.status === "available").length;
  const occupied = tables.filter((t) => t.status === "occupied").length;
  const reserved = tables.filter((t) => t.status === "reserved").length;

  return (
    <div className="floor-page">
      <div className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft className="back-icon" />
        <span>Back</span>
      </div>

      <h2>Floor Plan Manager</h2>

      <p className="subtitle">Visual table layout and status management</p>

      <div className="stats">
        <div className="card black">
          <h3>{total}</h3>
          <p>Total Tables</p>
        </div>

        <div className="card green">
          <h3>{available}</h3>
          <p>Available</p>
        </div>

        <div className="card red">
          <h3>{occupied}</h3>
          <p>Occupied</p>
        </div>

        <div className="card yellow">
          <h3>{reserved}</h3>
          <p>Reserved</p>
        </div>
      </div>

      <div className="zones">
        <button
          className={zone === "all" ? "active" : ""}
          onClick={() => setZone("all")}
        >
          All Areas
        </button>

        <button
          className={zone === "indoor" ? "active" : ""}
          onClick={() => setZone("indoor")}
        >
          Indoor
        </button>

        <button
          className={zone === "outdoor" ? "active" : ""}
          onClick={() => setZone("outdoor")}
        >
          Outdoor
        </button>

        <button
          className={zone === "bar" ? "active" : ""}
          onClick={() => setZone("bar")}
        >
          Bar
        </button>
      </div>

      <div className="floor-layout">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table ${table.status}`}
            onClick={() => changeStatus(table.id)}
          >
            <h4>{table.name}</h4>

            <p>{table.seats} 👥</p>

            <span>{table.zone}</span>
          </div>
        ))}
      </div>

      <div className="legend-container">
        <h3 className="legend-title">Legend</h3>

        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-box green"></div>

            <div>
              <p className="legend-name">Available</p>
              <p className="legend-desc">Ready for seating</p>
            </div>
          </div>

          <div className="legend-item">
            <div className="legend-box red"></div>

            <div>
              <p className="legend-name">Occupied</p>
              <p className="legend-desc">Customers dining</p>
            </div>
          </div>

          <div className="legend-item">
            <div className="legend-box yellow"></div>

            <div>
              <p className="legend-name">Reserved</p>
              <p className="legend-desc">Booking confirmed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
