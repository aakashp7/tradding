var express = require('express');
var router = express.Router();
var csrf = require('csurf');


var csrfProtection = csrf({
  cookie: {
      httpOnly: true,
      secure: false,
      key: "XSRF-TOKEN",
      path: '/',
      maxAge: 1000 * 60 * 60
  }
});

/* GET users listing. */
router.get('/', csrfProtection, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
