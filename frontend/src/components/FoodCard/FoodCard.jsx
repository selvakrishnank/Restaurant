import "./FoodCard.css";

export default function FoodCard({
  food,
  cartItem,
  addToCart,
  increase,
  decrease,
  removeItem,
}) {
  return (
    <div className="food-card">
      <div className="food-image-container">
        <img src={food.image} alt={food.name} />

        <span className="prices">${Number(food.price || 0).toFixed(2)}</span>
      </div>

      <div className="food-info">
        <h3>{food.name}</h3>
        <p>{food.description}</p>

        {cartItem ? (
          <div className="cart-actions">
            <div className="quantity-controls">
              <button onClick={decrease}>−</button>
              <span>{cartItem.quantity}</span>
              <button onClick={increase}>+</button>
            </div>

            <button className="remove-btn" onClick={removeItem}>
              Remove
            </button>
          </div>
        ) : (
          <button className="add-btns" onClick={addToCart}>
            + Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
