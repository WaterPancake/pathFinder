const bcrypt = require('bcrypt')
const validator = require('validator')
const {db} = require('../firebase')


const userLogin = (req, res) =>{
    res.status(201).json({mssg:"login"})

}

const userSignup = async(req, res) =>{
    const {firstName,lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password){
        res.status(204).json({error: "All fields must be filled"})
    }

    if(!validator.isEmail(email)){
        res.status(204).json({error: "Invalid email"})
    }
    
    if(!validator.isPassword(password)){
        res.status(204).json({error: "Invalid passowrd"})
        
    }
    const userRef = db.collection('User_Accounts')

    const salt = bcrypt.genSalt(10,(err,salt)=>{
        if(err && !salt)
        {
            res.status(204).json({error: "Error signing"})
        }
        bcrypt.hash(password,salt,async (err, encrypted)=>{
            if(err && !encrypted)
            {
                const userRef = db.collection('User_Accounts')
                userObject ={firstName, lastName, email,password}
                userAccount = await userRef.add(userObject)
                res.status(200).json({mssg: "Account was created"})

            }
        })
        
    })
   

    res.status(202).json({mssg:"signup"})

}

module.exports = {userLogin, userSignup}