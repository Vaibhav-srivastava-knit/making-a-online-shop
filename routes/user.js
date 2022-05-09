const path=require('path')
const express=require('express');
const rout=express.Router();
//const routdir=require('../util/path')
//const admin=require('./admin');
const productsController=require('../controllers/products.js')
rout.get('/',productsController.getProduct)
module.exports=rout;
