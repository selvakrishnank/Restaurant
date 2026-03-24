
export const getDashboardStats = async () => {

  const res = await fetch("http://127.0.0.1:8000/api/manager/stats/");
  return res.json();

};

export const getRecentOrders = async () => {

  const res = await fetch("http://127.0.0.1:8000/api/manager/recent-orders/");
  return res.json();

};

export const getMenuItems = async () => {

  const res = await fetch("http://127.0.0.1:8000/api/manager/menu/");
  return res.json();

};

export const toggleMenuItem = async (id) => {

  await fetch(`http://127.0.0.1:8000/api/manager/menu/${id}/toggle/`, {
    method: "PATCH",
  });

};

export const deleteMenuItem = async (id) => {

  await fetch(`http://127.0.0.1:8000/api/manager/menu/${id}/delete/`, {
    method: "DELETE",
  });

};

export const updateMenuItem = async (id, data) => {

  const res = await fetch(`http://127.0.0.1:8000/api/manager/menu/update/${id}/`, {

    method: "PATCH",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)

  });

  return res.json();

};

export const createMenuItem = async (data) => {

  const response = await fetch("http://127.0.0.1:8000/api/manager/menu/create/", {
    method: "POST",
    body: data
  });

  if (!response.ok) {
    throw new Error("Failed to create item");
  }

  return response.json();
};