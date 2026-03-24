import "./CategoryTabs.css";

export default function CategoryTabs({ selectedCategory, setSelectedCategory }) {

  const categories = [
    { name: "Starters", icon: "🥗" },
    { name: "Main Course", icon: "🍽" },
    { name: "Desserts", icon: "🍰" },
    { name: "Drinks", icon: "🥤" }
  ];

  return (
    <div className="tabs">
      {categories.map(category => (
        <button
          key={category.name}
          className={selectedCategory === category.name ? "active" : ""}
          onClick={() => setSelectedCategory(category.name)}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  );
}