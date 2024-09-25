var jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    
  try{
     let token = req.headers.authorization.split(" ")[1]
      var decoded = jwt.verify(token, 'cool');
      console.log(decoded)
      if(decoded){
          req.body.userId = decoded.userId;
          next()
      }else{
          res.json({msg:"Please login again..."})
      }
  }catch(err){
    console.log(err)
    res.json({msg:"Something went wrong, please login again"})
  }

}

module.exports = authMiddleware