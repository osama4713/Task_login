
const express = require("express");
const Login = require("../models/login");
const auth = require("../middleware/auth")

const router = express.Router();

// ****************************************************** 
// registration + Token

router.post('/users' , async (req , res) => {
    try{
        const user = new Login(req.body)
        const token = await user.generateToken()
        
        await user.save()
        res.status(200).send({ user , token})

    }catch(e){
        res.status(200).send(e.message)
    }
})

// ********************************************************

// Login

router.post('/login' , auth , async (req , res) =>{
    try{

        const user = await Login.findByCredentials(req.body.Email , req.body.Password)
        const token = await user.generateToken()
        res.status(200).send({ user , token})

    }catch(e){
        res.status(400).send(e.message)
    }
})

// **********************************************************************************************************

module.exports = router;
