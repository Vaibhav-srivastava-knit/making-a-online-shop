const express=require('express');
const path=require('path');
const router=express.Router();
const productsController=require('../controllers/products.js')

//const rootdir=require('../util/path')

router.get('/add',productsController.getAddProduct);
router.post('/product',productsController.postAddProduct)
exports.routes = router;
