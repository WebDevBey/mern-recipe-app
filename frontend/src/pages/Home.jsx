import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await axios.get(
        `/api/recipes/${
          category && category !== "All" ? `?category=${category}` : ""
        }`
      );
      console.log(res.data);
      setRecipes(res.data);
    };
    fetchRecipes();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap gap-2 mt-2 mb-4">
        {categories.map((cat) => (
          <button
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              category === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            key={cat}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe._id}`}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg duration-300 cursor-pointer"
            key={recipe._id}
          >
            {recipe.photoUrl && (
              <img
                src={recipe.photoUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold capitalize">
                {recipe.title}
              </h2>
              <p className="text-gray-600">{recipe.category}</p>
              <p className="text-gray-600">{recipe.cookingTime} minutes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
