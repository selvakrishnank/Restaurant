
export const getDashboard = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/dashboard/");
  return res.json();
};