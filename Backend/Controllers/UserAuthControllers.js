const bcrypt = require('bcrypt')
const validator = require('validator')
const {db} = require('../firebase')

const checkIsEmailInUse = async(email, checkAndRetrieve = false) =>{
    console.log(email)
    const userRef = db.collection('User_Accounts')
   try {
        const querySnapshot = await userRef.where('email', '==', email).get();
        if(querySnapshot._size === 0){
            return (false);
        }
        else{
            return (checkAndRetrieve ? {isInUse:true, Document:querySnapshot} : true);
        }
        
   } catch (error) {
    throw(error);
    
   }
}

const userLogin = async (req, res) =>{
    const {email, password } = req.body;

    if(!email || !password){
        return res.status(204).json({error: "All fields must be filled"});
    }
    if(!validator.isEmail(email)){
        return res.status(204).json({error: "Invalid email"});
    }
    const isEmailInUse = await checkIsEmailInUse(email, true)

    if(!isEmailInUse.isInUse)
    {
        return res.status(409).json({error:"Incorrect email or password"})
    }
    console.log(isEmailInUse.Document.docs[0].get('password'))
    
    const match = await bcrypt.compare(password,isEmailInUse.Document.docs[0].get('password'))

    if(!match){
        return res.status(409).json({error:"Incorrect password"})
    }

    return res.status(200).json({mssg: "Successfull Login"})

}

const userSignup = async(req, res) =>{ 
    console.log("called")
    const userRef = db.collection('User_Accounts')

    const {firstName,lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password){
        return res.status(204).json({error: "All fields must be filled"});
    }
    if(!validator.isEmail(email)){
        return res.status(204).json({error: "Invalid email"});
    }
    const isEmailInUse = await checkIsEmailInUse(email)

    if(isEmailInUse === true)
    {
        return res.status(409).json({ error: "Email is in use" });
    }
    
    if(!validator.isStrongPassword(password)){
        return res.status(204).json({error: "Invalid passowrd"});
        
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const userObject = { firstName, lastName, email, password: hash };
        const userAccount = await userRef.add(userObject);
        return res.status(201).json({ mssg: "Account was created", userAccount });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }

}

module.exports = {userLogin, userSignup}