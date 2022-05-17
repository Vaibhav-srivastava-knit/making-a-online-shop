const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const multer=require('multer');
const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose=require('mongoose');
const csrf= require('csurf');
const app = express();
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI='mongodb+srv://vibhu:hsLZ12WK68BG8CiI@cluster0.fmro2.mongodb.net/myFirstDatabase'
const store =new MongoDBStore({
  uri:MONGODB_URI,
  collection:'session' 
})
app.set('view engine', 'ejs');
app.set('views', 'views');
const csrfProtection = csrf();
const fileStorage=multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, 'images');
  },
   filename: (req,file,cb) => {
    // let temp=new Date().toISOString();
    cb(null, file.filename +'-'+file.originalname);
   }
})
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
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
// app.use('/500',errorController.get500)
app.use(errorController.get404);
// app.use((error,req,res,next) => {
//   res.redirect('/500');
// })
mongoose.connect("mongodb+srv://vibhu:hsLZ12WK68BG8CiI@cluster0.fmro2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(results=>{  
    //console.log(results);
  app.listen(3000);
}
)
