'use strict';
// const BitMEXClient = require('../others/bitmexIndex');
const util = require('util');
const socketModel = require('../others/socket');
var Request = require("request");
const crypto = require("crypto");


var bitmexController = {};


bitmexController.getAdminBitmexAccount = function (req, res, next) {
    console.log("Demo123");
    const BitMEXClient = require('../others/bitmexIndex');

  
    const client = new BitMEXClient(
    {
        testnet: false,
        apiKeyID: "",
        apiKeySecret: ""
    });
 

    client.on('error', console.error);
    client.on('open', () => console.log('Connection opened.'));
    client.on('close', () => console.log('Connection closed.'));
    client.on('initialize', () => console.log('Client initialized, data is flowing.'));


    client.addStream('*', 'margin', function (data, symbol, table) {
        // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
        if (data && data.length > 0 && data[0].currentQty != 0) {
            // console.log("----- POZ data -------");
            // console.log(util.inspect(data, false, null));
            // console.log("----- POZ data -------");
            socketModel.BitmexMargin(data);
        }
    });
    client.addStream('*', 'position', function (data, symbol, table) {
        // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
        if (data && data.length > 0 && data[0].currentQty != 0) {
            // console.log("----- POZ data -------");
            // console.log(util.inspect(data, false, null));
            // console.log("----- POZ data -------");
            socketModel.BitmexPosition(data);
        }
    });

    client.addStream('*', 'order', function (data, symbol, table) {
        // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
        if (data && data.length > 0 && data[0].currentQty != 0) {
            // console.log("----- POZ data -------");
            // console.log(util.inspect(data, false, null));
            // console.log("----- POZ data -------");
            socketModel.BitmexOrders(data);
        }
    });

    client.addStream('*', 'instrument', function (data, symbol, table) {
        // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
        if (data && data.length > 0 && data[0].currentQty != 0) {
            // console.log("----- POZ data -------");
            // console.log(util.inspect(data, false, null));
            // console.log("----- POZ data -------");
            socketModel.BitmexInstrument(data);
        }
    });

    client.addStream('*', 'wallet', function (data, symbol, table) {
        // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
        if (data && data.length > 0 && data[0].currentQty != 0) {
            // console.log("----- POZ data -------");
            // console.log(util.inspect(data, false, null));
            // console.log("----- POZ data -------");
            // socketModel.BitmexMargin(data); 
        }
    });

    res.status(200).json({ success: true });
}


// bitmexController.getPosition = function (req, res, next) {
//     client.addStream('*', 'position', function (data, symbol, table) {
//         console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//         if (data && data.length > 0 && data[0].currentQty != 0) {
//             console.log("----- POZ data -------");
//             console.log(util.inspect(data, false, null));
//             console.log("----- POZ data -------");
//         }
//     });
// }

// bitmexController.getMargin = function (req, res, next) {
//     client.addStream('*', 'margin', function (data, symbol, table) {
//         // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//         if (data && data.length > 0 && data[0].currentQty != 0) {
//             console.log("hello 11111111111 ========>>>>>>>>" );
//             // console.log("----- POZ data -------");
//             // console.log(util.inspect(data, false, null));
//             // console.log("----- POZ data -------");
//             socketModel.BitmexMargin(data);
//             // res.status(200).json(data);
//         }
//     });
// }

// client.addStream('*', 'margin', function (data, symbol, table) {
//     console.log("client===========>>>>>>>>>>>>>", client);

//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         socketModel.BitmexMargin(data);
//     }
// });
// client.addStream('*', 'position', function (data, symbol, table) {
//     // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         socketModel.BitmexPosition(data);
//     }
// });

// client.addStream('*', 'order', function (data, symbol, table) {
//     // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         socketModel.BitmexOrders(data);
//     }
// });

// client.addStream('*', 'instrument', function (data, symbol, table) {
//     // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         socketModel.BitmexInstrument(data);
//     }
// });

// client.addStream('*', 'wallet', function (data, symbol, table) {
//     // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         // socketModel.BitmexMargin(data); 
//     }
// });

// client.addStream('XBTUSD', 'tradeBin1m', function (data, symbol, table) {
//     // console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         socketModel.BitmexTrade(data); 
//     }
// });

// bitmexController.getAllSymbols = function (req, res, next) {

//   client.addStream('*', 'orderBookL2', function (data, symbol, table) {
//     console.log(symbol);
//     var arr = [];
//     arr.push(symbol);
//     // console.log("arr", arr);

//     var uniqueArray = [];
//     var setUnique = new Set(arr)
//     console.log("///////////////////",setUnique)
//     // arr.forEach(function (element) {
//     //   if (uniqueArray.indexOf(element) == -1) {
//     //     uniqueArray.push(element);
//     //   }
//     // })
//     console.log("uniqueArray", uniqueArray);
//   })
// }


// client.addStream('XBTUSD', 'instrument', function(data, symbol, tableName) {
//   console.log(`Got update for ${tableName}:${symbol}. Current state:\n${JSON.stringify(data).slice(0, 100)}...`);
//   // Do something with the table data...
// });


// client.addStream('XBTUSD', 'quote', function(data, symbol, table) {
//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//   });

// client.addStream('XBTUSD', 'trade', function(data, symbol, table) {
//   console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
// });

// client.addStream('XBTUSD', 'wallet', function (data, symbol, table) {
//   console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
// });

// client.addStream('XBTUSD', 'order', function(data, symbol, table) {
//   console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
// });

// client.addStream('XBTUSD', 'trade', () => {});
// setTimeout(() => {
//   console.log('XBTUSD trades during the last few seconds:', client.getTable('trade').XBTUSD);
// }, 5000);

// client.addStream('*', 'instrument', function(data, symbol, table) {
//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//   });

// client.addStream('*', 'position', function(data, symbol, table) {
//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//   });

// client.addStream('*', 'schema', function(data, symbol, table) {
//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//   });

// announcement, connected, chat, publicNotifications, instrument,
// settlement, funding, insurance, liquidation, orderBookL2, orderBookL2_25,
// orderBook10, quote, trade, quoteBin1m, quoteBin5m, quoteBin1h, quoteBin1d,
// tradeBin1m, tradeBin5m, tradeBin1h, tradeBin1d, privateNotifications,
// account, wallet, affiliate, margin, position, transact, order, execution.


// client.addStream('*', 'publicNotifications', function (data, symbol, table) {
//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         // socketModel.BitmexMargin(data); 
//     }
// });

// client.addStream('*', 'privateNotifications', function (data, symbol, table) {
//     console.log('Update on ' + table + ':' + symbol + '. New data:\n', data, '\n');
//     if (data && data.length > 0 && data[0].currentQty != 0) {
//         // console.log("----- POZ data -------");
//         // console.log(util.inspect(data, false, null));
//         // console.log("----- POZ data -------");
//         // socketModel.BitmexMargin(data); 
//     }
// });



var ctrl = module.exports = bitmexController;
