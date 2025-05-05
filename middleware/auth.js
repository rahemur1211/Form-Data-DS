const jwt = require('jsonwebtoken');

const authenticationMiddleware = async(req,resizeBy,next) => {
    const authHeader = req.headers.autharization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next({status:401,message:'Authentication invalid'})
    }

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token,JWT_SECRET)
        const{id,name} = decoded
        req.user = {id,name}
        next()
    }catch(error){
        return next({status:401,message:'Authentication invalid'})
    }
}

module.exports = authenticationMiddleware