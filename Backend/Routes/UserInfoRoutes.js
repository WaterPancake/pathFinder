const requireAuth = require("../Middleware/requireAuth");
const express = require("express");
const {getSavedRoutes,saveFavoritedRoutes} = require('../Controllers/UserInfoController');

const router = express.Router();
router.use(requireAuth);
router.post('/save-waypoint',saveFavoritedRoutes);
router.post('/',getSavedRoutes);


module.exports = router

