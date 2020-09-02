
var elect = require("../others/electrum");
var cron = require('node-cron');
const Invoice = require('../model/invoice');
const Users = require('../model/users');
const BtcPrice = require('../model/btcprice');
const MembershipPlans = require('../model/membershipplans');
const Adminwallet = require('../model/adminwallet');
const socketModel = require('../others/socket');


var electController = {};


electController.listRequest = async function (req, res) {
    try {
        await elect.listRequest().then(list => {
           // console.log("list --------->>>>>>", list);
            if (list.code === 200) {
                res.status(200).json(list);
            } else {
                res.status(500).json({ message: 'Error in list request' });
            }
        }).catch(error => {
            //console.log("error", error)
            res.status(500).json({ message: error });
        })
    } catch (e) {
        //console.log(e)
        res.status(500).json({ message: e.message });
    }
}


electController.addRequest = async function (userid, plan,installmentPlan, callback) {
    try {
        if (typeof userid != 'undefined' && userid && userid != '') {
            MembershipPlans.findOne({ fullplan: plan }).exec(async function (err, btcres) {
                if (err) {
                    callback(err, null);
                } else {
                    if (btcres !== null) {
                        var btcamount = 0;
                        if(installmentPlan){
                             btcamount = (btcres.installmentPlan).toString();   
                        }
                        else {
                            btcamount = (btcres.amount).toString();
                        }
                        //console.log("btcamount", btcamount);
                        await elect.addRequest(btcamount, "Please make the payment below").then(result => {
                            if (result.code === 200) {
                                callback(null, result.result);
                            } else {
                                callback('Error in Add Request', null);
                            }
                        }).catch(error => {
                            callback(error, null);
                        });
                    }
                }
            })

        } else {
            callback('User not Found..', null);
        }
    } catch (e) {
        console.log(e)
        callback(e.message, null);
        // res.status(500).json({ message: e.message });
    }
}

electController.addRequestRenew = async function (userid, plan, callback) {
    try {
        if (typeof userid != 'undefined' && userid && userid != '') {
            MembershipPlans.findOne({ fullplan: plan }).exec(async function (err, btcres) {
                if (err) {
                    callback(err, null);
                } else {
                    if (btcres !== null) {
                        var btcamount = (btcres.amount).toString();
                        //console.log("btcamount", btcamount);


                        await elect.addRequest(btcamount, "MTA Renew Plan").then(result => {
                            //console.log("result --------->>>>>>", result);
                            if (result.code === 200) {
                                callback(null, result.result);
                                // res.status(200).json(result);
                            } else {
                                callback('Error in Add Request', null);
                                // res.status(500).json({ message: 'Error in Add Request' });
                            }
                        }).catch(error => {
                            //console.log("error", error)
                            callback(error, null);
                            // res.status(500).json({ message: error });
                        })
                    }
                }
            })

        } else {
            callback('User not Found..', null);
        }
    } catch (e) {
       // console.log(e)
        callback(e.message, null);
        // res.status(500).json({ message: e.message });
    }
}
electController.getTranstionDetails = async function (address) {
   // console.log("getTranstionDetails call");
    await elect.getTranstionDetails(address).then(list => {
        console.log("details listing",list);
    });
}



electController.getRequest = async function (req, res) {
    try {
        Invoice.find({ status: "Pending" }).exec(function (infindError, infindUser) {
            if (infindError) {
               // console.log("admin get Request 77", infindError)
                // res.status(200).json({
                //     message: infindError,
                //     status: false
                // });
            }
            else {
                if (infindUser.length > 0) {
                    infindUser.forEach(async function (item) {
                        var address = item.address;
                        var userid = item.userid;
                        await elect.getRequest(address).then(list => {
                           // console.log(item);
                            if (list.code === 200) {
                                // if(list.result.status=="Pending"){
                                //     console.log("Address",address);
                                // }
                                if (list.result.status === "Paid") {   
                                // console.log("=============================");
                                // console.log("Request status",address);
                                // console.log("=============================");  
                                //     console.log(list.result);                                
                                //     console.log("Paid");
                                    Invoice.update({ address: address }, { status: "Paid", payment_date: Date.now() }).exec(async function (error, updatedrow) {
                                        if (error) {
                                            res.status(200).json({ message: error.message, success: false })
                                        } else {
                                               console.log("userid",userid);
                                            socketModel.PaymetSuccess(updatedrow, userid);
                                           
                                            await Users.update({ _id: userid }, { email_verified: 1, payment_verified: 1, membership_time: Date.now() }).exec(async function (error, uprows) {
                                                if (error) {
                                                    res.status(500).json({ message: "Internal Server Error" })
                                                } else {
                                                    console.log("user update",userid);
                                                    await Users.findOne({ _id: userid }).exec(async function (err, userDetails) {
                                                        if (err) {
                                                            console.log("error in user findone 343 ", err);
                                                        } else {
                                                        	console.log("membershipplans time ",userDetails.membership_time);
                                                            if (userDetails !== null) {
                                                                console.log("user details",userDetails);
                                                                let expiryDate;
                                                                let currentDate = userDetails.membership_time;
                                                                let duration = userDetails.newsletter;
                                                                if(userDetails.installmentPlan){
                                                                    let dateInFormat = new Date(currentDate);
                                                                    expiryDate = dateInFormat.setDate(dateInFormat.getDate() + 30);
                                                                    console.log("installment month current Date",expiryDate);
                                                                    let numberOfInstallmentPlan = 0;
                                                                    if(userDetails.numberOfInstallmentPlan){
                                                                        numberOfInstallmentPlan = Number(userDetails.numberOfInstallmentPlan) + 1;   
                                                                    }
                                                                    else{
                                                                        numberOfInstallmentPlan = 1;
                                                                    }
                                                                    //let numberOfInstallmentPlan = user.numberOfInstallmentPlan + 1;
                                                                    await Users.update({ _id: userid }, { expiry_date: expiryDate,numberOfInstallmentPlan:numberOfInstallmentPlan }).exec(async function (error, userupdate) {
                                                                        if (error) {
                                                                            console.log("install plan user month ",error);
                                                                        } 
                                                                    });
                                                                }
                                                                else{
                                                                    var dateInFormat = new Date(currentDate);
                                                                    expiryDate = dateInFormat.setDate(dateInFormat.getDate() + 90);
                                                                    console.log("installment 3 month current Date",expiryDate);
                                                                    await Users.update({ _id: userid }, { expiry_date: expiryDate,installmentPlan:false,numberOfInstallmentPlan:0}).exec(async function (error, userupdate) {
                                                                        if (error) {
                                                                            console.log("installment plan user 3 month update",error);
                                                                        } 
                                                                    });
                                                                }
                                                                await Invoice.update({ userid: userid , address: address }, { expiry_date: expiryDate }).exec(async function (error, invoiceupdate) {
                                                                    if (error) {
                                                                        console.log("Update invoice",error);
                                                                    } 
                                                                });

                                                               

                                                               /* if (duration !== 'Lifetime Membership') {
                                                                    var durationarray = duration.split(" ");
                                                                    var value = durationarray[0]
                                                                    var scheme = durationarray[1]
                                                                    var dateInFormat = new Date(currentDate);
                                                                    var currentEpoch = dateInFormat.getTime();
                                                                    if (scheme == 'Day') {
                                                                        expiryDate = dateInFormat.setDate(dateInFormat.getDate() + parseInt(value))
                                                                    }
                                                                    if (scheme == 'Month') {
                                                                        expiryDate = dateInFormat.setMonth(dateInFormat.getMonth() + parseInt(value))
                                                                    }
                                                                    if (scheme == 'Year') {
                                                                        expiryDate = dateInFormat.setFullYear(dateInFormat.getFullYear() + parseInt(value))
                                                                    }
                                                                }
                                                                else if (duration === 'Lifetime Membership') {
                                                                    expiryDate = '';
                                                                }
                                                                await Users.update({ _id: userid }, { expiry_date: expiryDate }).exec(async function (error, userupdate) {
                                                                    if (error) {
                                                                    } else {
                                                                    }
                                                                })
                                                                await Invoice.update({ userid: userid , address: address }, { expiry_date: expiryDate }).exec(async function (error, invoiceupdate) {
                                                                    if (error) {
                                                                    } else {
                                                                    }
                                                                });*/
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                res.status(500).json({ message: 'Error in list request' });
                            }
                        }).catch(error => {
                            //console.log(error);
                            //return false;
                            //res.status(500).json({ message: error });
                        });
                    });
                }
            }
        });
    } catch (e) {
        console.log("admin get Request 134", e);        
    }
}

electController.adminWalletBalance = async function (req, res) {
    try {
        Users.findOne({ group: 'superadmin' }).exec(function (err, admin) {
            if (err) {
                // res.status(500).json({message: err })
               // console.log("admin Wallet Balance 145", err)
            } else {
                if (admin !== null) {
                    var userid = admin._id;

                    Adminwallet.findOne({ userid: userid }).exec(async function (walfindError, walfindRes) {
                        if (walfindError) {
                         //   console.log("admin Wallet Balance 152", walfindError)

                            // res.status(200).json({
                            //     message: walfindError,
                            //     status: false
                            // });
                        }
                        else {
                            var obj = {};
                            await elect.getBalance().then(async (list) => {
                                // console.log("list getBalance--------->>>>>>", list);
                                if (list.code === 200) {
                                    if (walfindRes == null) {
                                        await elect.createNewAddress().then(newaddress => {
                                           // console.log("newaddress createNewAddress--------->>>>>>", newaddress);
                                            if (list.code === 200) {
                                                obj.userid = userid;
                                                obj.address = newaddress.result;
                                                obj.confirmed_balance = list.result.confirmed;
                                                if (list.result.unconfirmed && list.result.unconfirmed !== null) {
                                                    obj.unconfirmed_balance = list.result.unconfirmed;
                                                }
                                                Adminwallet.create(obj, function (crErr, crRes) {
                                                    if (crErr) {
                                                     //   console.log("admin Wallet Balance 176", crErr)

                                                        // res.status(200).json({
                                                        //     message: crErr, success: false
                                                        // })
                                                    } else {
                                                       // console.log("Balance Created ");
                                                    }
                                                })
                                            }
                                        }).catch(error => {
                                          //  console.log(" admin Wallet Balance 187 error", error)
                                            // res.status(500).json({ message: error });
                                        })

                                    } else if (walfindRes !== null) {
                                        var unconf_bal = '';
                                        if (list.result.unconfirmed && list.result.unconfirmed !== null) {
                                            unconf_bal = list.result.unconfirmed;
                                        }
                                        else {
                                            unconf_bal = 0;
                                        }
                                        Adminwallet.update({ userid: userid }, { confirmed_balance: list.result.confirmed, unconfirmed_balance: unconf_bal }).exec(function (error, uprows) {
                                            if (error) {
                                              //  console.log("admin Wallet Balance 201", error.message)
                                                // res.status(200).json({ message: error.message, success: false })
                                            } else {
                                                // console.log("Balance Updated.. ");
                                            }
                                        })
                                    }
                                }
                                else {
                                    //console.log("admin Wallet Balance 210")
                                    // res.status(500).json({ message: 'Error in getBalance' });
                                }
                            }).catch(error => {
                                // console.log("adminWalletBalance error 214", error)
                                // res.status(500).json({ message: error });
                            })

                        }
                    })
                }
            }
        })

    } catch (e) {
       // console.log("admin Wallet Balance 225", e)
        // res.status(500).json({ message: e.message });
    }
}
electController.CreateNewAddress = async function (req, res) {
    try {
        await elect.createNewAddress().then(list => {
           // console.log("list createNewAddress--------->>>>>>", list);
            if (list.code === 200) {

                Users.findOne({ group: 'superadmin' }).exec(function (err, admin) {
                    if (err) {
                        res.status(500).json({
                            message: err
                        })
                    } else {
                        if (admin !== null) {
                            var userid = admin._id;
                            Adminwallet.update({ userid: userid }, { address: list.result }).exec(function (error, uprows) {
                                if (error) {
                                    res.status(200).json({ message: error.message, success: false })
                                } else {
                                    res.status(200).json({ addess: list.result, success: true, message: 'New Address Generated' });
                                }
                            })
                        }
                    }
                })
            } else {
                res.status(500).json({ message: 'Error in New Address Creation' });
            }
        }).catch(error => {
            console.log("error", error)
            res.status(500).json({ message: error });
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message });
    }
}
electController.renewPlanRequest = async function (selectedPlanId, callback) {    
    try
    {
        MembershipPlans.findOne({ fullplan: selectedPlanId }).exec(async function (err, btcres) {
            if (err) {
                callback(err, null);
            } else {
                if (btcres !== null) {
                    var btcamount = (btcres.installmentPlan).toString();   
                    console.log(btcamount);
                    await elect.addRequest(btcamount, "MTA Payment").then(result => {
                        if (result.code === 200) {
                            callback(null, result.result,btcres.fullplan);
                        } else {
                            callback('Error in Add Request', null,null);
                        }
                    }).catch(error => {
                        callback(error, null);
                    });
                }
            }
        });
    }
    catch(e){
        res.status(500).json({ message: e.message });
    }
}


cron.schedule('*/5 * * * * *', async (req, res, next) => {
    try {
        ctrl.getRequest();
        ctrl.adminWalletBalance();
    } catch (e) {
        console.log("Cron Error" + e);
    }
});


var ctrl = module.exports = electController;
