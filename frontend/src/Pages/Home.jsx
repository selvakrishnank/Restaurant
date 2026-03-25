import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import FoodCard from "../components/FoodCard/FoodCard";

import {
  getCart,
  addToCart,
  updateQuantity,
  removeCartItem,
} from "../api/cartApi";

import "./CSS/Home.css";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("access");

  console.log(menu);

  const loadCart = async () => {
    try {
      const data = await getCart(token);

      setCart(data.items || []);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/menu/");
        const data = await res.json();

        setMenu(data);
      } catch (error) {
        console.error("Menu fetch error:", error);
      }
    };

    fetchMenu();
  }, []);

  const getCartItem = (menuId) => {
    const menuItem = menu.find((m) => m.id === menuId);

    if (!menuItem) return null;

    return cart.find((c) => c.name === menuItem.name);
  };

  const categoryMap = {
    Starters: "Starters",
    "Main Course": "Main",
    Desserts: "Desserts",
    Drinks: "Drinks",
  };

  const filteredFoods =
    selectedCategory === "All"
      ? menu
      : menu.filter((food) => food.category === categoryMap[selectedCategory]);

  const handleAdd = async (menuId) => {
    await addToCart(menuId, token);

    await loadCart();
  };

  const increase = async (item) => {
    await updateQuantity(item.id, item.quantity + 1, token);

    await loadCart();
  };

  const decrease = async (item) => {
    if (item.quantity === 1) {
      await removeCartItem(item.id, token);
    } else {
      await updateQuantity(item.id, item.quantity - 1, token);
    }

    await loadCart();
  };

  const removeItem = async (item) => {
    await removeCartItem(item.id, token);

    await loadCart();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  console.log("Cart:", cart);

  return (
    <div className="page">
      <Header totalItems={totalItems} />

      <CategoryTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="food-grid">
        {filteredFoods.map((food) => {
          const cartItem = getCartItem(food.id);

          return (
            <FoodCard
              key={food.id}
              food={food}
              cartItem={cartItem}
              addToCart={() => handleAdd(food.id)}
              increase={() => cartItem && increase(cartItem)}
              decrease={() => cartItem && decrease(cartItem)}
              removeItem={() => cartItem && removeItem(cartItem)}
            />
          );
        })}
      </div>
    </div>
  );
}
