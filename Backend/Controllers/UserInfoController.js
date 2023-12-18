const {db} = require('../firebase')

const getSavedRoutes = (req,res)=>{
    res.status(200).json({...req.user.savedRoutes});
}
const saveFavoritedRoutes = async(req, res) =>{
    const {waypoint} = req.body;
    const userRef = db.collection('User_Accounts');
    const userDocReference = await userRef.doc(req._id)
    try {
        const userDocSnapshot = await userDocReference.get()
        const savedWaypoints = [waypoint,...userDocSnapshot.savedWaypoints];
        userDocReference.update({savedWaypoints})
        return(res.status(200).json({mssg:"successfully saved"}))
        
    } catch (error) {
        return(res.status(400).json({mssg:"Failed to save"}))
        
    }



}
module.exports = {getSavedRoutes,saveFavoritedRoutes};