import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
    };
    fetchRecipe();
  }, [id]);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/recipes/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {recipe.photoUrl && (
        <img
          src={recipe.photoUrl}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="capitalize text-3xl font-bold mb-4">{recipe.title}</h1>
      <p className="text-gray-600 mb-4">Category: {recipe.category}</p>
      <p className="text-gray-600 mb-4">
        Cooking time: {recipe.cookingTime} minutes
      </p>
      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="pl-6 mb-4 list-disc">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <p className="text-gray-700 mb-4">{recipe.instructions}</p>
      {user && user._id === recipe.createdBy && (
        <div className="flex space-x-4">
          <Link to={`/edit-recipe/${id}`}>
            <button className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
              Edit
            </button>
          </Link>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
