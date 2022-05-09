const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult}=require('express-validator')
const { reset } = require('nodemon');
const user = require('../models/user');
const User = require('../models/user');
const mailSender = require('../util/email_sender').mailSender;
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null
  }
  console.log(message);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput:{
      email: '',
      password: ''
    },
    validationError:[]
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput:{
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationError: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors =validationResult(req);
  if(!errors.isEmpty()) {
    return res.render('auth/login',{
      path: '/login',
      pageTitle:'Login',
      errorMessage: errors.array()[0].msg,
      oldInput:{
         email:email,
         password:password
      } ,
      validationError: errors.array()
    })
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
       // req.flash('error', 'Invalid username or password')
        return res.render('auth/login',{
          path: '/login',
          pageTitle:'Login',
          errorMessage: 'Invalid username or password',
          oldInput:{
             email:email,
             password:password
          } ,
          validationError: []
        })
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.render('auth/login',{
            path: '/login',
            pageTitle:'Login',
            errorMessage: 'Invalid username or password',
            oldInput:{
               email:email,
               password:password
            } ,
            validationError: []
          })
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors=validationResult(req);
  //console.log(errors.array());
  if(!errors.isEmpty())
  {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationError: errors.array()
    })
  }
   bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          mailSender(email, '<h1>congraz u have been signed in <h1>');
          res.redirect('/login');
        }).catch(err => {
          console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}
exports.postReset= (req, res, next) => {
  crypto.randomBytes(12,(err,buffer)=>{
    if(err) 
    {
      console.log('something here')
      console.log(err);
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email})
    .then(user => {
      if(!user){
        console.log('error here');
        req.flash('error','no such account exists')
        return res.redirect('/reset')
      }
      user.resetToken=token
      user.resetTokenExpiration=Date.now()+3600000;
      return user.save();
    }
    )
    .then(result=>{
      res.redirect('/');
      mailSender(req.body.email,
     ` <p>
        reset your password
      </p>
      <p>
    <a href="http://localhost:3000/reset/${token}">  click here to reset your password </a>
      </p>`);
    });
  }) 
}
exports.getNewPassword = (req,res, next)=>{
  const token = req.params.token;
  User.findOne({resetToken:token ,resetTokenExpiration:{$gt:Date.now()}})
  .then(user=>{
   // console.log(user);
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    }
    else {
      message = null
    }
    console.log(Date.now());
    console.log(user);
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken:token
    })
  })
  .catch(err=>console.error(err));
}
exports.PostNewPassword = (req, res, next)=>{
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  const userId = req.body.userId;
  let resetUser;
  User.findOne({
    resetToken:passwordToken,
    resetTokenExpiration:{$gt:Date.now()},
    _id:userId
  })
  .then(user =>{
      resetUser=user  
      return bcrypt.hash(newPassword,12)     
  })
  .then(hashedPassword =>{
   resetUser.password=hashedPassword
   resetUser.resetToken=undefined
   resetUser.resetTokenExpiration=undefined
  return resetUser.save()
  })
  .then((result) =>{
    res.redirect('/login')
  })
  .catch(err => {console.error(err);})
}
