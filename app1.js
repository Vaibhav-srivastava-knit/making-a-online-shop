const express = require('express');
const path = require('path')
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
const admin = require('./routes/admin.js');
const user = require('./routes/user.js');
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', admin.routes);//if app.use('/admin',admin) then only allow path which start with /admin
app.use(user);
app.set('view engine', 'ejs');
app.set('views', 'view');
const errorController=require('./controllers/404.js')
//code after that is in admin rout
/*app.use('/',(req,res,next)=>
{
    console.log('this applies to all page');
    next();
})*/
// app.use('/add',(req,res,next)=>     //'/x'means any url start with /x
// {
//     res.send("<form action='/product' method='POST'><input type='text' name='title'></input><button type='submit' >submit</button></form>")
// })
// app.post('/product',(req,res,next)=>{            // app.post will if request is post request meaning url+ request body no only url 
// console.log(req.body);                          //get and post work for exact path not like use 
// res.redirect('/');
// })
//code after that is in user routs
/*app.use('/',(req,res,next)=>
{
 //   console.log("in an other midlleware")
    res.send("<h1>hello</h1>")
})*/
app.use(errorController.error)
app.listen(3000);