const express = require('express')
const {register, login, getMe, forgotPassword, resetPassword, updateUserDetails, updatePassword, logOut} = require('../controllers/auth')

const router = express.Router()

const {protect} = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logOut)
router.get('/me', protect, getMe)
router.put('/updateUserDetails', protect, updateUserDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)


module.exports = router