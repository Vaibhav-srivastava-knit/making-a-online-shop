const prodmodol=require('../model/product_modol.js')
exports.getAddProduct=(req,res,next)=>     //'/x'means any url start with /x
{
    res.render('admin/add')
   // res.sendFile(path.join(rootdir,'view','add.html'))
   // res.send("<form action='/product' method='POST'><input type='text' name='title'></input><button type='submit'>submit</button></form>")
}
exports.postAddProduct=(req,res,next)=>{            // app.post will if request is post request meaning url+ request body no only url 
   const products= new prodmodol(req.body.title)     
   products.save();                 //get and post work for exact path not like use 
    res.redirect('/');
    }
   exports.getProduct=(req,res,next)=>
    {
     prodmodol.fetchAll(products=>{
          //   const produ =prodmodol.fetchAll();
         // console.log(produ)
          //   console.log("in an other midlleware")
            // res.sendFile(path.join(routdir,'view','user.html'))
         res.render('shop/user',{doctitle:'my shop',prod:products})
     })
    }
