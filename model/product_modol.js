const { json } = require('body-parser');
const fs=require('fs');
const path=require('path');
const p=path.join(path.dirname(require.main.filename),'data','product.json')
let product=[];
module.exports = class prd
{
   
  constructor(t)
  {
      this.title=t;
  }
  save()
  {
      fs.readFile(p,(err,data)=>
      {
        if(!err){
          console.log('err')
            product=JSON.parse(data);
          }
          product.push(this)
          fs.writeFile(p,JSON.stringify(product),(err)=>
           console.log(err))

      });
  
  }
  static fetchAll(cb){
      fs.readFile(p,(err,data)=>{
        if(err)
        cb([]);
        cb(JSON.parse(data))
      })
  }
}