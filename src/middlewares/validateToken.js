    const jwt = require("jsonwebtoken")

const authRequired = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null ;

    if (!token) return res.status(401).json({
        'message':"autorizacion denegada"
    })

    jwt.verify(token,'codigo secreto',(err,user)=>{
        if(err) return res.status(403).json({
            "error":"Invalid Token"
        })
        req.user = user
          next();
    })
   
}

module.exports = authRequired    