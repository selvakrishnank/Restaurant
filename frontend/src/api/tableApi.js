
export const getReservedTables = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/reserved/");
  return res.json();
};