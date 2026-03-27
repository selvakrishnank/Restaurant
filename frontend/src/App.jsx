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
import OwnerDashboard from "./Pages/OwnerDashboard";   
import ManagerDashboard from "./Pages/ManagerDashboard";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderTracking from "./Pages/OrderTracking";
import ShiftManagement from "./Pages/ShiftManagement";
import FloorPlanManager from "./Pages/FloorPlanManager";
import InventoryManager from "./Pages/InventoryManager";
import CateringServices from "./Pages/CateringServices";
import SplitBillPage from "./Pages/SplitBillPage";
import ReservedTablesPage from "./Pages/ReservedTablesPage";

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signin />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home cart={cart} setCart={setCart} />}/>

        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />}/>

        <Route path="/kitchen" element={<KitchenDisplay />} />

        <Route path="/manager" element={<ManagerDashboard />} />

        <Route path="/waiter" element={<WaiterDashboard />} />

        <Route path="/owner" element={<OwnerDashboard />} />

        <Route path="/reserve" element={<Reservation />} />

        <Route path="/reservation-success" element={<ReservationSuccess />}/>

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/order-tracking" element={<OrderTracking />} />
          
        <Route path="/shifts" element={<ShiftManagement />} />

        <Route path="/floor" element={<FloorPlanManager />} />

        <Route path="/inventory" element={<InventoryManager />} />

        <Route path="/catering" element={<CateringServices />} />

        <Route path="/splitbill" element={<SplitBillPage />} />

        <Route path="/reservedtables" element={<ReservedTablesPage />} />


        <Route path="*" element={<h2 style={{ textAlign: "center" }}>Page Not Found</h2>}
        />

      </Routes>
    </BrowserRouter>
  );
}