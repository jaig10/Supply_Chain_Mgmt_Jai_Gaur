// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productHandler = require('../handlers/productHandler');

// Routes to handle product lifecycle
router.post('/addProduct', productHandler.registerNewProduct);
router.post('/receiveProduct', productHandler.receiveProduct);
router.post('/wholesaleProduct', productHandler.wholesaleProductHandler);
router.get('/productDetails/:productID', productHandler.fetchProductDetails);
router.post('/markProductSold', productHandler.markProductAsSold);

module.exports = router;
