import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import CartPage from "./Pages/CartPage";
import Reservation from "./Pages/Reservation";
import ReservationSuccess from "./Pages/ReservationSuccess";
import KitchenDisplay from "./Pages/KitchenDisplay";
import WaiterDashboard from "./Pages/WaiterDashboard";
import OwnerDashboard from "./Pages/OwnerDashboard";   // ✅ Added
import ManagerDashboard from "./Pages/ManagerDashboard"; // ✅ Added
import OrderSuccess from "./Pages/OrderSuccess";
import OrderTracking from "./Pages/OrderTracking";
import ShiftManagement from "./Pages/ShiftManagement";
import FloorPlanManager from "./Pages/FloorPlanManager";
import InventoryManager from "./Pages/InventoryManager";
import CateringServices from "./Pages/CateringServices";

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Signin Page (Default Page) */}
        <Route path="/" element={<Signin />} />

        {/* 📝 Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* 🏠 Customer Home */}
        <Route
          path="/home"
          element={<Home cart={cart} setCart={setCart} />}
        />

        {/* 🛒 Cart */}
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />

        {/* 👨‍🍳 Kitchen Display (Chef) */}
        <Route path="/kitchen" element={<KitchenDisplay />} />

        {/* 🧑‍💼 Manager Dashboard */}
        <Route path="/manager" element={<ManagerDashboard />} />

        {/* 🍽 Waiter Dashboard */}
        <Route path="/waiter" element={<WaiterDashboard />} />

        {/* 👑 Owner Dashboard */}
        <Route path="/owner" element={<OwnerDashboard />} />

        {/* 📅 Reservation */}
        <Route path="/reserve" element={<Reservation />} />

        {/* ✅ Reservation Success */}
        <Route
          path="/reservation-success"
          element={<ReservationSuccess />}
        />

        {/* ✅ Order Success */}
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* ✅ OrderTracking */}
        <Route path="/order-tracking" element={<OrderTracking />} />
          
         {/* ✅ Shifts */}
        <Route path="/shifts" element={<ShiftManagement />} />

        {/* ✅ Floor */}
        <Route path="/floor" element={<FloorPlanManager />} />

        {/* ✅ Inventory */}
        <Route path="/inventory" element={<InventoryManager />} />

        {/* ✅ CateringServices */}
        <Route path="/catering" element={<CateringServices />} />

       

        {/* ❌ 404 Page */}
        <Route
          path="*"
          element={<h2 style={{ textAlign: "center" }}>Page Not Found</h2>}
        />

      </Routes>
    </BrowserRouter>
  );
}