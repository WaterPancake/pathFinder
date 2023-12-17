const getSavedRoutes = (req,res)=>{
    res.status(200).json({...req.user.savedRoutes});
}

module.exports = {getSavedRoutes};