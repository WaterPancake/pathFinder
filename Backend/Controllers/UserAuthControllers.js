const bcrypt = require('bcrypt')
const validator = require('validator')
const {db} = require('../firebase')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const checkIsEmailInUse = async(email, checkAndRetrieve = false) =>{
    // console.log(email)
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

const createtoken = async (_id,firstName) =>{
    console.log("createtoken: ",_id, firstName, process.env.SECRET);
    
    return  jwt.sign({_id, firstName}, process.env.SECRET, { expiresIn: '10h' })
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

    if(!isEmailInUse.isInUse){
        return res.status(409).json({error:"Incorrect email or password"})
    }
    console.log(isEmailInUse.Document.docs[0].get('password'))
     
    const match = await bcrypt.compare(password,isEmailInUse.Document.docs[0].get('password'))

    if(!match){
        return res.status(409).json({error:"Incorrect password"})
    }
    const returnJWT = await createtoken(password,isEmailInUse.Document.docs[0].id,isEmailInUse.Document.docs[0].firstName)
    console.log("isEmailInUse.Document.docs[0].id: ",isEmailInUse.Document.docs[0].id)
    return res.status(200).json({mssg: "Successfull Login", returnJWT})

}

const userSignup = async(req, res) =>{ 
    console.log("called")
    const userRef = db.collection('User_Accounts')
    
    const {firstName,lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({error: "All fields must be filled"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: "Invalid email"});
    }
    const isEmailInUse = await checkIsEmailInUse(email)
    
    if(isEmailInUse === true){
        return res.status(400).json({ error: "Email is in use" });
    }

    if(!validator.isStrongPassword(password)){
        console.log("Here PAss")
        return res.status(400).json({error: "Invalid password"});
        
    }
    const userObject = { firstName, lastName, email};
    const userAccount = await userRef.add(userObject);
    const userAccountSnapshop = await userAccount.get()

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log("userAccountSnapshop.id ",userAccountSnapshop.id);
        userAccount.update({password:hash});
        const returnJWT = await createtoken(userAccountSnapshop.id,firstName);
        console.log("DId not fail")
        return res.status(201).json({ mssg: "Account was created", userAccount, returnJWT});
    } catch (error) {
        if(userAccountSnapshop && userAccountSnapshop.exists) {
            await userAccountSnapshop.ref.delete();
        }
        return res.status(500).json({ error: "Internal server error" });
    }
    

}

module.exports = {userLogin, userSignup}
// try {
    //     const salt = await bcrypt.genSalt(10);
    //     const hash = await bcrypt.hash(password, salt);
    //     const userObject = { firstName, lastName, email, password: hash };
    //     const userAccount = await userRef.add(userObject);
    //     const userAccountSnapshop = await userAccount.get()
    //     console.log("userAccountSnapshop.id ",userAccountSnapshop.id);
    //     const returnJWT = await createtoken(userAccountSnapshop.id,firstName)
    //     return res.status(201).json({ mssg: "Account was created", userAccount});
    // } catch (error) {
    //     if(userAccountSnapshop && userAccountSnapshop.exists) {
    //         await userAccountSnapshop.ref.delete();
    //     }
    //     return res.status(500).json({ error: "Internal server error" });
    // }