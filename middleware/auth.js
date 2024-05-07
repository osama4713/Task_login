const jwt = require('jsonwebtoken')
const Login = require('../models/login')

const auth = async (req , res , next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decode = jwt.verify(token , "osama123");
        const user = await Login.findOne({_id:decode._id,tokens:token});

        if(!user){
            throw new Error('Not Found Token')
        }

        req.user = user
        req.token = token
        next()

    }catch(e){
        res.status(401).send({error:'Please authenticate'})
    }
}

module.exports = auth;