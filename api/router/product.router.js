const express = require('express');
const router = express.Router();
const upload = require('@/middlewares/uploadImage');

const { getAllProducts, getProductById, createProduct, deleteProduct, updateProduct, getProductsByCategory } = require('@/controllers/product.controller');

// GET products by category
router.get('/category/:category_id', getProductsByCategory);

// GET all products
router.get('/', getAllProducts);

// GET a specific product by ID
router.get('/:id', getProductById);

// CREATE a new product
router.post('/', upload.single('image'), createProduct);

// UPDATE a product by ID
router.put('/:id', upload.single('image'), updateProduct);

// DELETE a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;