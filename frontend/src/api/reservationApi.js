
export const getReservedTables = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/reservations/reserved/");
  return res.json();
};

export const cancelReservation = async (id) => {
  await fetch(`http://127.0.0.1:8000/api/reservations/cancel/${id}/`, {
    method: "DELETE",
  });
};