const express = require('express');
const router= express.Router();

const usersController = require('../controllers/UsersController');
const authenticaAdmin = require('../middlewares/authenticaAdmin');
const findUser = require('../middlewares/findUser');

const sessionsControlller = require('../controllers/SessionsController');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

router.route('/')
    .post(usersController.create, sessionsControlller.generateToken, sessionsControlller.sendToken)
    .get(jwtMiddleware({secret: secrets.jwtSecret}), usersController.myPlaces)
router.route('/all')
    .get(jwtMiddleware({secret: secrets.jwtSecret}), findUser, authenticaAdmin, usersController.index)
router.route('/:id')
    .delete(findUser, authenticaAdmin, usersController.destroyUser);

module.exports = router;