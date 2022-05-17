const express = require('express');
const { check,body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user')
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', [check('email').isEmail().withMessage('please enter valid email')
.custom((value,{req})=>{
    return User.findOne({ email: value })
    .then(userDoc => {
      if (userDoc) {
        return Promise.reject('Email already exists');
      }
})
})
    ,body('password', 'please enter password with more than 5 characters')
    .isLength({ min: 5 }), 
    body('confirmPassword').custom((value,{req})=>{
        if(value!==req.body.password)
        {
            throw new Error('confirm password not matching password')
        }
        return true;
    })
  ]  , authController.postSignup);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.PostNewPassword)
module.exports = router;