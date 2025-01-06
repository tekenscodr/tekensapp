const express = require('express')
const router = express.Router()
const Organiser = require('../controllers/organiser')
const { verifyAccessToken } = require('../helpers/jwt_helper')


router.post('/register', Organiser.register);

router.post('/login', Organiser.login);

router.get('/veriify', verifyAccessToken)


// Analytics
router.get('/most-saved', Organiser.mostSavedEventsByOrganiser)
router.get('/best-sales', Organiser.getBestPerformingEvents)


// router.get('/:id', AuthController.userId);
 
// router.get('/getuser', AuthController.getUser);

module.exports = router;
