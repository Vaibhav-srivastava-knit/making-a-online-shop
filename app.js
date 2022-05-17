const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
<<<<<<< HEAD
const multer=require('multer');
=======
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose=require('mongoose');
const csrf= require('csurf');
const app = express();
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
<<<<<<< HEAD
const MONGODB_URI='mongodb+srv://vibhu:hsLZ12WK68BG8CiI@cluster0.fmro2.mongodb.net/myFirstDatabase'
=======
const MONGODB_URI='your mongo db connection string'
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
const store =new MongoDBStore({
  uri:MONGODB_URI,
  collection:'session' 
})
app.set('view engine', 'ejs');
app.set('views', 'views');
const csrfProtection = csrf();
<<<<<<< HEAD
const fileStorage=multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'images');
  },
   filename: (req,file,cb) => {
    // let temp=new Date().toISOString();
    cb(null, file.filename +'-'+file.originalname);
   }
})
=======
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
<<<<<<< HEAD
app.use(multer({storage:fileStorage}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
=======
app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
app.use(session({secret: 'my session',resave: false,saveUninitialized:false,store:store}));
app.use(flash());
app.use(csrfProtection)
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user)
      {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err =>{
      throw new Error(err);
    });
});
app.use((req, res, next) => {
        res.locals.isAuthenticated= req.session.isLoggedIn;
        res.locals.csrfToken= req.csrfToken();
        next();
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
<<<<<<< HEAD
// app.use('/500',errorController.get500)
app.use(errorController.get404);
// app.use((error,req,res,next) => {
//   res.redirect('/500');
// })
mongoose.connect("mongodb+srv://vibhu:hsLZ12WK68BG8CiI@cluster0.fmro2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
=======
app.use(errorController.get404);

mongoose.connect("your mongo db connection string")
>>>>>>> cea3c21f6f982b69ad0e1486989d2b27ffe2df08
.then(results=>{  
    //console.log(results);
  app.listen(3000);
}
)
