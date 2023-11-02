const express = require("express")

const router = express.Router()

const {userLogin, userSignup} = require('../Controllers/UserAuthControllers')

router.post('/user/login',userLogin)
router.post('/user/signup',userSignup)

module.exports = router