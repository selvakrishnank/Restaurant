const API = "http://127.0.0.1:8000/api";

// ✅ GET ORDERS
export const getOrders = async () => {
  const res = await fetch(`${API}/catering/`);

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};


// ✅ CREATE ORDER (FIXED URL)
export const createOrder = async (data) => {
  const res = await fetch(`${API}/catering/`, {   // 🔥 FIX HERE (removed /create/)
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create order");
  }

  return res.json();
};


// ✅ CONFIRM ORDER
export const confirmOrder = async (id) => {
  const res = await fetch(`${API}/catering/${id}/confirm/`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to confirm order");
  }

  return res.json();
};


// ✅ CANCEL ORDER
export const cancelOrder = async (id) => {
  const res = await fetch(`${API}/catering/${id}/cancel/`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to cancel order");
  }

  return res.json();
};

export const startPrep = async (id) => {
  await fetch(`${API}/catering/${id}/start/`, {
    method: "PATCH",
  });
};

export const completeOrder = async (id) => {
  await fetch(`${API}/catering/${id}/complete/`, {
    method: "PATCH",
  });
};