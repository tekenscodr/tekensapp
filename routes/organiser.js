const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/organiser')
const { verifyAccessToken } = require('../helpers/jwt_helper')


router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/veriify', verifyAccessToken)


// router.get('/:id', AuthController.userId);
 
// router.get('/getuser', AuthController.getUser);

module.exports = router;
