const Settings = require('../model/mediasettings');


var mediaController = {};

mediaController.getCSRF = function (req, res, next) {
    var csrf = req.csrfToken();
    // console.log("csrf", csrf)

    res.status(200).json({ _csrf: csrf });
}

// Api to fetch media validations 
mediaController.getMediaValidations = function (req, res) {
    try{
        var userid = req.payload._id;
        if(userid){
            Settings.findOne().exec(function(error, validations){
                if(!error && validations && validations !== null){
                    res.status(200).json(validations);
                }else {
                    res.status(500).json({message: 'Internal server error'});
                }
            })
        }

    }catch(e){ console.log(e)
        res.status(500).json({ message: e.message });
    }
}

mediaController.addMediaValidations = function (req, res, next) {

    Settings.findOne({}).exec(function (err, resuser) {
        if (err) {
            res.status(500).json({
                message: err
            })
        } else {
            if (resuser === null) {
                var obj = [{ "audio_duration": 1200 } ]
                Settings.create(obj, function (crErr, crRes) {
                    if (crErr) {
                        res.status(500).json({
                            message: crErr
                        })
                    } else {
                        console.log("Done Settings")
                        /*res.status(200).json(
                            {
                                message:"Done Group",
                                response:crRes
                            }
                        )*/
                    }
                })
            } else {
                console.log("Settings already Exist")
                /*res.status(500).json({
                    message:"Action already Exits"
                })*/
            }
        }
    })
}


var ctrl = module.exports = mediaController;
