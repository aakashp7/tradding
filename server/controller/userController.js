var mongoose = require('mongoose');
const Users = require('../model/users');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var passport = require('passport');
var jwtmodel = require("../others/jwtmodel");
const jwt = require("jsonwebtoken");
const Sendgrid = require('../others/sendgrid');
const crypt = require('../others/cryptojs');
const countrylist = require('countries-list');
const GroupsModel = require('../model/groups');
const Otp = require('../model/otp');
const Invoice = require('../model/invoice');
const ElectReq = require('../controller/electreqController')
const content = require('../model/content');
const Function = require('../others/functions');
const Logs = require('../model/logs');
var cron = require('node-cron');
const ccxt = require('ccxt')
const bitmexApi = require('../others/bitmex');
const Membership = require('../model/membershipplans');
const comments = require('../model/comments');
const Report = require('../model/reportcontent');
const AdminReplay = require('../model/adminreplay');


var uniqid = require('uniqid');

if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production') {
    var frontendURL = process.env.CLIENTURL;
} else {
    var frontendURL = '';
}



var userController = {};

userController.getCSRF = function (req, res, next) {
    var csrf = req.csrfToken();
    // console.log("csrf", csrf)

    res.status(200).json({ _csrf: csrf });
}

userController.generateJwt = function (valobj) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    //expiry.setMinutes(expiry.getMinutes()+5);
    return jwt.sign({
        _id: valobj._id,
        email: valobj.email,
        name: valobj.fname,
        phone: valobj.phone,
        userid: valobj.userid,
        group: valobj.group,
        permission: (valobj.permission) ? valobj.permission : '',
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
}

userController.extend = function (target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
//api for user registration..
userController.saveUserDetails = function (req, res) {
    var newsletter = req.body.newsletter;
    var PaymentType = req.body.PaymentType;
    var ReferralCode = req.body.ReferralCode;
    var email = req.body.email;
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zipcode = req.body.zipcode;
    var country = req.body.country;
    var installmentPlan = req.body.installmentPlan;

    var emailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var passwordtest = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    var userObj = {};
    var error = "";

    if (typeof newsletter !== 'undefined' && newsletter && newsletter !== '') {
        userObj.newsletter = newsletter;
    } else {
        if (error == '') {
            error = 'Newsletter is required <br />';
        } else {
            error += error + 'Newsletter is required or Invalid';
        }
    }

    if (typeof PaymentType !== 'undefined' && PaymentType && PaymentType !== '') {
        userObj.payment_type = PaymentType;
    } else {
        if (error == '') {
            error = 'Payment Type is required <br />';
        } else {
            error += error + 'Payment Type is required or Invalid';
        }
    }

    if (typeof email !== 'undefined' && email && email !== '') {
        if (emailtest.test(String(email).toLowerCase())) {
            userObj.email = email;

        } else {
            error = 'Invalid Email Address';
        }
    } else {
        if (error == '') {
            error = 'Email is required <br />';
        } else {
            error += error + 'Email is required or Invalid';
        }
    }

    if (typeof password !== 'undefined' && password && password !== '') {
        if (passwordtest.test(String(password))) {
            userObj.password = password;

        } else {
            error = 'Invalid Password';
        }
    } else {
        if (error == '') {
            error = 'Password is required <br />';
        } else {
            error += error + 'Password is required or Invalid';
        }
    }


    if (typeof fname !== 'undefined' && fname && fname !== '') {
        userObj.fname = fname;
    } else {
        if (error == '') {
            error = 'First Name is required <br />';
        } else {
            error += error + 'First Name is required or Invalid';
        }
    }

    if (typeof lname !== 'undefined' && lname && lname !== '') {
        userObj.lname = lname;
    } else {
        if (error == '') {
            error = 'Last Name is required <br />';
        } else {
            error += error + 'Last Name is required or Invalid';
        }
    }

    if (typeof phone !== 'undefined' && phone && phone !== '') {
        userObj.phone = phone;
    } else {
        if (error == '') {
            error = 'Phone is required <br />';
        } else {
            error += error + 'Phone is required or Invalid';
        }
    }
    userObj.referralcode = ReferralCode;
    userObj.address = address;
    userObj.city = city;
    userObj.state = state;
    userObj.zipcode = zipcode;
    userObj.country = country;
    userObj.group = 'customer';
    userObj.installmentPlan = installmentPlan;
    if(installmentPlan){
        userObj.numberOfInstallmentPlan = 0;
        userObj.selectedPlanId = newsletter;
        // Membership.findOne({ fullplan: newsletter }).exec(function (err, resuser) {
        //     userObj.selectedPlanId = resuser._id;                
        // });        
    }
    if(newsletter=="Free"){
        userObj.status = "Active";
    }

    var passobj = jwtmodel.setPassword(req.body.password);
    userObj = ctrl.extend({}, userObj, passobj);
    try{
        Users.findOne({ email: userObj.email }).exec(function (findError, findUser) {
            if (findError) {
                res.status(200).json({
                    message: findError,
                    status: false
                });
            }
            else {
                if (findUser == null) {
                    Users.create(userObj, function (userError, user) {
                        if (userError) {
                            res.status(200).json({
                                status: false,
                                data: "Users.create",
                                message: userError
                            });
                        } else {
                            if(newsletter!="Free"){
                                if (user && user != '' && user !== null) {
                                    ElectReq.addRequest(user._id, newsletter,installmentPlan, function (reqErr, response) {
                                        if (reqErr) {
                                            res.status(200).json({
                                                message: reqErr,
                                                data: "ElectReq.addRequest",
                                                status: false
                                            });
                                        }
                                        else {
                                            // let btcamount = 0;
                                            // console.log("response",response);
                                            // if(installmentPlan){
                                            //     btcamount = Number(response.installmentPlan) / 100000000;
                                            // }
                                            // else {
                                            //     btcamount = Number(response.amount) / 100000000;
                                            // }
                                            var btcamount = Number(response.amount) / 100000000;
                                            var invoiceObj = {};
                                            invoiceObj.userid = user._id;
                                            invoiceObj.amount = response.amount;
                                            invoiceObj.address = response.address;
                                            invoiceObj.memo = response.memo;
                                            invoiceObj.invoiceId = response.id;
                                            invoiceObj.URI = response.URI;
                                            invoiceObj.status = response.status;
                                            invoiceObj.request_url = response.request_url;
                                            invoiceObj.index_url = response.index_url;
                                            invoiceObj.btcamount = btcamount;
                                            invoiceObj.newsletter = newsletter;
                                            invoiceObj.req_Obj = response;
                                            Invoice.findOne({ userid: user._id }).exec(function (infindError, infindUser) {
                                                if (infindError) {
                                                    res.status(200).json({
                                                        message: infindError,
                                                        data: "Invoice.findOne",
                                                        status: false
                                                    });
                                                }
                                                else {
                                                    if (infindUser == null) {
                                                        console.log(invoiceObj);
                                                        Invoice.create(invoiceObj, function (invoiceError, invoiceRes) {
                                                            if (invoiceError) {
                                                                res.status(200).json({
                                                                    status: false,
                                                                    data: "Invoice.create",
                                                                    message: invoiceError
                                                                });
                                                            } else {
                                                                var sendGrid = new Sendgrid();
                                                                var address = response.address;
                                                                var verificationObj = {
                                                                    'id': user._id,
                                                                    'email': userObj.email,
                                                                    'address': address
                                                                }
                                                                var encrptStr = crypt.encrypt(JSON.stringify(verificationObj));
                                                                var host = '';
                                                                var url = '';
                                                                if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV == 'production') {
                                                                    host = process.env.CLIENTURL + 'invoicereq/';
                                                                    url = process.env.CLIENTURL;

                                                                } else {
                                                                    host = frontendURL + 'invoicereq/';
                                                                    url = frontendURL;
                                                                }
                                                                const options = {
                                                                    LINK: host + encrptStr,
                                                                    invoiceId: invoiceRes.invoiceId,
                                                                    fname: fname,
                                                                    lname: lname,
                                                                    url: url
                                                                }
                                                                sendGrid.sendEmail(
                                                                    email,
                                                                    'Your Registration with Mixedtradingarts.com',
                                                                    "views/emailtemplate/invoicemail.ejs",
                                                                    options
                                                                );
                                                                res.status(200).json({
                                                                    status: true,
                                                                    message: 'Registration Successful.A payment link has been sent to your email account'
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            else{
                                res.status(200).json({status: true,message: "Registration Successfully"});   
                            }
                        }
                    })
                }
                else if (findUser !== null) {
                    res.status(200).json({
                        status: false,
                        message: "Email already exists, please try another."
                    })
                }
            }
        })
    }
    catch(error){
           // console.log(error);
    }
}


userController.checkInstallmentPlanExpiry = function (req, res, next) {
  //  console.log("checkInstallmentPlanExpiry");
    Users.find({ installmentPlan:true}).exec(function (error, rows) {
        rows.forEach((user)=>{
            if(user.expiry_date){
              //  console.log("expiry_date");
                if(user.numberOfInstallmentPlan<=2){
                //     console.log("numberOfInstallmentPlan",user.numberOfInstallmentPlan);
                    let date = new Date(user.expiry_date);
                    let beforeDate = date.setDate(date.getDate() - 5); 
                    let beforeFiveDate = new Date(beforeDate).getTime();
                    let expiryDate = new Date(user.expiry_date).getTime(); 
                    let currentDate = new Date().getTime(); 
                    let numberOfInstallmentPlan =  Number(user.numberOfInstallmentPlan) + 1; 
                   
                    if(beforeFiveDate<=currentDate && expiryDate>=currentDate){
                        //console.log("user.email",user.email);
                        ElectReq.renewPlanRequest(user.selectedPlanId, function (reqErr, response,planname) {
                            if (reqErr) {
                                console.log(reqErr);
                                res.status(200).json({
                                    message: reqErr,
                                    data: "ElectReq.addRequest",
                                    status: false
                                });
                            }
                            else {
                                console.log("planname",planname);
                                let btcamount = Number(response.amount) / 100000000;
                                let invoiceObj = {};
                                invoiceObj.userid = user._id;
                                invoiceObj.amount = response.amount;
                                invoiceObj.address = response.address;
                                invoiceObj.memo = response.memo;
                                invoiceObj.invoiceId = response.id;
                                invoiceObj.URI = response.URI;
                                invoiceObj.status = response.status;
                                invoiceObj.request_url = response.request_url;
                                invoiceObj.index_url = response.index_url;
                                invoiceObj.btcamount = btcamount;
                                invoiceObj.newsletter = planname;
                                invoiceObj.req_Obj = response;
                                 console.log("invoiceObj",invoiceObj);
                                Invoice.create(invoiceObj, function (invoiceError, invoiceRes) {
                                    if (invoiceError) {
                                        res.status(200).json({
                                            status: false,
                                            data: "Invoice.create",
                                            message: invoiceError
                                        });
                                    } 
                                    else
                                    {
                                        console.log("create invoice");
                                        let sendGrid = new Sendgrid();
                                        let address = response.address;
                                        let verificationObj = {
                                            'id': user._id,
                                            'email': user.email,
                                            'address': address
                                        }
                                          console.log("verificationObj",verificationObj);
                                        let encrptStr = crypt.encrypt(JSON.stringify(verificationObj));
                                        let host = '';
                                        let url = '';
                                        if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV == 'production') {
                                            host = process.env.CLIENTURL + 'invoicereq/';
                                            url = process.env.CLIENTURL;

                                        } else {
                                            host = frontendURL + 'invoicereq/';
                                            url = frontendURL;
                                        }
                                        const options = {
                                            LINK: host + encrptStr,
                                            invoiceId: invoiceRes.invoiceId,
                                            fname: user.fname,
                                            lname: user.lname,
                                            url: url,
                                            numberOfInstallmentPlan:numberOfInstallmentPlan
                                        }
                                        sendGrid.sendEmail(
                                            user.email,
                                            'Your plan expiry',
                                            "views/emailtemplate/renewinvoicemail.ejs",
                                            options
                                        );
                                        // res.status(200).json({
                                        //     status: true,
                                        //     message: 'Your plan expiry'
                                        // });
                                    }
                                });
                            }
                        });
                    }                    
                }
            }   
        });
    });
}



//api for user login..
userController.user_login = function (req, res, next) {
    try {
        passport.authenticate('local', function (err, userinfo, info) {
            var token;
            var methods = new Function(req);
            // If Passport throws/catches an error
            if (err) {
                res.status(200).json({
                    status: false,
                    message: err
                });
                return;
            }
            // If a user is found
            if (userinfo) {
                if (typeof userinfo.group !== 'undefined' && userinfo.group == 'customer') {
                    methods.addLoginLog(userinfo);
                    token = ctrl.generateJwt(userinfo);
                    res.status(200).json({ status: true, payment: userinfo.payment_verified, "token": token,accountType:userinfo.newsletter, message: "Login Successful." })
                } else {
                    res.status(200).json({ status: false, message: "Customer is not valid" })
                }
            } else {
                // If user is not found                
                res.status(200).json({ status: false, message: info.message });
            }
        })(req, res);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

//api for admin login..
userController.admin_login = function (req, res, next) {
    try {
        passport.authenticate('local', function (err, userinfo, info) {
            var token;
            // If Passport throws/catches an error
            if (err) {
                res.status(200).json({ status: false, message: err });
                return;
            }
            if (userinfo) {
                GroupsModel.findOne({ group: userinfo.group }).exec(function (grperror, grprows) {
                    if (grperror) {
                        res.status(200).json({ message: grperror.message })
                    } else {
                        if (grprows !== null) {
                            if (typeof grprows.type !== 'undefined' && grprows.type !== null && grprows.type == 'Admin') {
                                GroupsModel.findOne({ group: grprows.group }).exec(function (rerr, records) {
                                    if (rerr) {
                                        res.status(200).json({ status: false, message: rerr.message })
                                    } else {
                                        userinfo.permission = records.permission;
                                        token = ctrl.generateJwt(userinfo);
                                        res.status(200).json({ status: true, "token": token, message: "Login Successful." })
                                    }
                                });
                            } else {
                                res.status(200).json({ status: false, 'message': 'Admin is not valid' });
                            }
                        } else {
                            res.status(200).json({ status: false, 'message': 'Admin is not valid' });
                        }
                    }
                });
            } else {
                // If user is not found
                res.status(200).json({ status: false, message: info.message });
            }
        })(req, res);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
//api for verify email..
userController.verifyAccount = function (req, res, next) {
    try {
        var data = JSON.parse(crypt.decrypt(req.query.str));
        var userid = data.id;
        var email = data.email;
        if (typeof userid !== 'undefined' && userid !== '' &&
            typeof email !== 'undefined' && email !== ''
        ) {
            Users.findOne({ _id: userid }).exec(function (error, rows) {
                if (error) {
                    res.status(500).json({ message: "Internal Server Error" })
                } else {
                    if (rows == null) {
                        res.status(400).json({ message: "No Account Found" });
                    } else {
                        if (rows.email_verified == '1') {
                            res.status(400).json({ message: "Already Verified" });
                        } else {
                            if (rows === null) {
                                res.status(400).json({ message: "Invalid Request" })
                            } else {
                                Users.update({ _id: userid }, { email_verified: 1 }).exec(function (error, uprows) {
                                    if (error) {
                                        res.status(500).json({ message: "Internal Server Error" })
                                    } else {
                                        res.status(200).json({ message: "Account Verified" })
                                    }
                                })
                            }
                        }
                    }
                }
            })
        }
        else {
            res.status(400).json({ message: 'Link is Invalid' })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
//api for get all country list..
userController.getCountryList = function (req, res, next) {
    try {
        var countrycode = Object.keys(countrylist.countries);
        var countries = [];
        countrycode.forEach(function (item) {
            var countObj = countrylist.countries[item];
            countObj.code = item;
            countries.push(countObj)
        })
        res.status(200).json(countries)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// email check for forgot password
userController.forgetPassemailCode = function (req, res, next) {
    try {
        var email = req.body.email;

        if (typeof email != 'undefined' && email && email != '') {

            Users.findOne({ email: email }, function (errFind, resFind) {
                if (errFind) {
                    res.status(500).json({ message: errFind.message })
                }
                else {
                    if (resFind == null) {
                        res.status(400).json({ message: "Email is not registered." })
                    }
                    else {
                        var name = resFind.fname + ' ' + resFind.lname;
                        var url = frontendURL;
                        var otpcodeData = {};
                        var timestamp = Date.now();
                        otpcodeData.userid = resFind._id;
                        otpcodeData.code = uniqid();
                        otpcodeData.timestamp = timestamp;

                        var sendGrid = new Sendgrid();
                        var options = {
                            email: email,
                            name: name,
                            url: url,
                            code: otpcodeData.code,
                            timestamp: timestamp
                        };
                        sendGrid.sendEmail(
                            email,
                            'Forget Password Code',
                            "views/emailtemplate/keyemail.ejs",
                            options
                        );
                        Otp.create(otpcodeData, function (errOtp, resOtp) {
                            if (errOtp) {
                                res.status(200).json({ message: errOtp.message, success: false })
                            }
                            else {
                                res.status(200).json({ message: "Code has been sent to your Email Id.", success: true })
                            }
                        })
                    }
                }
            })
        } else {
            res.status(400).json({ message: "Email is missing" })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// check the otp (Forgot password)
userController.otpVerification = function (req, res) {
    try {
        var otp = req.body.code;
        var email = req.body.email;
        if (typeof otp != 'undefined' && otp && otp != '' &&
            typeof email != 'undefined' && email && email != '') {
            ctrl.otpFind(email, function (otpObj) {
                if (otpObj.status == 200) {
                    var code = otpObj.data.code;
                    if (otp == code) {
                        var currentTmeStmp = Date.now();
                        var OTPAge = (currentTmeStmp - otpObj.data.timestamp) / 100;
                        if (OTPAge > 900000) {
                            res.status(200).json({ message: "Code Expired", success: false });
                        } else {
                            res.status(200).json({ message: 'Code Verified', success: true })
                        }
                    } else {
                        res.status(200).json({ message: "Otp did not match", success: false })
                    }
                } else {
                    res.status(200).json({ message: otpObj.message, success: false })
                }
            })
        } else {
            res.status(200).json({ message: "Code is missing", success: false })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// find the otp using userid
userController.otpFind = function (email, callback) {
    try {
        if (typeof email != 'undefined' && email && email != '') {
            Users.findOne({ email: email }, function (error, user) {
                if (!error && user) {
                    Otp.findOne({ userid: user._id }).sort({ 'createdAt': -1 }).exec(function (errFind, resFind) {
                        if (errFind) {
                            return callback({ status: 500, message: errFind.message })
                        }
                        else if (resFind) {
                            return callback({ status: 200, data: resFind })
                        } else {
                            return callback({ status: 400, message: "User is not found." })
                        }
                    })
                }
            })
        } else {
            return callback({ status: 400, message: "Invalid Details" })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }

}


userController.resetForgetPassword = function (req, res, next) {
    try {
        var email = req.body.email;
        var password = req.body.password;
        var confirmpassword = req.body.confirmPassword;
        if (typeof email !== 'undefined' && email && email !== '' &&
            typeof password !== 'undefined' && password && password !== '' &&
            typeof confirmpassword !== 'undefined' && confirmpassword && confirmpassword !== '') {

            if (password === confirmpassword) {
                var flag = '';
                var emailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailtest.test(String(email).toLowerCase())) {
                    flag = 'email';
                }
                if (flag !== '') {
                    Users.findOne({ email: email }).exec(function (error, user) {
                        if (error) {
                            res.status(200).json({ message: error.message, success: false })
                        } else {
                            if (user !== null) {
                                var encypass = jwtmodel.setPassword(password);
                                encypass.passwordrepeat = confirmpassword;
                                Users.update({ _id: user._id }, encypass).exec(function (error, updatedrow) {
                                    if (error) {
                                        res.status(200).json({ message: error.message, success: false })
                                    } else {
                                        res.status(200).json({ message: 'Password has been reset successfully', success: true })
                                    }
                                })
                            } else {
                                res.status(200).json({ message: 'Invalid Details', success: false })
                            }
                        }
                    })
                } else {
                    res.status(200).json({ message: 'Invalid Details', success: false })
                }
            } else {
                res.status(200).json({ message: 'Password and Confirm Password does not match', success: false })
            }

        } else {
            res.status(200).json({ message: 'Invalid Details', success: false })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

userController.verifyPayment = function (req, res, next) {
    try {
        var data = JSON.parse(crypt.decrypt(req.query.str));
     //   console.log("data --------- verifyPayment---------->>>>>>>>>", data);

        var userid = data.id;
        var email = data.email;
        var address = data.address;

        // console.log("User Id ",userid);
        // console.log("Email ",email);
        // console.log("Address ",address);
        if (typeof userid !== 'undefined' && userid !== '' &&
            typeof email !== 'undefined' && email !== '' &&
            typeof address !== 'undefined' && address !== ''
        ) {
            Invoice.findOne({ userid: userid, address: address }).exec(function (error, inData) {
                if (error) {
                    res.status(200).json({ message: error.message, success: false })
                } else {
                    if (inData == null) {
                        res.status(200).json({ message: "Invalid Request", success: false });
                    } else {
                        res.status(200).json({ success: true, url: inData.index_url, userid: userid, pay_status: inData.status })
                        // if (rows.email_verified == '1') {
                        //     res.status(400).json({ message: "Already Verified" });
                        // } else {
                        //     if (rows === null) {
                        //         res.status(400).json({ message: "Invalid Request" })
                        //     } else {
                        //         Users.update({ _id: userid }, { email_verified: 1 }).exec(function (error, uprows) {
                        //             if (error) {
                        //                 res.status(500).json({ message: "Internal Server Error" })
                        //             } else {
                        //                 res.status(200).json({ message: "Account Verified" })
                        //             }
                        //         })
                        //     }
                        // }
                    }
                }
            })
        }
        else {
            res.status(400).json({ message: 'Link is Invalid' })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// get user profile data..
userController.getUserProfile = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (userid) {
            if (typeof userid != 'undefined' && userid && userid != '') {
                Users.findOne({ _id: userid, group: 'customer' }, { salt: 0, password: 0 }).exec(function (error, rows) {
                    if (error) {
                        res.status(200).json({ success: false, message: error.message });
                    } else {
                        if (rows !== null) {
                            res.status(200).json({ success: true, user: rows });
                        } else {
                            res.status(200).json({ success: false, message: 'No User Found' });
                        }
                    }
                })
            } else {
                res.status(200).json({ success: false, message: "No User Details Found!" })
            }
        } else {
            res.status(200).json({ message: 'Access denied', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//update User Profile..
userController.updateProfile = function (req, res, next) {
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {

            var fname = req.body.fname;
            var lname = req.body.lname;
            var address = req.body.address;
            var city = req.body.city;
            var state = req.body.state;
            var zipcode = req.body.zipcode;
            var country = req.body.country;
            var avatar = req.body.avatar;
            var profileObj = {};
            var errorObj = {};
            var userid = req.payload._id;

            if (typeof fname !== 'undefined' && fname && fname !== '') {
                profileObj.fname = fname;
            } else {
                errorObj.msg = 'First Name is required or Invalid';
            }

            if (typeof lname !== 'undefined' && lname && lname !== '') {
                profileObj.lname = lname;
            } else {
                errorObj.msg = 'Last Name is required or Invalid';
            }

            if (typeof country !== 'undefined' && country && country !== '') {
                profileObj.country = country;
            } else {
                errorObj.msg = 'Country is required or Invalid';
            }

            if (typeof address !== 'undefined' && address && address !== '') {
                profileObj.address = address;
            } else {
                errorObj.msg = 'Address is required or Invalid';
            }

            if (typeof city !== 'undefined' && city && city !== '') {
                profileObj.city = city;
            } else {
                errorObj.msg = 'City is required or Invalid';
            }

            if (typeof state !== 'undefined' && state && state !== '') {
                profileObj.state = state;
            } else {
                errorObj.msg = 'State is required or Invalid';
            }

            if (typeof zipcode !== 'undefined' && zipcode && zipcode !== '') {
                if (isNaN(zipcode)) {
                    errorObj.msg = 'Zip/Postal Code is Invalid';
                } else {
                    profileObj.zipcode = zipcode;
                }
            } else {
                errorObj.msg = 'Zip/Postal Code is required';
            }

            if (typeof avatar !== 'undefined' && avatar && avatar !== '') {
                profileObj.avatar = avatar;
            }

            if (Object.keys(errorObj).length === 0) {
                Users.findOneAndUpdate({ _id: req.payload._id }, profileObj).exec(function (error, rows) {
                    if (error) {
                        res.status(200).json({ success: false, message: error.message });
                    } else {
                        res.status(200).json({ message: 'Profile Updated', success: true, userid: req.payload._id })
                    }
                })
            } else {
                res.status(200).json({ success: false, message: errorObj.msg });
            }
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


// get Admin uploads..
userController.getContent = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (userid) {
            content.find({}).exec(function (error, contRes) {
                var videoArr = [];
                var imageArr = [];
                var articleArr = [];
                var audioArr = [];
                if (contRes.length > 0) {

                    contRes.forEach(function (item) {
                        if (item.contenttype === 'Image') {
                            imageArr.push(item)

                        } else if (item.contenttype === 'Video') {
                            videoArr.push(item)

                        } else if (item.contenttype === 'Article') {
                            articleArr.push(item)

                        } else if (item.contenttype === 'Audio') {
                            audioArr.push(item)
                        }
                    })
                }
                if (error) {
                    res.status(200).json({ status: false, message: error.message })
                } else {
                    res.status(200).json({
                        status: true,
                        image: imageArr,
                        video: videoArr,
                        audio: audioArr,
                        article: articleArr
                    });
                }
            })
        } else {
            res.status(400).json({ message: 'Access denied', access_flag: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

userController.getContentById = function (req, res, next) {
    try {
        var userid = req.payload._id;
        var item_id = req.body.id;        
        if (userid) {
            if (typeof item_id !== 'undefined') {
            content.find({_id:item_id}).exec(function (error, contRes) {
                var videoArr = [];
                var imageArr = [];
                var articleArr = [];
                var audioArr = [];
                if (contRes.length > 0) {                    
                    contRes.forEach(function (item) {
                         if(item.category){
                          //  console.log(item.category.includes(item_id));
                            if(item.category.includes(item_id)){
                                if (item.contenttype === 'Image') {
                                    imageArr.push(item);
                                } else if (item.contenttype === 'Video') {
                                    videoArr.push(item);
                                } else if (item.contenttype === 'Article') {
                                    articleArr.push(item);
                                } else if (item.contenttype === 'Audio') {
                                    audioArr.push(item);
                                }
                            }
                         }
                    });
                }
                if (error) {
                    res.status(200).json({ status: false, message: error.message })
                } else {
                    res.status(200).json({
                        status: true,
                        image: imageArr,
                        video: videoArr,
                        audio: audioArr,
                        article: articleArr
                    });
                }
            });
        } 
        else {
            res.status(200).json({ message: 'Please select item', success: false });
        }}
        else {
            res.status(400).json({ message: 'Access denied', access_flag: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// get Admin Public uploads..
userController.getPublicContent = function (req, res, next) {
    try {
        content.find({}).exec(function (error, contRes) {
            var videoArr = [];
            var imageArr = [];
            var articleArr = [];
            if (contRes.length > 0) {

                contRes.forEach(function (item) {
                    if (item.contenttype === 'Image') {
                        imageArr.push(item)

                    } else if (item.contenttype === 'Video' && item.video_privacy === 'public') {
                        videoArr.push(item)

                    } else if (item.contenttype === 'Article') {
                        articleArr.push(item)

                    }
                })
            }
            if (error) {
                res.status(200).json({ status: false, message: error.message })
            } else {
                res.status(200).json({
                    status: true,
                    image: imageArr,
                    video: videoArr,
                    article: articleArr
                });
            }
        })

    } catch (error) {
        res.status(200).json({ status: false, message: error.message });
    }
}


// change password functions
userController.changePassword = function (req, res, next) {
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
            var userid = req.payload._id;
            var oldpassword = req.body.oldPassword;
            var password = req.body.password;
            var confirmpassword = req.body.confirmPassword;
            if (typeof oldpassword !== 'undefined' && oldpassword && oldpassword !== '' &&
                typeof password !== 'undefined' && password && password !== '' &&
                typeof confirmpassword !== 'undefined' && confirmpassword && confirmpassword !== '') {
                if (password === confirmpassword) {
                    Users.findOne({ _id: userid }).exec(function (error, user) {
                        if (error || user == null) {
                            res.status(200).json({ message: error.message, success: false });
                        } else {
                            if (jwtmodel.validPassword(oldpassword, user)) {
                                var newPassObj = jwtmodel.setPassword(password);
                                newPassObj.passwordrepeat = confirmpassword;
                                Users.update({ _id: userid }, newPassObj).exec(function (error, rows) {
                                    if (error) {
                                        res.status(200).json({ message: error.message, success: false });
                                    } else {
                                        res.status(200).json({ message: 'Password changed successfully', success: true })
                                    }
                                })
                            } else {
                                res.status(200).json({ message: 'Wrong Old Password', success: false })
                            }
                        }
                    })
                } else {
                    res.status(200).json({ message: 'Password and Confirm Password does not match!!', success: false })
                }
            } else {
                res.status(200).json({ message: 'Invalid Details', success: false })
            }

        } else {
            res.status(200).json({ message: 'Unauthorized Access', success: false })
        }
    } catch (e) {
        res.status(200).json({ message: e.message, success: false })
    }
}

//login logs api
userController.getloginlogs = function (req, res, next) {
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
            var perPage = Number(req.query.pageSize ? req.query.pageSize : 0);
            var page = Number(req.query.pageIndex ? req.query.pageIndex : 0);
            var userid = req.payload._id;
            var filter = {};
            filter = { userid: userid }
            if (typeof userid !== 'undefined' && userid && userid !== '') {
                if (typeof perPage !== 'undefined' && perPage !== '' &&
                    typeof page !== 'undefined' && page !== '') {
                    var skippage = (perPage * page);
                    Logs.find(filter).skip(skippage).limit(perPage).sort({ createdAt: -1 }).exec(function (txerr, txdoc) {
                        Logs.find(filter).countDocuments().exec(function (err, count) {
                            if (err) {
                                res.status(200).json({ success: false, message: err.message, });
                            } else {
                                var returnJson = {
                                    success: true,
                                    logs: txdoc,
                                    current: page,
                                    count: count,
                                    pages: Math.ceil(count / perPage)
                                }
                                res.status(200).json(returnJson);
                            }
                        });
                    });
                }
            } else {
                res.status(200).json({ success: false, message: 'Invalid User' })
            }
        } else {
            res.status(200).json({ success: false, message: 'Unauthorized Request' })
        }
    } catch (e) {
        res.status(200).json({ success: false, message: e.message })
    }
}

userController.getUserPaymentHistoryById = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (typeof userid != 'undefined' && userid && userid != '') {
            Invoice.find({ userid: userid }).exec(function (error, rows) {
                if (error) {
                    res.status(200).json({ success: false, message: error.message })
                } else {
                    res.status(200).json({ success: true, payment: rows });
                }
            })
        } else {
            res.status(200).json({ success: false, message: "No User Details Found!" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//api for user membership plan renewal .....
userController.planRenew = function (req, res) {
    var plan = req.body.plan;
    var email = req.payload.email;
    var userid = req.payload._id;
    var userObj = {};
    var error = "";


    if (typeof plan !== 'undefined' && plan && plan !== '') {
        userObj.newsletter = plan;
    } else {
        if (error == '') {
            error = 'Plan is required <br />';
        } else {
            error += error + 'Plan is required or Invalid';
        }
    }


    Users.findOne({ _id: userid, email: email }).exec(function (findError, findUser) {
        if (findError) {
            res.status(200).json({
                message: findError,
                status: false
            });
        }
        else {
            if (findUser !== null) {
                Users.update({ _id: userid, email: email }, { newsletter: plan }).exec(async function (userError, user) {
                    if (userError) {
                        res.status(200).json({
                            status: false,
                            message: userError
                        });
                    } else {

                        // if (user && user != '' && user !== null) {
                        ElectReq.addRequestRenew(userid, plan, function (reqErr, response) {
                            if (reqErr) {
                                res.status(200).json({
                                    message: reqErr,
                                    status: false
                                });
                            }
                            else {
                                var btcamount = Number(response.amount) / 100000000; //100,000,000 Satoshi= 1.00000000 BTC
                                var invoiceObj = {};
                                invoiceObj.userid = userid;
                                invoiceObj.amount = response.amount;
                                invoiceObj.address = response.address;
                                invoiceObj.memo = response.memo;
                                invoiceObj.invoiceId = response.id;
                                invoiceObj.URI = response.URI;
                                invoiceObj.status = response.status;
                                invoiceObj.request_url = response.request_url;
                                invoiceObj.index_url = response.index_url;
                                invoiceObj.btcamount = btcamount;
                                invoiceObj.newsletter = plan;
                                invoiceObj.req_Obj = response;

                                Invoice.findOne({ userid: user._id, address: response.address }).exec(function (infindError, infindUser) {
                                    if (infindError) {
                                        res.status(200).json({
                                            message: infindError,
                                            status: false
                                        });
                                    }
                                    else {
                                        if (infindUser == null) {
                                            Invoice.create(invoiceObj, function (invoiceError, invoiceRes) {
                                                if (invoiceError) {
                                                    res.status(200).json({
                                                        status: false,
                                                        message: invoiceError
                                                    });
                                                } else {
                                                    var sendGrid = new Sendgrid();
                                                    var verificationObj = {
                                                        'id': userid,
                                                        'email': email,
                                                        'address': response.address
                                                    }
                                                    var encrptStr = crypt.encrypt(JSON.stringify(verificationObj));
                                                    var host = '';
                                                    var url = '';
                                                    if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV == 'production') {
                                                        host = process.env.CLIENTURL + 'invoicereq/';
                                                        url = process.env.CLIENTURL;

                                                    } else {
                                                        host = frontendURL + 'invoicereq/';
                                                        url = frontendURL;
                                                    }
                                                    const options = {
                                                        LINK: host + encrptStr,
                                                        // LINK: invoiceRes.index_url,
                                                        invoiceId: invoiceRes.invoiceId,
                                                        fname: findUser.fname,
                                                        lname: findUser.lname,
                                                        url: url
                                                    }
                                                    sendGrid.sendEmail(
                                                        email,
                                                        'Membership Renewal with Mixedtradingarts.com',
                                                        "views/emailtemplate/invoicerenew.ejs",
                                                        options
                                                    );
                                                    res.status(200).json({
                                                        status: true,
                                                        message: 'Your request to renew subscription has been successfully submitted. A payment link has been sent to your email account'
                                                    });

                                                }
                                            })
                                        }
                                    }
                                })

                            }
                        })
                        // }
                    }
                })
            }
        }
    })
}

userController.userPaymentExpire = async function (req, res) {
    try {

        await Users.find({ payment_verified: 1 }).exec(async function (err, userList) {
            if (err) {
        //        console.log("user Payment Expire 1107", err)
            } else {
                if (userList.length > 0) {
                  //  console.log("user==>>", userList);
                    await userList.forEach(async function (user) {
                        var userid = user._id;
                        var expirydate = user.expiry_date;

                        if (typeof expirydate != 'undefined' && expirydate && expirydate != '') {
                            if (expirydate < Date.now()) {
                                Users.update({ _id: userid }, { payment_verified: 0 }).exec(function (error, uprows) {
                                    if (error) {
                                    //    console.log("user Payment Expire 1118", error.message)

                                    } else {
                                        res.status(200).json({
                                            status: true,
                                            message: 'Your subscription has expired.'
                                        });
                                       // console.log("user Payment Expire updated..... ");
                                    }
                                })
                            }

                        }
                        else if (expirydate == '') {
                            //console.log("111111111 hello 1111111111");

                        }

                    })
                }
            }
        })

    } catch (e) {
      //  console.log("admin Wallet Balance 225", e)
        // res.status(500).json({ message: e.message });
    }
}


userController.getUserCurrentSubsById = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (typeof userid != 'undefined' && userid && userid != '') {
            Invoice.findOne({ userid: userid, status: 'Paid' }).sort({ createdAt: -1 }).exec(function (error, rows) {
                if (error) {
                    res.status(200).json({ success: false, message: error.message })
                } else {
                    res.status(200).json({ success: true, subs: rows });
                }
            })
        } else {
            res.status(200).json({ success: false, message: "No User Details Found!" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

cron.schedule('59 23 * * *', async (req, res, next) => {
    try {
      //  console.log("---------------------");
      //  console.log("============== Running Cron Job at 11:59pm every day ==============");
        ctrl.checkInstallmentPlanExpiry();
        ctrl.userPaymentExpire();
    } catch (e) {
        console.log("Cron Error" + e);
    }
});


cron.schedule('*/5 * * * * *', async (req, res, next) => {
    try {
       ctrl.checkInstallmentPlanExpiry();
    } catch (e) {
        console.log("Cron Error" + e);
    }
});


// set bitmex api secret and id ..
userController.setBitmexCredentials = function (req, res, next) {
    try {

        var apikey = req.body.key;
        var apiID = req.body.id;
        var userid = req.payload._id;


        if (typeof userid != 'undefined' && userid && userid != '') {
            if (typeof apikey != 'undefined' && apikey && apikey != '' &&
                typeof apiID != 'undefined' && apiID && apiID != '') {
                Users.findOne({ _id: userid, group: 'customer' }, { salt: 0, password: 0 }).exec(async function (err, resuser) {
                    if (err) {
                        res.status(500).json({
                            message: err
                        })
                    } else {
                        if (resuser !== null) {

                            // const exchangeId = 'bitmex'
                            // , exchangeClass = ccxt[exchangeId]
                            // , exchange = new exchangeClass ({
                            //     'apiKey': apiID,
                            //     'secret': apikey,
                            //     'timeout': 30000,
                            //     'enableRateLimit': true,
                            // })

                            try {
                                bitmexApi.apiKeyAuthentication(apiID, apikey, function (keyRes) {                                    
                                    if (keyRes.success) {
                                        if (typeof keyRes.data.id != 'undefined' && keyRes.data.id && keyRes.data.id != '') {
                                            Users.update({ _id: userid }, { api_key_id: apiID, api_key_secret: apikey, api_key_status: true }).exec(function (error, uprows) {
                                                        if (error) {
                                                            res.status(200).json({ message: error.message, success: false })
                                                        } else {
                                                            res.status(200).json({ message: "Bitmex credentials added successfully.", success: true })
                                                        }
                                                    })
                                        }
                                        else if (keyRes.data.error) {
                                            res.status(200).json({ message: keyRes.data.error.message, success: false })
                                        }
                                    }
                                    else{
                                        res.status(200).json({ message: keyRes.message, success: false })
                                    }
                                })

                                // await exchange.fetch_balance().then((response) => {
                                //     Users.update({ _id: userid }, { api_key_id: apiID, api_key_secret: apikey, api_key_status: true }).exec(function (error, uprows) {
                                //         if (error) {
                                //             res.status(200).json({ message: error.message, success: false })
                                //         } else {
                                //             res.status(200).json({ message: "Bitmex credentials added successfully.", success: true })
                                //         }
                                //     })
                                // }).catch((e) => {
                                //     if (e instanceof ccxt.NetworkError) {
                                //         console.log (exchange.id, 'fetchTicker failed due to a network error:', e.message)
                                //         res.status(200).json({ message: e.message, success: false })
                                //         // retry or whatever
                                //         // ...
                                //     } else if (e instanceof ccxt.ExchangeError) {
                                //         console.log (exchange.id, 'fetchTicker failed due to exchange error: ==============>>>>>>>>',);
                                //         let removeStr = e.message.substr(6);
                                //         console.log(JSON.parse(removeStr).error.message);
                                //         res.status(200).json({ message: JSON.parse(removeStr).error.message, success: false })

                                //         // retry or whatever
                                //         // ...
                                //     } else {
                                //         console.log (exchange.id, 'fetchTicker failed with:', e.message)
                                //         res.status(200).json({ message: e.message, success: false })
                                //         // retry or whatever
                                //         // ...
                                //     }
                                // });

                            } catch (e) {
                                res.status(200).json({ message: e, success: false })

                                // if the exception is thrown, it is "caught" and can be handled here
                                // the handling reaction depends on the type of the exception
                                // and on the purpose or business logic of your application

                            }




                        }
                    }
                })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


//Remove bitmex api secret and id ..
userController.removeBitmexCredentials = function (req, res, next) {
    try {
        var userid = req.payload._id;

        if (typeof userid != 'undefined' && userid && userid != '') {
            Users.findOne({ _id: userid, group: 'customer' }, { salt: 0, password: 0 }).exec(function (err, resuser) {
                if (err) {
                    res.status(500).json({
                        message: err
                    })
                } else {
                    if (resuser !== null) {
                        Users.update({ _id: userid }, { api_key_id: "", api_key_secret: "", api_key_status: false }).exec(function (error, uprows) {
                            if (error) {
                                res.status(200).json({ message: error.message, success: false })
                            } else {
                                res.status(200).json({ message: "Bitmex credentials removed successfully.", success: true })
                            }
                        })
                    }
                }
            })
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


userController.contactUs = function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var subject = req.body.subject;
    var description = req.body.description;
    try 
    {
        if(name!="" &&  email!="" && phone!="" && subject!="" && description!=""){
        const options = {
            name: name,         
            email: email,
            phone: phone,
            subject: subject,
            description: description
        }

         let sendGrid = new Sendgrid();
         sendGrid.sendEmail(
                "",              
                'Contact Us',
                "views/emailtemplate/contactus.ejs",
                options
            );
            res.status(200).json({
                status: true,
                message: 'Successfully message send'
            });
        }
        else{
         res.status(200).json({
                status: false,
                message: 'All fields are required'
            });   
        }
    }
    catch(error){
            //console.log(error);
    }
    

}
userController.sendMail = function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var subject = req.body.subject;
    var description = req.body.description;
    try 
    {
        if(name!="" &&  email!="" && phone!="" && subject!="" && description!=""){
        const options = {
            name: name,         
            email: email,
            phone: phone,
            subject: subject,
            description: description
        }

         let sendGrid = new Sendgrid();
         sendGrid.sendEmail(
                "",
                subject,
                "views/emailtemplate/generalmail.ejs",
                options
            );
            res.status(200).json({
                status: true,
                message: 'Successfully message send'
            });
        }
        else{
         res.status(200).json({
                status: false,
                message: 'All fields are required'
            });   
        }
    }
    catch(error){
         //   console.log(error);
    }
    

}
/* SATRT 12/3/2020 */

userController.getContentByCategory = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (userid) {
            content.find({ category: { $elemMatch: req.body } }).exec(function (error, contRes) {
                var videoArr = [];
                var imageArr = [];
                var articleArr = [];
                var audioArr = [];
                if (contRes.length > 0) {

                    contRes.forEach(function (item) {
                        if (item.contenttype === 'Image') {
                            imageArr.push(item)

                        } else if (item.contenttype === 'Video') {
                            videoArr.push(item)

                        } else if (item.contenttype === 'Article') {
                            articleArr.push(item)

                        } else if (item.contenttype === 'Audio') {
                            audioArr.push(item)
                        }
                    })
                }
                if (error) {
                    res.status(200).json({ status: false, message: error.message })
                } else {
                    res.status(200).json({
                        status: true,
                        image: imageArr,
                        video: videoArr,
                        audio: audioArr,
                        article: articleArr
                    });
                }
            })
        } else {
            res.status(400).json({ message: 'Access denied', access_flag: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Api to add comment on to the content
userController.addComments = function (req, res) {
    try {
        var user_id = req.payload._id;
        var content_id = req.body.content_id;
        var comment = req.body.comment;
        if (user_id != '' && typeof user_id != 'undefined' &&
            content_id != '' && typeof content_id != 'undefined' &&
            comment != '' && typeof comment != 'undefined') {
            var obj = {
                content_id: content_id,
                user_id: user_id,
                comment: comment
            }
            comments.create(obj, function (errorcomments, commentObject) {
                if (errorcomments) {
                    res.status(200).json({ status: false, message: errorcomments.message });
                } else {
                    res.status(200).json({ status: true, message: 'Successfully add comment' });
                }
            })

        } else {
            res.status(400).json({ status: false, message: 'Details are missing' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

userController.fetchComments = function (req, res) {
    try {
        var user_id = req.payload._id;
        var content_id = req.query.content_id;
        var limit = Number(req.query.limit);
        var commentList = [];
        if (user_id != '' && typeof user_id != 'undefined' &&
            content_id != '' && typeof content_id != 'undefined') {
            comments.aggregate([
                {
                    $match: { content_id: { $eq: mongoose.Types.ObjectId(content_id) } },
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    "$project": {
                        'user.fname': 1,
                        'user.lname': 1,
                        'comment': 1,
                        'createdAt': 1,
                        'user.avatar': 1,
                    }
                },
                {
                    $sort: { "createdAt": -1 }
                }
            ]).exec(function (error, Comments) {
                if (error) {
                    res.status(500).json({ status: false, message: error.message });
                } 
                else if (Comments.length > 0) 
                {
                	let adminReplayList = [];
                	Comments.forEach((element,index)=>{	
                		AdminReplay.aggregate([{
                            	$match: { comment_id: { $eq: mongoose.Types.ObjectId(element._id) } },
                            },
                            {
                                "$lookup": {
                                    from: "users",
                                    localField: "user_id",
                                    foreignField: "_id",
                                    as: "user"
                                }
                            },
                            {
                                $unwind: "$user"
                            },
                            {
                                "$project": {
                                    'user.fname': 1,
                                    'user.lname': 1,
                                    'replay': 1,
                                    'createdAt': 1,
                                    'user.avatar': 1,
                                }
                            },
                            {
                                $sort: { "createdAt": -1 }
                            }
                        ]).exec((error, adminreplays)=> {
                        	if (error) {
                                res.status(500).json({ status: false, message: error.message });
                            }
                            else{
                                commentList.push({"comment":element,"adminreplays":adminreplays});                                
                            } 
                            
                        });
                    });                    
                	setTimeout(()=>{
                		res.status(200).json({ status: true, message: 'Successfully get comment list', comments: commentList });
                	},1000);

                } else {
                    res.status(200).json({ status: true, message: 'blank', comments: [] });
                }
            });

           /* comments.aggregate([
                {
                    $match: { content_id: { $eq: mongoose.Types.ObjectId(content_id) } },
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    "$project": {
                        'user.fname': 1,
                        'user.lname': 1,
                        'comment': 1,
                        'createdAt': 1,
                        'user.avatar': 1,
                    }
                },
                {
                    $sort: { "createdAt": -1 }
                }
            ]).limit(limit).exec(function (error, Comments) {
                if (error) {
                    res.status(500).json({ status: false, message: error.message });
                } else if (Comments.length > 0) {
                    res.status(200).json({ status: true, comments: Comments });
                } else {
                    res.status(200).json({ status: true, message: 'blank', comments: [] });
                }
            }); */

            
           

           /* comments.aggregate([
                {
                    $match: { content_id: { $eq: mongoose.Types.ObjectId(content_id) } },
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    "$lookup": {
                        from: "adminreplays",
                        localField: "_id",
                        foreignField: "comment_id",
                        as: "adminreplays"
                    }
                },
                {
                    $unwind: "$adminreplays"
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "adminreplays.user_id",
                        foreignField: "_id",
                        as: "admin"
                    }
                },
                {
                    $unwind: "$admin"
                },
                {
                    "$project": {
                        'user.fname': 1,
                        'user.lname': 1,
                        'comment': 1,
                        'createdAt': 1,
                        'user.avatar': 1,
                        'adminreplays.replay': 1,
                        'adminreplays.createdAt': 1,
                        'admin.fname':1,
                        'admin.lname':1,
                        'admin.avatar':1
                    }
                },
                {
                    $sort: { "createdAt": -1 }
                }
            ]).limit(limit).exec(function (error, Comments) {              
                if (error) {
                    res.status(500).json({ status: false, message: error.message });
                } else if (Comments.length > 0) {

                    res.status(200).json({ status: true, comments: Comments });
                } else {
                    res.status(200).json({ status: true, message: 'blank', comments: [] });
                }
            });*/

        } else {
            res.status(400).json({ status: false, message: 'Details are missing' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

// Api to report comment
userController.reportComment = function (req, res) {
    try {
        var user_id = req.payload._id;
        var content_id = req.body.content_id;
        var text = req.body.text;
        var comment_id = req.body.comment_id;

        if (user_id != '' && typeof user_id != 'undefined' &&
            content_id != '' && typeof content_id != 'undefined' &&
            text != '' && typeof text != 'undefined'
            && comment_id != '' && typeof comment_id != 'undefined') {
            var obj = {
                content_id: content_id,
                reporter_id: user_id,
                description: text,
                comment_id: comment_id
            }
            Report.create(obj, function (errorcomments, commentObject) {
                if (errorcomments) {
                    res.status(200).json({ status: false, message: errorcomments.message });
                } else {
                    // res.status(200).json({ status: true, message: 'Done' });
                    comments.update({ _id: comment_id }, { report_status: true }).exec(function (error, uprows) {
                        if (error) {
                            res.status(200).json({ message: error.message, status: false })
                        } else {
                            res.status(200).json({ message: 'Successfully report add', status: true })
                        }
                    })
                }
            })

        } else {
            res.status(400).json({ status: false, message: 'Details are missing' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


// Api to fetch all comments on the given content's id
userController.fetchCommentsByAdmin = function (req, res) {
    try {
        var user_id = req.payload._id;
        var content_id = req.query.content_id;
        // var limit = Number(req.query.limit);
        if (user_id != '' && typeof user_id != 'undefined' &&
            content_id != '' && typeof content_id != 'undefined') {
            comments.aggregate([
                {
                    $match: { content_id: { $eq: mongoose.Types.ObjectId(content_id) } },
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    "$project": {
                        'user.fname': 1,
                        'user.lname': 1,
                        'comment': 1,
                        'createdAt': 1,
                        'user.avatar': 1,
                    }
                },
                {
                    $sort: { "createdAt": -1 }
                }
            ]).exec(function (error, Comments) {
                if (error) {
                    res.status(500).json({ status: false, message: error.message });
                } else if (Comments.length > 0) {
                    res.status(200).json({ status: true, comments: Comments });
                } else {
                    res.status(200).json({ status: true, message: 'blank', comments: [] });
                }
            });
        } else {
            res.status(400).json({ status: false, message: 'Details are missing' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}



var ctrl = module.exports = userController;
