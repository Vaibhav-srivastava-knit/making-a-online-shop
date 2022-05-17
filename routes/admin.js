<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth=require('../middleware/is-auth')

const router = express.Router();

// // /admin/add-product => GET
router.get('/add-product',isAuth,adminController.getAddProduct);

// // // /admin/products => GET
router.get('/products',isAuth ,adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',isAuth, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
<<<<<<< HEAD
=======
=======
const express=require('express');
const path=require('path');
const router=express.Router();
const productsController=require('../controllers/products.js')

//const rootdir=require('../util/path')

router.get('/add',productsController.getAddProduct);
router.post('/product',productsController.postAddProduct)
exports.routes = router;
>>>>>>> 15adfbc6063721a2d5c5f399e90d42c2f1883228
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
