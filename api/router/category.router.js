const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = require('@/middlewares/uploadImage');

const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('@/controllers/category.controller');

// GET all categories
router.get('/', getAllCategories);

// GET a specific category by ID
router.get('/:id', getCategoryById);

// CREATE a new category
router.post('/', upload.single('image'), createCategory);

// UPDATE a category by ID
router.put('/:id', upload.single('image'), updateCategory);

// DELETE a category by ID
router.delete('/:id', deleteCategory);

module.exports = router;