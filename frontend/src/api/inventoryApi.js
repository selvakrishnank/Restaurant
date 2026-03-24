const API = "http://127.0.0.1:8000/api";

export const getInventory = async () => {

  const res = await fetch(`${API}/inventory/`);

  return res.json();

};

export const addInventory = async (data) => {

  const res = await fetch(`${API}/inventory/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateStock = async (id, change) => {

  const res = await fetch(`${API}/inventory/update/${id}/`, {

    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      change: change
    })

  });

  return res.json();
};