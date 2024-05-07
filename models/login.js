const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const LoginSchema = mongoose.Schema({
    Fname : {
        type : String,
        required : true,
        trim : true
    },
    Lname : {
        type : String,
        required : true,
        trim : true
    },
    Email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true,
        validate(val) {
            if(!validator.isEmail(val)){
                throw new Error("This Email is incorrect")
            }
        }
    },
    Password : {
       type : String,
        required : true,
        trim : true,
        minlength : 8
    },
    tokens : [
        {
            type : String,
            required : true,
            trim : true
        }
    ]

})

// *************************************************************

LoginSchema.pre("save" , async function(){
    if(this.isModified('Password')){
        this.Password = await bcryptjs.hash(this.Password , 8)
    }
})

// *************************************************************

LoginSchema.methods.generateToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user.id.toString()} , "osama123");
    user.tokens = user.tokens.concat(token);
    await user.save();
    return token;
}

// **************************************************************

LoginSchema.statics.findByCredentials = async (email , Pass) => {
    const user = await Login.findOne({Email:email});
    if(!user){
        throw new Error ("Unable To Login")
    }

    const Check_Password = await bcryptjs.compare(Pass , user.Password)
    if(!Check_Password){
        throw new Error ("Unable To Login")
    }

    return user
}

// **************************************************************
// hide private data

LoginSchema.methods.toJSON = function (){
    const user = this
    
    const userObject = user.toObject()

    delete userObject.Password
    delete userObject.tokens

    return userObject
} 

// ****************************************************************

const Login = mongoose.model('Login' , LoginSchema)

module.exports = Login
