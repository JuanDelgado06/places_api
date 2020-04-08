const express = require('express');
const router= express.Router();

const visitsController = require('../controllers/VisitsController');
const authenticateOwner = require('../middlewares/authenticateOwner');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

router.route('/')
    .get(jwtMiddleware({secret: secrets.jwtSecret}), visitsController.index)
    .post(visitsController.create);

router.route('/:visit_id')
    .delete(visitsController.find, authenticateOwner, visitsController.destroy);

module.exports = router;