const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose=require('mongoose');
const csrf= require('csurf');
const app = express();
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI='your mongo db connection string'
const store =new MongoDBStore({
  uri:MONGODB_URI,
  collection:'session' 
})
app.set('view engine', 'ejs');
app.set('views', 'views');
const csrfProtection = csrf();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use(errorController.get404);

mongoose.connect("mongodb+srv://vibhu:hsLZ12WK68BG8CiI@cluster0.fmro2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(results=>{  
    //console.log(results);
  app.listen(3000);
}
)
