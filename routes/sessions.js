const express = require('express');
const router= express.Router();

const sessionsControlller = require('../controllers/SessionsController');

router.route('/')
    .post(sessionsControlller.authenticate, sessionsControlller.generateToken, sessionsControlller.sendToken)

module.exports = router;