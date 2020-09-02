'use strict';
const util = require('util');
const socketModel = require('../others/socket');
var apiKey = "";
var apiSecret = "";
// See 'options' reference below



var bitmexController = {};


// bitmexController.getOrderBook = function (req, res, next) {

//     client.addStream('XBTUSD', 'instrument', function (data, symbol, table) {
//         console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     });
//     //   res.status(200).json({ _csrf: csrf });
// }

bitmexController.getUserData = function (req, res, next) {
    // console.log("req.payload======>>>>>>>>>>>>>>>", req.payload);

    var userid = req.payload._id;

    if (typeof userid != 'undefined' && userid && userid != '') {
        Users.findOne({ _id: userid, group: 'customer' }, { salt: 0, password: 0 }).exec(function (err, resuser) {
            // console.log("resuser==========>>>>>>>", resuser);

            if (err) {
                res.status(200).json({ message: err, success: false })
            } else {
                if (resuser !== null) {
                    if (resuser.api_key_status) {

                        apiKey = resuser.api_key_id;
                        apiSecret = resuser.api_key_secret;

                        const BitMEXClient = require('../others/bitmexIndex');

                        // client.testnet = true;
                        // client.apiKeyID = apiKey;
                        // client.apiKeySecret = apiSecret;

                        const client = new BitMEXClient(
                            {
                                testnet: true,
                                apiKeyID: apiKey,
                                apiKeySecret: apiSecret
                            });

                        client.on('error', console.error);
                        client.on('open', () => console.log('Connection opened.'));
                        client.on('close', () => console.log('Connection closed.'));
                        client.on('initialize', () => console.log('Client initialized, data is flowing.'));

                        client.addStream('*', 'wallet', function (data, symbol, table) {
                            // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
                            if (data && data.length > 0 && data[0].currentQty != 0) {
                                // console.log("----- POZ data -------");
                                // console.log(util.inspect(data, false, null));
                                // console.log("----- POZ data -------");
                                // socketModel.BitmexMargin(data); 
                            }
                        });

                        client.addStream('*', 'margin', function (data, symbol, table) {
                            // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
                            if (data && data.length > 0 && data[0].currentQty != 0) {
                                // console.log("----- POZ data -------");
                                // console.log(util.inspect(data, false, null));
                                // console.log("----- POZ data -------");
                                socketModel.BitmexMarginUser(data, userid);
                            }
                        });
                        client.addStream('*', 'position', function (data, symbol, table) {
                            // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
                            if (data && data.length > 0 && data[0].currentQty != 0) {
                                // console.log("----- POZ data -------");
                                // console.log(util.inspect(data, false, null));
                                // console.log("----- POZ data -------");
                                socketModel.BitmexPositionUser(data, userid);
                            }
                        });

                        client.addStream('*', 'order', function (data, symbol, table) {
                            // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
                            if (data && data.length > 0 && data[0].currentQty != 0) {
                                // console.log("----- POZ data -------");
                                // console.log(util.inspect(data, false, null));
                                // console.log("----- POZ data -------");
                                socketModel.BitmexOrdersUser(data, userid);
                            }
                        });

                        client.addStream('*', 'instrument', function (data, symbol, table) {
                            // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
                            if (data && data.length > 0 && data[0].currentQty != 0) {
                                // console.log("----- POZ data -------");
                                // console.log(util.inspect(data, false, null));
                                // console.log("----- POZ data -------");
                                socketModel.BitmexInstrumentUser(data, userid);
                            }
                        });

                        res.status(200).json({ success: true, userid: userid })
                    }
                }
            }
        })
    }

    //   res.status(200).json({ _csrf: csrf });
}







var ctrl = module.exports = bitmexController;
