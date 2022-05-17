const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // if(!req.session.isLoggedIn)
  // {
  //   return res.redirect('/login');
  // }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
<<<<<<< HEAD
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl= image.path;
=======
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
<<<<<<< HEAD
      const error=new Error(err);
      error.httpStatusCode = 500;
      return next(error);
=======
      console.log(err);
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
<<<<<<< HEAD
    .catch(err =>{
      const error=new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    } );
=======
    .catch(err => console.log(err));
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
<<<<<<< HEAD
  const image = req.file;
=======
  const updatedImageUrl = req.body.imageUrl;
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString()!==req.user._id.toString())
      return res.redirect('/')
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
<<<<<<< HEAD
      product.imageUrl = image.path;
=======
      product.imageUrl = updatedImageUrl;
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
      return product.save() .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
   
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
