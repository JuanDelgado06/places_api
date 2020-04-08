const express = require('express');
const router= express.Router();

const authenticaAdmin = require('../middlewares/authenticaAdmin');
const findUser = require('../middlewares/findUser');
const applicationsController = require('../controllers/ApplicationsController');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

router.all('*', jwtMiddleware({secret: secrets.jwtSecret}), findUser, authenticaAdmin)

router.route('/')
    .get(applicationsController.index)
    .post(applicationsController.create);

router.route('/:id')
    .delete(applicationsController.find, applicationsController.destroy);

module.exports = router;