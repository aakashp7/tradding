var mongoose = require('mongoose');
const Users = require('../model/users');
const GroupsModel = require('../model/groups');
const Membership = require('../model/membershipplans');
const BtcPrice = require('../model/btcprice');
const Timer = require('../model/settimer');
const content = require('../model/content');
const Invoice = require('../model/invoice');
const Adminwallet = require('../model/adminwallet');
const socketModel = require('../others/socket');
const category = require('../model/category');
const comments = require('../model/comments');
const Report = require('../model/reportcontent');
const AdminReplay = require('../model/adminreplay.js');
var fs = require("fs");
var adminController = {};
adminController.getCSRF = function (req, res, next) {
    var csrf = req.csrfToken();    
    res.status(200).json({ _csrf: csrf });
}
// add super admin credentials..
adminController.addsuperadmin = function (req, res, next) {
    Users.findOne({ group: 'superadmin' }).exec(function (err, resuser) {
        if (err) {
            res.status(500).json({
                message: err
            })
        } else {
            if (resuser == null) {
                var obj = {
                    "email_verified": 1,
                    "phone_verified": 1,
                    "status": "Active",
                    "email": "",
                    "phone": "",
                    "fname": " Admin",
                    "group": "",
                    "password": "",
                }
                Users.create(obj, function (crErr, crRes) {
                    if (crErr) {
                        res.status(500).json({
                            message: crErr
                        })
                    } else {
                       
                        /*res.status(200).json(
                            {
                                message:"Done",
                                response:crRes
                            }
                        )*/
                        
                    }
                })
            } else {
              
                /* res.status(500).json({
                     message:"Admin already Exits"
                 })*/
            }
        }
    });

    /* GroupsModel */

    GroupsModel.find({}).exec(function (err, resuser) {
        if (err) {
            res.status(500).json({
                message: err
            })
        } else {
            if (resuser.length == 0) {
                var obj = [
                    { "status": "Active", "title": "Super Admin", "group": "superadmin", "type": "Admin", "permission": "write" },
                    { "status": "Active", "title": "Group", "group": "group", "type": "Admin", "permission": "write" }
                ]
                GroupsModel.create(obj, function (crErr, crRes) {
                    if (crErr) {
                        res.status(500).json({
                            message: crErr
                        })
                    } else {
                        
                        /*res.status(200).json(
                            {
                                message:"Done Group",
                                response:crRes
                            }
                        )*/
                    }
                })
            } else {
           
                /*res.status(500).json({
                    message:"Action already Exits"
                })*/
            }
        }
    })

};

// get registered users..
adminController.getCustomersList = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (userid) {
            Users.find({ group: 'customer', status: { $ne: 'Deleted' } }, { salt: 0, password: 0 }).exec(function (error, rows) {
                var len = rows.length;
                if (error) {
                    res.status(200).json({ status: false, message: error.message })
                } else {
                    res.status(200).json({ status: true, users: rows, count: len });
                }
            })
        } else {
            res.status(400).json({ message: 'Access denied', access_flag: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update user status..
adminController.updateCustomerStatusById = function (req, res, next) {
    try {
        var userid = req.query.userid;
        var status = req.query.status;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof userid !== 'undefined' && userid !== '') {
                var toggle = '';
                if (status === "Active") {
                    toggle = "Suspended";
                }
                else if (status === "Suspended") {
                    toggle = "Active";
                }
                Users.updateOne({ _id: userid }, { status: toggle }).exec(function (error, result) {
                    if (!error && result) {
                        res.status(200).json({ success: true, message: "User " + toggle + " successfully" })
                    } else {
                        res.status(200).json({ success: false, message: error.message })
                    }
                })
            } else {
                res.status(200).json({ success: false, message: "You have no super user privileges." })
            }
        } else {
            res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}


// user status changed by Deleted....
adminController.deleteCustomerStatusById = function (req, res, next) {
    try {
        var userid = req.query.userid;
        var status = req.query.status;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof userid !== 'undefined' && userid !== '') {
                var toggle = '';
                if (status === "Active") {
                    toggle = "Deleted";
                }
                else if (status === "Suspended") {
                    toggle = "Deleted";
                }
                Users.updateOne({ _id: userid }, { status: toggle }).exec(function (error, result) {
                    if (!error && result) {
                        res.status(200).json({ success: true, message: "User account deleted successfully" })
                    } else {
                        res.status(200).json({ success: false, message: error.message })
                    }
                })
            } else {
                res.status(200).json({ success: false, message: "You have no super user privileges." })
            }
        } else {
            res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

// get registered users..
adminController.getCustomerDetailsById = function (req, res, next) {
    try {
        var userid = req.query.userid;
        var adminid = req.payload._id;
        if (adminid) {
            if (typeof userid != 'undefined' && userid && userid != '') {
                Users.findOne({ _id: userid, group: 'customer' }, { salt: 0, password: 0 }).exec(function (error, rows) {
                    if (error) {
                        res.status(200).json({ status: false, message: error.message })
                    } else {
                        res.status(200).json({ status: true, user: rows });
                    }
                })
            } else {
                res.status(200).json({ success: false, message: "No User Details Found!" })
            }
        } else {
            res.status(400).json({ message: 'Access denied', access_flag: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete users..
adminController.deleteUser = function (req, res, next) {
    try {
        var type = req.payload.type;
        var code = req.query.code;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof code != 'undefined' && code && code != '') {
                User.deleteOne({ _id: code }).exec(function (error, result) {
                    if (!error && result) {
                        return res.status(200).json({ message: "User account deleted successfully" })
                    } else {
                        return res.status(500).json({ message: "Internal Server Error" })
                    }
                })
            } else {
                return res.status(400).json({ message: "You have no super user privileges." })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

// Add membership plans..
adminController.addMembershipPlan = function (req, res, next) {
    try {
        var numbr = req.body.num;
        var time = req.body.time;
        var installmentPlan = req.body.installmentPlan;
        var amount = req.body.amount;
        var lifetime = req.body.lifetime;
        var obj = {};
        var fullPlan = '';
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof amount != 'undefined' && amount && amount != '') {
                if (typeof numbr != 'undefined' && numbr && numbr != '' &&
                    typeof time != 'undefined' && time && time != '') {
                    fullPlan = numbr + " " + time;
                }
                else if (typeof lifetime != 'undefined' && lifetime && lifetime != '') {
                    fullPlan = lifetime;
                }

                Membership.findOne({ fullplan: fullPlan }).exec(function (err, resuser) {
                    if (err) {
                        res.status(500).json({
                            message: err
                        })
                    } else {
                        if (resuser == null) {
                            obj.userid = req.payload._id;
                            obj.time = time;
                            obj.num = numbr;
                            obj.amount = amount;
                            obj.installmentPlan = installmentPlan;
                            obj.fullplan = fullPlan;

                            Membership.create(obj, function (crErr, crRes) {
                                if (crErr) {
                                    res.status(200).json({
                                        message: crErr, success: false
                                    })
                                } else {
                                    res.status(200).json(
                                        { message: "Plan added successfully.", success: true }
                                    )
                                }
                            })
                        } else if (resuser !== null) {
                            res.status(200).json({
                                success: false, message: "Plan already exists, please try another."
                            })
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

// get all membership plans..
adminController.getMembershipPlan = function (req, res, next) {
    try {
        Membership.find({}, { userid: 0, time: 0, num: 0, createdAt: 0 }).exec(function (merr, memRes) {
            if (merr) {
                return res.status(200).json({ status: false, message: merr.message })
            } else {
                res.status(200).json({ status: true, plans: memRes });
                // if (memRes.length == 0) {
                //     return res.status(200).json({ status: false, message: "No Plans Available" })
                // } else {
                //     res.status(200).json({ status: true, plans: memRes });
                // }
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// set membership BTC price..
adminController.setMembershipPrice = function (req, res, next) {
    try {
        var amount = req.body.amount;
        var obj = {};
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof amount != 'undefined' && amount && amount != '') {
                BtcPrice.findOne({}).exec(function (err, resuser) {
                    if (err) {
                        res.status(500).json({
                            message: err
                        })
                    } else {
                        if (resuser == null) {
                            obj.userid = req.payload._id;
                            obj.amount = amount;

                            BtcPrice.create(obj, function (crErr, crRes) {
                                if (crErr) {
                                    res.status(200).json({
                                        message: crErr, success: false
                                    })
                                } else {
                                    res.status(200).json({ message: "BTC Price Added Successfully.", success: true })
                                }
                            })
                        } else if (resuser !== null) {
                            BtcPrice.update({ userid: req.payload._id }, { amount: amount }).exec(function (error, uprows) {
                                if (error) {
                                    res.status(200).json({ message: error.message, success: false })
                                } else {
                                    res.status(200).json({ message: "BTC Price Updated Successfully.", success: true })
                                }
                            })
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


// get BTC membership prrice..
adminController.getMembershipPrice = function (req, res, next) {
    try {
        BtcPrice.findOne({}, { userid: 0, createdAt: 0 }).exec(function (merr, memRes) {
            if (merr) {
                return res.status(200).json({ status: false, message: merr.message })
            } else {
                res.status(200).json({ status: true, price: memRes });
                // if (memRes == null) {
                //     return res.status(200).json({ status: false, price: 0 })
                // } else {
                //     res.status(200).json({ status: true, price: memRes });
                // }
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// set timer for registration..
adminController.setTimerForRegistration = function (req, res, next) {
    try {
        var date = req.body.date;
        var time = req.body.time;

        var obj = {};
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof time != 'undefined' && time && time != '' &&
                typeof date != 'undefined' && date && date != '') {
                Timer.findOne({}).exec(function (err, resuser) {
                    if (err) {
                        res.status(500).json({
                            message: err
                        })
                    } else {
                        if (resuser == null) {
                            obj.userid = req.payload._id;
                            obj.time = time;
                            obj.date = date;

                            Timer.create(obj, function (crErr, crRes) {
                                if (crErr) {
                                    res.status(200).json({
                                        message: crErr, success: false
                                    })
                                } else {
                                    res.status(200).json({ message: "Set Timer Successfully.", success: true })
                                }
                            })
                        } else if (resuser !== null) {
                            Timer.update({ userid: req.payload._id }, { time: time, date: date }).exec(function (error, uprows) {
                                if (error) {
                                    res.status(200).json({ message: error.message, success: false })
                                } else {
                                    socketModel.TimerUpdateNotification(uprows);
                                    res.status(200).json({ message: "Timer Updated Successfully.", success: true })
                                }
                            })
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


// get timer..
adminController.getTimer = function (req, res, next) {
    try {
        Timer.findOne({}, { userid: 0, createdAt: 0 }).exec(function (merr, memRes) {
            if (merr) {
                return res.status(200).json({ status: false, message: merr.message })
            } else {
                res.status(200).json({ status: true, timer: memRes });
                // if (memRes == null) {
                //     return res.status(200).json({ status: false, price: 0 })
                // } else {
                //     res.status(200).json({ status: true, price: memRes });
                // }
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// get Admin uploads..
adminController.getAdminContent = function (req, res, next) {
    try {
        var userid = req.payload._id;
        if (userid) {
            content.find({}).exec(function (error, contRes) {
                var videoArr = [];
                var imageArr = [];
                var articleArr = [];
                var audioArr = [];
                //console.log(contRes);
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


// delete Admin uploads..
adminController.deleteUploads = function (req, res, next) {
    try {
        var type = req.query.type;
        var id = req.query.id;
        var userid = req.payload._id;

        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof type != 'undefined' && type && type != '' &&
                typeof id != 'undefined' && id && id != '') {
                content.findOne({ _id: id }).exec(function (contError, uploads) {
                    if (contError) {
                        res.status(200).json({ message: contError.message, success: false });
                    } else if (uploads == null) {
                        res.status(200).json({ message: "File not found..", success: false });
                    } else {
                        var mediapath = "./public/" + uploads.content_url;
                        var vid_thumbnailpath = "./public/" + uploads.video_thumbnail;
                        var vid_thumbnailId = uploads.video_thumbnail_id;

                        var aud_thumbnailpath = "./public/" + uploads.audio_thumbnail;
                        var aud_thumbnailId = uploads.audio_thumbnail_id;

                        var article_thumbnailpath = "./public/" + uploads.article_thumbnail;

                        content.deleteOne({ _id: id, contenttype: type }).exec(function (error, result) {
                            if (!error && result) {
                                if (typeof vid_thumbnailId != undefined && vid_thumbnailId && vid_thumbnailId != '') {
                                    content.deleteOne({ _id: vid_thumbnailId, contenttype: 'Thumbnail' }).exec(function (errorThum, resultThumb) {
                                        if (!errorThum && resultThumb) {
                                            console.log("Video Thumbnail Deleted!!");
                                        }
                                    })
                                }
                                if (typeof aud_thumbnailId != undefined && aud_thumbnailId && aud_thumbnailId != '') {
                                    content.deleteOne({ _id: aud_thumbnailId, contenttype: 'Thumbnail' }).exec(function (aerrorThum, aresultThumb) {
                                        if (!aerrorThum && aresultThumb) {
                                            console.log("Audio Thumbnail Deleted!!");
                                        }
                                    })
                                }
                                if (typeof mediapath != undefined && mediapath && mediapath != '') {
                                    if (mediapath !== './public/undefined') {
                                        fs.unlink(mediapath, (err) => {
                                            if (err) {
                                                console.error(err)
                                                return
                                            }
                                            //file removed
                                        })
                                    }

                                }
                                if (typeof vid_thumbnailpath != undefined && vid_thumbnailpath && vid_thumbnailpath != '') {
                                    if (vid_thumbnailpath !== './public/undefined') {
                                        fs.unlink(vid_thumbnailpath, (err) => {
                                            if (err) {
                                                console.error(err)
                                                return
                                            }
                                            //file removed
                                        })
                                    }

                                }

                                if (typeof aud_thumbnailpath != undefined && aud_thumbnailpath && aud_thumbnailpath != '') {
                                    if (aud_thumbnailpath !== './public/undefined') {
                                        fs.unlink(aud_thumbnailpath, (err) => {
                                            if (err) {
                                                console.error(err)
                                                return
                                            }
                                            //file removed
                                        })
                                    }

                                }

                                if (typeof article_thumbnailpath != undefined && article_thumbnailpath && article_thumbnailpath != '') {
                                    if (article_thumbnailpath !== './public/undefined') {
                                        fs.unlink(article_thumbnailpath, (err) => {
                                            if (err) {
                                                console.error(err)
                                                return
                                            }
                                            //file removed
                                        })
                                    }

                                }
                                res.status(200).json({ message: "File deleted successfully", success: true })
                            } else {
                                res.status(200).json({ message: error.message, success: false })
                            }
                        })
                    }
                })
            } else {
                return res.status(200).json({ message: "You have no super user privileges.", success: false })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


adminController.getPaymentHistoryById = function (req, res, next) {
    try {
        var userid = req.query.userid;
        var adminid = req.payload._id;
        if (adminid) {
            if (typeof userid != 'undefined' && userid && userid != '') {
                Invoice.findOne({ userid: userid }).exec(function (error, rows) {
                    if (error) {
                        res.status(200).json({ status: false, message: error.message })
                    } else {
                        res.status(200).json({ status: true, payment: rows });
                    }
                })
            } else {
                res.status(200).json({ status: false, message: "No User Details Found!" })
            }
        } else {
            res.status(400).json({ message: 'Access denied', access_flag: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get Admin Wallet Details..
adminController.getAdminWalletDetails = function (req, res, next) {
    try {
        Adminwallet.findOne({}).exec(function (walerr, walRes) {
            if (walerr) {
                return res.status(200).json({ status: false, message: walerr.message })
            } else {
                res.status(200).json({ status: true, data: walRes });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


// get all membership plans..
adminController.getAllMembershipPlans = function (req, res, next) {
    try {
        Membership.find({}, { userid: 0, createdAt: 0 }).exec(function (merr, memRes) {
            if (merr) {
                return res.status(200).json({ status: false, message: merr.message })
            } else {
                res.status(200).json({ status: true, plans: memRes });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// user status changed by Deleted....
adminController.deletePlansById = async function (req, res, next) {
    try {
        let { plan, id } = req.query;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof id != 'undefined' && id && id != '' &&
                typeof plan != 'undefined' && plan && plan != '') {
                await Membership.findByIdAndDelete(id).then((result) => {
                    if (result) {
                        console.log(result);
                        res.json({ success: true, message: 'Plan deleted!' })
                    }
                }).catch((error) => {
                    res.status(500).json({ message: error.message, success: false })
                });
            } else {
                res.status(200).json({ success: false, message: "You have no super user privileges." })
            }
        } else {
            res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}


// set main category by admin..
adminController.addcategoryByAdmin = function (req, res, next) {
    try {
        var categoryname = req.body.cat_name;
        var obj = {};
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof categoryname != 'undefined' && categoryname && categoryname != '') {
                category.findOne({ category_name: categoryname.toLowerCase() }).exec(function (err, resuser) {
                    if (err) {
                        res.status(200).json({ message: err, success: false })
                    } else {
                        if (resuser == null) {
                            obj.userid = req.payload._id;
                            obj.category_name = categoryname.toLowerCase();
                            obj.parentId = null;

                            category.create(obj, function (crErr, crRes) {
                                if (crErr) {
                                    res.status(200).json({ message: crErr, success: false })
                                } else {
                                    res.status(200).json({ message: "Add Category Successfully.", success: true })
                                }
                            })
                        }
                        else if (resuser !== null) {
                            res.status(200).json({ message: 'Category Already Exists', success: false })
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


// set main category by admin..
adminController.addsubcategoryByAdmin = function (req, res, next) {
    try {
        var categoryname = req.body.cat_name;
        var sub_catname = req.body.subcat_name;

        var obj = {};
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof categoryname != 'undefined' && categoryname && categoryname != '' &&
                typeof sub_catname != 'undefined' && sub_catname && sub_catname != '') {
                category.findOne({ category_name: categoryname.toLowerCase(), parentId: null }).exec(function (err, resuser) {
                    if (err) {
                        res.status(200).json({ message: err, success: false })
                    } else {
                        if (resuser !== null) {

                            category.findOne({ category_name: categoryname.toLowerCase(), userid: req.payload._id, parentId: resuser._id, subcategory_name: sub_catname.toLowerCase() }).exec(function (caterr, catres) {
                                if (caterr) {
                                    res.status(200).json({ message: caterr, success: false })
                                } else {
                                    if (catres == null) {
                                        obj.userid = req.payload._id;
                                        obj.category_name = categoryname.toLowerCase();
                                        obj.parentId = resuser._id;
                                        obj.subcategory_name = sub_catname.toLowerCase();

                                        category.create(obj, function (crErr, crRes) {
                                            if (crErr) {
                                                res.status(200).json({ message: crErr, success: false });
                                            } else {
                                                res.status(200).json({ message: "Add Sub Category Successfully.", success: true });
                                            }
                                        })
                                    }
                                    else if (catres !== null) {
                                        res.status(200).json({ message: 'Sub Category Already Exists ', success: false })
                                    }
                                }
                            })
                        }
                        else if (resuser == null) {
                            res.status(200).json({ message: 'No Parent Category Found.. ', success: false });
                        }
                    }
                })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


// get All categories
adminController.getCategories = function (req, res) {
    try {
        category.find({}).exec(function (error, rows) {
            var len = rows.length;
            if (error) {
                res.status(200).json({ success: false, message: error.message })
            } else {
                // console.log("rows", rows);

                var parentCat = [];
                var childCat = {};
                var categoryIdList = {};
                // rows.forEach(function (item) {
                //     if (item.parentId === null) {
                //         parentCat.push(item.category_name);
                //     } else {
                //         if (Object.keys(childCat).indexOf(item.category_name.toString()) === -1) {
                //             childCat[item.category_name] = [item.subcategory_name];
                //         } else {
                //             childCat[item.category_name].push(item.subcategory_name);
                //         }
                //     }
                // })
                rows.forEach(function (item) {
                    if (item.parentId === null) {
                        childCat[item.category_name] = [];
                        categoryIdList = {...categoryIdList,[item.category_name]:item._id};
                    } else {
                        // if (Object.keys(childCat).indexOf(item.category_name.toString()) === -1) {
                        //     childCat[item.category_name] = [item.subcategory_name];
                        // } else {
                        //     childCat[item.category_name].push(item.subcategory_name);
                        // }
                        if(Array.isArray(childCat[item.category_name])){
                            childCat[item.category_name].push(item.subcategory_name);
                        }
                    }
                })
                res.status(200).json({ success: true, category: childCat, count: len,categoryIdList:categoryIdList });
            }
        })

    } catch (error) {
        console.log("error", error);

        res.status(500).json({ message: error.message });
    }
}


adminController.deleteCategory = async function (req, res, next) {
    try {
        let { cat_name, subcat_name } = req.body;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof cat_name != 'undefined' && cat_name && cat_name != '' &&
                typeof subcat_name != 'undefined' && subcat_name && subcat_name != '') {
                await category.deleteOne({ category_name: cat_name, subcategory_name: subcat_name }).then((result) => {
                    if (result) {
                        console.log(result);
                        res.json({ success: true, message: 'Category deleted!' })
                    }
                }).catch((error) => {
                    res.status(500).json({ message: error.message, success: false })
                });
            } else {
                res.status(200).json({ success: false, message: "You have no super user privileges." })
            }
        } else {
            res.status(400).json({ success: false, message: "Unauthrozied Access" })
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message })
    }

}
adminController.deleteCategoryById = async function (req, res, next) {
    try {
        let {id } = req.body;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof id != 'undefined') {
                await category.deleteOne({ _id: id}).then((result) => {
                    if (result) {
                        console.log(result);
                        res.json({ success: true, message: 'Category deleted!' })
                    }
                }).catch((error) => {
                    res.status(500).json({ message: error.message, success: false })
                });
            } else {
                res.status(200).json({ success: false, message: "You have no super user privileges." })
            }
        } else {
            res.status(400).json({ success: false, message: "Unauthrozied Access" })
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message })
    }

}

adminController.getCategoriesByUsers = function (req, res) {
    try {
        category.find({}).exec(function (error, rows) {
            var len = rows.length;
            if (error) {
                res.status(200).json({ success: false, message: error.message })
            } else {
                
                var parentCat = [];
                var childCat = {};               
                var categoryIdList = {};               
                rows.forEach(function (item) {
                    console.log(item);
                    if (item.parentId === null) {
                        childCat[item.category_name] = [];
                        categoryIdList[item.category_name] = [];
                        categoryIdList[item.category_name] = item._id;
                    } else {                       
                        if(Array.isArray(childCat[item.category_name])){
                            childCat[item.category_name].push(item.subcategory_name);
                        }
                    }
                })
                res.status(200).json({ success: true, category: childCat,categoryIdList:categoryIdList,count: len });
            }
        })
    } catch (error) {
        console.log("error", error);

        res.status(500).json({ message: error.message });
    }
}
adminController.getCategoryList = function (req, res) {
    try {
        category.find({parentId:null}).exec(function (error, rows) {
            var len = rows.length;
            if (error) {
                res.status(200).json({ success: false, message: error.message })
            } else {
                res.status(200).json({ success: true, categoryList:rows });
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete Comments..
adminController.deleteComments = function (req, res, next) {
    try {
        var id = req.body.id;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof id != 'undefined' && id && id != '') {
                comments.deleteOne({ _id: id }).exec(function (error, result) {
                    if (!error && result) {
                        Report.deleteMany({ comment_id: id }).exec(function (error, result) {
                            if (!error && result) {
                                res.status(200).json({ message: "Comments deleted successfully", success: true })
                            } else {
                                res.status(200).json({ message: error.message, success: false })
                            }
                        })
                        // res.status(200).json({ message: "Comments deleted successfully", success: true })
                    } else {
                        res.status(200).json({ message: error.message, success: false })
                    }
                })
            } else {
                return res.status(200).json({ message: "You have no super user privileges.", success: false })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


adminController.fetchReportedComments = function (req, res) {
    try {
        var user_id = req.payload._id;
        var content_id = req.query.content_id;
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
                    "$lookup": {
                        from: "contentreports",
                        localField: "_id",
                        foreignField: "comment_id",
                        as: "report"
                    }
                },
                {
                    $unwind: "$report"
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "report.reporter_id",
                        foreignField: "_id",
                        as: "reporters"
                    }
                },
                {
                    $unwind: "$reporters"
                },
                {
                    "$project": {
                        'user.fname': 1,
                        'user.lname': 1,
                        'comment': 1,
                        'createdAt': 1,
                        'user.avatar': 1,
                        'report.description': 1,
                        'reporters.fname': 1,
                        'reporters.lname': 1,
                        'reporters.avatar': 1,
                        'report.createdAt': 1,
                        'report._id': 1

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

adminController.deleteReportedComments = function (req, res, next) {
    try {
        var comment_id = req.body.comment_id;
        var report_id = req.body.report_id;

        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof comment_id != 'undefined' && comment_id && comment_id != '') {
                comments.deleteOne({ _id: comment_id }).exec(function (error, result) {
                    if (!error && result) {
                        Report.deleteMany({ comment_id: comment_id }).exec(function (error, result) {
                            if (!error && result) {
                                res.status(200).json({ message: "Comments deleted successfully", success: true })
                            } else {
                                res.status(200).json({ message: error.message, success: false })
                            }
                        })
                    } else {
                        res.status(200).json({ message: error.message, success: false })
                    }
                })
            } else {
                return res.status(200).json({ message: "You have no super user privileges.", success: false })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


adminController.adminReportComment = function (req, res, next) {
    try {
        let comment_id = req.body.comment_id;
         var user_id = req.payload._id;
        var content_id = req.query.conte
        let replay = req.body.text;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof comment_id != 'undefined' && comment_id && comment_id != '') {
                    let obj ={
                        "comment_id":comment_id,
                        "replay":replay,
                        "user_id":user_id
                    };
                    AdminReplay.create(obj, function (crErr, crRes) {
                    if (crErr) {
                        res.status(500).json({
                            message: crErr
                        })
                    } else {
                        return res.status(200).json({ message: "Successfully add comment", success: true })
                    }
                })    
            } else {
                return res.status(200).json({ message: "All field required", success: false })
            }
        } else {
            return res.status(400).json({ message: "Unauthrozied Access" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}



var ctrl = module.exports = adminController;
