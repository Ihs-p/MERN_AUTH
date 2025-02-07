const { getUserData } = require('../controllers/usercontroller')
const userAuth = require('../middleware/userAuth')

const router = require('express').Router()


router.get('/data', userAuth, getUserData)





module.exports = router
