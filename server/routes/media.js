var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var csrf = require('csurf');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: false,
        key: "XSRF-TOKEN",
        path: '/',
        maxAge: 1000 * 60 * 60
    }
  });

var mediaCtrl = require('../controller/mediaController');

router.get('/addMediaValidations', csrfProtection, mediaCtrl.addMediaValidations);
router.get('/mediavalidations', csrfProtection, auth, mediaCtrl.getMediaValidations);


module.exports = router;
