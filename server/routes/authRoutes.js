const router = require('express').Router()
const {  logout, login, register, sendVerifyOtp, verifyEmail, isAuthenticated, resetPassword, sendResetOtp } = require('../controllers/authController')
const userAuth = require('../middleware/userAuth')



router.post('/register',register )
router.post('/login',login )
router.post('/logout',logout )
router.post('/send-verify-otp',userAuth,sendVerifyOtp )
router.post('/verify-account',userAuth,verifyEmail )
router.post('/is-auth',userAuth,isAuthenticated )
router.post('/send-reset-otp',sendResetOtp )
router.post('/reset-password',resetPassword )


module.exports = router