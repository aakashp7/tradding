var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var UploadCtl = require('../controller/uploadController');
var csrf = require('csurf');
var multer = require('multer');


var upload = multer({ dest: './public/uploads/admincontent/imageUpload' })

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

// api route for uploading video file and seeding
router.post('/videoupload', csrfProtection,  auth, UploadCtl.soloUploadVideo);
router.post('/adminUploads', csrfProtection, auth, UploadCtl.adminUploads);
router.post('/adminUploadsImage', csrfProtection, auth, UploadCtl.adminUploadsImage);
router.post('/adminaudioUpload', csrfProtection, auth, UploadCtl.adminAudioUpload);
router.post('/uploadArticles', csrfProtection, auth, UploadCtl.uploadArticle);
router.post('/edituploads', csrfProtection, auth, UploadCtl.editAdminUploads);
router.post('/editAudioUpload', csrfProtection, auth, UploadCtl.editAudioAdminUpload);
router.post('/updateArticle', csrfProtection, auth, UploadCtl.updateArticle);
router.post('/audioupload', csrfProtection,  auth, UploadCtl.soloUploadAudio);
router.post('/addMediaCategory',auth,UploadCtl.addMediaCategory);
router.get('/demo', ()=>{console.log("Demo")});

// router.post('/articleImage', upload.single('UploadFiles') , (req, res) => { res.json('uploaded');});

router.post('/articleImage', UploadCtl.uploadartImage);

// router.post('/deleteImage', (req, res) => {
//     console.log(req);
// });

// router.post('/articleImage', UploadCtl.uploadartImage,(req, res) => { res.json('uploaded');} );


module.exports = router;