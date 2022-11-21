const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth_controller')
const { verifyAccessToken } = require('../helpers/jwt_helper')



router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/:id', AuthController.userId);

// router.post('/refresh-token', AuthController.refreshToken)

// router.delete('/logout', AuthController.logout)

module.exports = router;
