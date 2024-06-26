const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth_controller')
const { verifyAccessToken } = require('../helpers/jwt_helper')


router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/:id', AuthController.userId);
router.get('/veriify', verifyAccessToken);

// REQUETS USER DETAILS BY PAYLOAD
router.get('/self', verifyAccessToken, AuthController.identifyByPayload);
 
// router.get('/getuser', AuthController.getUser);

module.exports = router;
