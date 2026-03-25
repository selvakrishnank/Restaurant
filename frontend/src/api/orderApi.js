export const placeOrder = async (data, token) => {

  const res = await fetch(
    "http://127.0.0.1:8000/api/orders/place-order/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );

  return res.json();
};

export const getCurrentOrder = async (token) => {

  const res = await fetch(
    "http://127.0.0.1:8000/api/orders/current/",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json();
};

export const getOrderHistory = async (token) => {

  const res = await fetch(
    "http://127.0.0.1:8000/api/orders/history/",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json();
};


export const getReadyOrders = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/orders/ready/");
  return res.json();
};


export const getPaymentOrders = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/orders/payment/");
  return res.json();
};


export const completePayment = async (id) => {
  await fetch(`http://127.0.0.1:8000/api/orders/${id}/complete-payment/`, {
    method: "PATCH"
  });
};

export const updateOrderStatus = async (id, status) => {

  await fetch(`http://127.0.0.1:8000/api/orders/${id}/status/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

};

export const getActiveTables = async () => {

  const res = await fetch(
    "http://127.0.0.1:8000/api/orders/active-tables/"
  );

  return res.json();
};