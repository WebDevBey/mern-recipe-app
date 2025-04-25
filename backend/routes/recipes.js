import express from "express";
import Recipe from "../models/Recipe.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create recipe
router.post("/", protect, async (req, res) => {
  const { title, ingredients, instructions, category, photoUrl, cookingTime } =
    req.body;

  try {
    if (
      !title ||
      !ingredients ||
      !instructions ||
      !category ||
      !photoUrl ||
      !cookingTime
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      category,
      cookingTime,
      photoUrl,
      createdBy: req.user._id,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get recipes
router.get("/", async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category } : {};
    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a recipe
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a recipe
router.put("/:id", protect, async (req, res) => {
  const { title, ingredients, instructions, category, photoUrl, cookingTime } =
    req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.category = category || recipe.category;
    recipe.photoUrl = photoUrl || recipe.photoUrl;
    recipe.cookingTime = cookingTime || recipe.cookingTime;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a recipe
router.delete("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
