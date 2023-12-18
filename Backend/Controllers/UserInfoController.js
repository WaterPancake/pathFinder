const {db} = require('../firebase')

const getSavedRoutes = async(req,res)=>{
    const userRef = db.collection('User_Accounts');
    try {
        const userDocReference = await userRef.doc(req.user._id)
        const userDocSnapshot = await (await userDocReference.get()).data()
        console.log("hereeerewrewrwrewr")
        const savedWaypoints = [...userDocSnapshot.savedWaypoints];
        return(res.status(200).json({mssg:"successfully saved", savedWaypoints}))
    } catch (error) {
        return(res.status(400).json({mssg:"Failed to retrieve"}))
        
    }
}
const saveFavoritedRoutes = async(req, res) =>{
    const {route} = req.body;
    const userRef = db.collection('User_Accounts');
    console.log(route)
    try {
        const userDocReference = await userRef.doc(req.user._id)
        const userDocSnapshot = await (await userDocReference.get()).data()
        if(userDocSnapshot.savedWaypoints.includes(route)){
            return (res.status(200).json({mssg:"Waypoint is already saved"}))
        }else{
            const savedWaypoints = [route,...userDocSnapshot.savedWaypoints];
            userDocReference.update({savedWaypoints})
            return(res.status(200).json({mssg:"successfully saved"}))

        }
    } catch (error) {
        return(res.status(400).json({mssg:"Failed to save"}))
        
    }



}
module.exports = {getSavedRoutes,saveFavoritedRoutes};