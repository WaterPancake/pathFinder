const requireAuth = require("../Middleware/requireAuth");
const express = require("express");
const {getSavedRoutes} = require('../Controllers/UserInfoController')

const router = express.Router()
router.use(requireAuth);
router.post('/',getSavedRoutes);


module.exports = router

