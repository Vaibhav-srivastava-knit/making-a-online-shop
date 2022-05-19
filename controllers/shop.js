const Product = require('../models/product');
const Order = require('../models/order');
const fs=require('fs');
const path=require('path');
const PDFDocument=require('pdfkit');
const stripe=require('stripe')('sk_test_51L0qyISFy3yZRgrOGjj112NyZAxeJjbEGshBeDSakiSGmmPfx6l0AIRvZEfpFyPjEAcnHJlWVUXFdm4v0DMml89h00AHhz7Qsk');
const { profileEnd } = require('console');
const ITEM_PER_PAGE=9;
exports.getProducts = (req, res, next) => {
  const page= +req.query.page||1;
  var total;
  Product.find().countDocuments().then(numProducts => {
    total=numProducts;
    return Product.find().skip((page-1)*ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
  }).then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'products',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE<total,
        hasPreviousPage: page>1,
        nextPage: page+1,
        prevPage: page-1,
        lastPage: Math.ceil(total/ITEM_PER_PAGE),
        path: '/products',
      
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
     // console.log(product.imageUrl.type);
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page= +req.query.page||1;
  var total;
  Product.find().countDocuments().then(numProducts => {
    total=numProducts;
    return Product.find().skip((page-1)*ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
  }).then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE<total,
        hasPreviousPage: page>1,
        nextPage: page+1,
        prevPage: page-1,
        lastPage: Math.ceil(total/ITEM_PER_PAGE),
        path: '/',
      
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      // console.log(user);
      const products = user.cart.items;
      //console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(prodId);
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req,res,next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: Math.floor(p.productId.price * 100),
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      // console.log(session);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      console.log(products);
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};
exports.getInvoiceOrder = (req, res, next)=>{
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order => {
    if(!order) 
    {
      return next(new Error('no user found'));
    }
    if(order.user.userId.toString()!==req.user._id.toString())
    {
      return next(new Error('Unautherised')); 
    }
    const invoiceName =  'invoice-'+orderId+'.pdf'
    const invoicePath=path.join('data','invoices', invoiceName)
    const pdfDoc=new PDFDocument();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"')
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text("Invoice",{
      underline: true
    });
     pdfDoc.text('------------------------------------------------------');
    var total =0;
    order.products.forEach(prod => {
      total+=prod.quantity*prod.product.price;
      pdfDoc.fontSize(14).text(prod.product.title +'-'+ prod.quantity+'-'+' x '+ '$ '+prod.product.price)
    });
     pdfDoc.text('total=$'+total)
    pdfDoc.end();
    // fs.readFile(invoicePath,(err,data) =>{
    //   if(err) 
    //   {
    //     return next(err)
    //   }
    //   res.setHeader('Content-Type','application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"')
    //  res.send(data);
    //  })
  // const file =fs.createReadStream(invoicePath);
   
  //    file.pipe(res);
  })
  .catch(err => next(err));
 
}
