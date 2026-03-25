const BASE_URL = "http://127.0.0.1:8000/api/cart";
const ORDER_URL = "http://127.0.0.1:8000/api/orders";


export const getCart = async () => {
  const token = localStorage.getItem("access");

  const res = await fetch(`${BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
};


export const addToCart = async (menuId) => {
  const token = localStorage.getItem("access");

  const res = await fetch(`${BASE_URL}/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      menu_item_id: menuId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add item");
  }

  return res.json();
};


export const removeCartItem = async (id) => {
  const token = localStorage.getItem("access");

  const res = await fetch(`${BASE_URL}/remove/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to remove item");
  }

  return res.json();
};


export const updateQuantity = async (id, quantity) => {
  const token = localStorage.getItem("access");

  const res = await fetch(`${BASE_URL}/update/${id}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    throw new Error("Failed to update quantity");
  }

  return res.json();
};


