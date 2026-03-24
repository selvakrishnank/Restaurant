import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import FoodCard from "../components/FoodCard/FoodCard";

import {
  getCart,
  addToCart,
  updateQuantity,
  removeCartItem
} from "../api/cartApi";

import "./CSS/Home.css";

export default function Home() {

  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("access");

  console.log(menu);


  // LOAD CART
  const loadCart = async () => {

    try {

      const data = await getCart(token);

      setCart(data.items || []);

    } catch (error) {

      console.error("Cart error:", error);

    }

  };


  // LOAD CART ON PAGE LOAD
  useEffect(() => {

    loadCart();

  }, []);



  // FETCH MENU FROM DJANGO
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



  // FIND ITEM IN CART
  const getCartItem = (menuId) => {

    const menuItem = menu.find(m => m.id === menuId);

    if (!menuItem) return null;

    return cart.find(c => c.name === menuItem.name);

  };



  // FILTER CATEGORY
  const categoryMap = {
    Starters: "Starters",
    "Main Course": "Main",
    Desserts: "Desserts",
    Drinks: "Drinks"
  };

  const filteredFoods =
    selectedCategory === "All"
      ? menu
      : menu.filter(
          food => food.category === categoryMap[selectedCategory]
        );



  // ADD TO CART
  const handleAdd = async (menuId) => {

    await addToCart(menuId, token);

    await loadCart();

  };



  // INCREASE QUANTITY
  const increase = async (item) => {

    await updateQuantity(item.id, item.quantity + 1, token);

    await loadCart();

  };



  // DECREASE QUANTITY
  const decrease = async (item) => {

    if (item.quantity === 1) {

      await removeCartItem(item.id, token);

    } else {

      await updateQuantity(item.id, item.quantity - 1, token);

    }

    await loadCart();

  };



  // REMOVE ITEM
  const removeItem = async (item) => {

    await removeCartItem(item.id, token);

    await loadCart();

  };



  // TOTAL CART ITEMS
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );



  // TOTAL CART PRICE
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
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

        {filteredFoods.map(food => {

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