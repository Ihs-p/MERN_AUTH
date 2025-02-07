const jwt = require("jsonwebtoken");


const userAuth = async (req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false, message:"not authourized, please login again"});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.jwt_secret);
        if(decodedToken.id){
            req.body.userId = decodedToken.id;
        }else{
            return res.json({success:false, message:"not authourized, please login again"});
        }
        next();

    } catch (error) {
        res.json({success:false, message:error.message});
    }
}


module.exports = userAuth