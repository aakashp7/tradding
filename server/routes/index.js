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

var userCtrl = require('../controller/userController');
var elctCtrl = require('../controller/electrumController');
var adminCtrl = require('../controller/adminController');
var elctReqCtrl = require('../controller/electreqController');
// var btmxCtrl = require('../controller/bitmexController');
var btmx = require('../others/bitmex');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/csrf', csrfProtection, userCtrl.getCSRF);
router.get('/csrf', csrfProtection, adminCtrl.getCSRF);


//user services...
router.post('/userRegistration', userCtrl.saveUserDetails);
router.get('/countrylist', userCtrl.getCountryList);
router.get('/getmembershipPlans', adminCtrl.getMembershipPlan);
router.get('/getAllMembershipPlans', adminCtrl.getAllMembershipPlans);


// router.get('/electrum', elctCtrl);
router.post('/login', csrfProtection, userCtrl.user_login);
router.get('/accountverify', csrfProtection, userCtrl.verifyAccount);
router.post('/forgetPassword', csrfProtection, userCtrl.forgetPassemailCode);
router.post('/codeVerification', csrfProtection, userCtrl.otpVerification);
router.post('/resetPassword', csrfProtection, userCtrl.resetForgetPassword);
router.get('/paymentverify', csrfProtection, userCtrl.verifyPayment);
router.get('/getprofile', csrfProtection, auth, userCtrl.getUserProfile);
router.post('/updateprofile', csrfProtection, auth, userCtrl.updateProfile);
router.get('/getContent', csrfProtection, auth, userCtrl.getContent);
router.post('/getContentById',auth, userCtrl.getContentById);
router.get('/getPublicContent', csrfProtection, userCtrl.getPublicContent);
router.post('/changePassword', csrfProtection, auth, userCtrl.changePassword);
router.get('/getloginlogs', csrfProtection, auth, userCtrl.getloginlogs);
router.get('/getpaymentHistory', csrfProtection, auth, userCtrl.getUserPaymentHistoryById);
router.post('/planRenewal', csrfProtection, auth, userCtrl.planRenew);
router.get('/expiryCheck', csrfProtection, auth, userCtrl.userPaymentExpire);
router.get('/getUserCurrentSubs', csrfProtection, auth, userCtrl.getUserCurrentSubsById);
router.post('/addBitmexAccess', csrfProtection, auth, userCtrl.setBitmexCredentials);
router.get('/removeBitmexAccess', csrfProtection, auth, userCtrl.removeBitmexCredentials);
router.post('/contactus',userCtrl.contactUs);
router.post('/sendmail',userCtrl.sendMail);
router.post('/checkInstallmentPlanExpiry',userCtrl.checkInstallmentPlanExpiry);

router.post('/getContentByCategory',  auth, userCtrl.getContentByCategory);
router.post('/addComment',  auth, userCtrl.addComments);
router.get('/getAllComments',  auth, userCtrl.fetchComments);
router.post('/reportComment',  auth, userCtrl.reportComment);
router.get('/getAllCommentsByAdmin', csrfProtection, auth, userCtrl.fetchCommentsByAdmin);


//admin services...
router.post('/adminlogin', csrfProtection, userCtrl.admin_login);
router.get('/addSuperAdmin', csrfProtection, adminCtrl.addsuperadmin);
router.get('/allUsers', csrfProtection, auth, adminCtrl.getCustomersList);
router.get('/updateCustomerStatus', csrfProtection, auth, adminCtrl.updateCustomerStatusById);
router.get('/DeleteUser', csrfProtection, auth, adminCtrl.deleteCustomerStatusById);
router.get('/userDetails', csrfProtection, auth, adminCtrl.getCustomerDetailsById);
router.post('/addMembershipPlan', csrfProtection, auth, adminCtrl.addMembershipPlan);
router.post('/setMembershipPrice', csrfProtection, auth, adminCtrl.setMembershipPrice);
router.get('/getBTCPrice', csrfProtection, auth, adminCtrl.getMembershipPrice);
router.post('/setTimer', csrfProtection, auth, adminCtrl.setTimerForRegistration);
router.get('/getTimer', csrfProtection, adminCtrl.getTimer);
router.get('/getTimerForAdmin', csrfProtection, auth, adminCtrl.getTimer);
router.get('/getAdminContent', csrfProtection, auth, adminCtrl.getAdminContent);
router.get('/deleteUploads', csrfProtection, auth, adminCtrl.deleteUploads);
router.get('/paymentDetails', csrfProtection, auth, adminCtrl.getPaymentHistoryById);
router.get('/adminWallet', csrfProtection, adminCtrl.getAdminWalletDetails);
router.get('/createNewAddress', csrfProtection, elctReqCtrl.CreateNewAddress);
router.get('/deletePlans', csrfProtection, auth, adminCtrl.deletePlansById);
router.post('/addcategory', auth, adminCtrl.addcategoryByAdmin);
router.post('/addsubcategory', auth, adminCtrl.addsubcategoryByAdmin);
router.get('/getAllCategories', csrfProtection, adminCtrl.getCategories);
router.post('/deletecategory', auth, adminCtrl.deleteCategory);
router.post('/deletecategorybyid', auth, adminCtrl.deleteCategoryById);
router.get('/getCategoriesByUsers',auth, csrfProtection, adminCtrl.getCategoriesByUsers);
router.get('/getCategoryList',auth, csrfProtection, adminCtrl.getCategoryList);
router.post('/deleteCommentsById', auth, adminCtrl.deleteComments);
router.get('/getReportCommentsById', csrfProtection, auth, adminCtrl.fetchReportedComments);
router.post('/deleteReportedComment', auth, adminCtrl.deleteReportedComments);
router.post('/adminReportComment', auth, adminCtrl.adminReportComment);



router.get('/checkReq', elctReqCtrl.addRequest);


// router.get('/getOrdersFilled', btmx.getOrdersFilled);

// router.get('/getOrderBook', btmxCtrl.getOrderBook);
router.get('/getFilledOrders', btmx.getActiveOrders);
// router.get('/getMargin', btmxCtrl.getMargin);
router.get('/hello', btmx.hello);




module.exports = router;
