const express = require('express')
const { db } = require('./firebase')
const app = express()
const cors = require('cors')



const userRoutes = require('./Routes/UserAuthRoutes')

app.use(express.json())
app.use(cors({
    origin: '*'
}));

app.listen(8000,()=>{
    console.log("Begining to listen on port: 8000") 
})
app.use(userRoutes) 
app.post('/set-user',async(req,res)=>{
    console.log(req.body)
    const userRef = db.collection('User_Accounts')
    userRef.add({First_Name:"Tahj", Last_Name:"Serieux"})
    .then((docRef)=>{
        res.status(200).json({userId:docRef._path.segments[1],mssg:'Successfully Added'})
    })
    .catch((error)=>{
        res.status(500).json({error})
    })

})

app.post('/test-ml-call', async(req,res)=>{

    console.log(req.body)
    
})


app.use('*', (req, res) => {
    res.status(404).json({error:"Resource not found"});
  });