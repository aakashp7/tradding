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

var bitmexCtrl = require('../controller/bitmexController');
var bitmexUserCtrl = require('../controller/bitmexUserController');
var bitmexApi = require('../others/bitmex');
var bitmexUserApi = require('../others/bitmexUser');


router.get('/getOrders', csrfProtection, auth, bitmexApi.getOrders);
router.get('/getPositions', csrfProtection, auth, bitmexApi.getPositions);
router.get('/getFilledOrders', csrfProtection, auth, bitmexApi.getFilledOrders);
router.get('/getActiveOrders', csrfProtection, auth, bitmexApi.getActiveOrders);
router.get('/getInstrument', csrfProtection, auth, bitmexApi.getInstrument);

router.get('/getUserOrders', csrfProtection, auth, bitmexUserApi.getUserOrders);
router.get('/getUserPositions', csrfProtection, auth, bitmexUserApi.getUserPositions);
router.get('/getUserFilledOrders', csrfProtection, auth, bitmexUserApi.getUserFilledOrders);
router.get('/getUserActiveOrders', csrfProtection, auth, bitmexUserApi.getUserActiveOrders);
router.get('/getUserInstrument', csrfProtection, auth, bitmexUserApi.getUserInstrument);

router.get('/getUserData', csrfProtection, auth, bitmexUserCtrl.getUserData);
router.get('/getAdminBitmexAccount', csrfProtection, auth, bitmexCtrl.getAdminBitmexAccount);


// router.get('/getActiveOrders',auth, bitmexCtrl.getActiveOrders);
// router.get('/mediavalidations',auth, mediaCtrl.getMediaValidations);


module.exports = router;
