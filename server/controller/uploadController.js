var shell = require('shelljs');
var fs = require("fs");
var multer = require('multer');
var pathmodule = require('path');
// var ffmpeg = require('ffmpeg');
// var exec = require('child_process').exec;
const content = require('../model/content');
const ImageSupported = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
const VideoSupported = ['.3g2', '.3gp', '.3gpp', '.asf', '.avi ', '.dat', '.divx', '.dv', '.f4v', '.flv', '.m2ts', '.m4v', '.mkv',
    '.mod', '.mov', '.mp4', '.mpe', '.mpeg ', '.mpeg4', '.mpg', '.mts', '.nsv', '.ogm', '.ogv ', '.qt', '.tod', '.ts', '.vob', '.wmv'];
const AudioSupported = ['.mp3', '.wav', '.wma', '.aac', '.m4a', '.ogg', '.MP3', '.WAV', '.WMA', '.AAC', '.M4A', '.OGG'];

var uploadController = {};

// Multer storage define for-imagePost
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // var dir = process.env.KYCDOCURL + req.payload._id
        var dir = "./public/uploads/admincontent/imageUpload";
        if (!fs.existsSync(dir)) {
            shell.mkdir('-p', dir);
        }
        cb(null, "./public/uploads/admincontent/imageUpload"); // where to store it
    },
    filename: function (req, file, cb) {
        if (file.fileSize) {
            var err = new Error();
            return cb(err);
        }
        else if (!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg|mp4|webm|mkv|wmv)$/)) {
            var err = new Error();
            err.code = 'filetype'; // to check on file type
            return cb(err, null);
        } else {
            var date = new Date();
            var timeStamp = date.getTime();
            var name = file.originalname.toLowerCase();
            var ext = name.substr(file.originalname.lastIndexOf('.') + 1)
            var rename = timeStamp + "." + ext;
            cb(null, rename);
        }
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 110000000 }
}).any();


var storageArticle = multer.diskStorage({
    destination: function (req, file, cb) {
        // var dir = process.env.KYCDOCURL + req.payload._id
        var dir = "./public/uploads/admincontent/imageUpload";
        if (!fs.existsSync(dir)) {
            shell.mkdir('-p', dir);
        }
        cb(null, "./public/uploads/admincontent/imageUpload"); // where to store it
    },
    filename: function (req, file, cb) {
        if (file.fileSize) {
            var err = new Error();
            return cb(err);
        }
        else if (!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg|mp4|webm|mkv|wmv)$/)) {
            var err = new Error();
            err.code = 'filetype'; // to check on file type
            return cb(err, null);
        } else {
            // var date = new Date();
            // var timeStamp = date.getTime();
            var name = file.originalname.toLowerCase();
            // var ext = name.substr(file.originalname.lastIndexOf('.') + 1)
            // var rename = timeStamp + "." + ext;
            cb(null, name);
        }
    }
});

var uploadArtImg = multer({
    dest: './public/uploads/admincontent/imageUpload',
    storage: storageArticle,
}).single('UploadFiles');


// multer configuration for audio uploads in album
var storageAudio = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = "./public/uploads/admincontent/audio_files";
        if (!fs.existsSync(dir)) {
            shell.mkdir('-p', dir);
        }
        cb(null, dir); // where to store it
    },
    filename: function (req, file, cb) {
        if (file.fileSize) {
            var err = new Error();
            return cb(err);
        }
        else if (!file.originalname.toLowerCase().match(/\.(wav|wma|aac|mp3|mid|png|jpg|jpeg|)$/)) {
            var err = new Error();
            err.code = 'filetype'; // to check on file type
            return cb(err, null);
        } else {
            var name = file.originalname.toLowerCase();
            var ext = name.substr(file.originalname.lastIndexOf('.') + 1)
            var rename = Date.now() + '.' + ext;
            cb(null, rename);
        }
    }
});

// multer configuration for bundle files
var uploadAudio = multer({
    storage: storageAudio,
    limits: { fileSize: 2147483648 } // Max file size: 2GB 
}).any();


// multer configuration for audio uploads in album
var storageThumbnail = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = "./public/uploads/admincontent/imageUpload";
        if (!fs.existsSync(dir)) {
            shell.mkdir('-p', dir);
        }
        cb(null, dir); // where to store it
    },
    filename: function (req, file, cb) {
        if (file.fileSize) {
            var err = new Error();
            return cb(err);
        }
        else if (!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg|)$/)) {
            var err = new Error();
            err.code = 'filetype'; // to check on file type
            return cb(err, null);
        } else {
            var name = file.originalname.toLowerCase();
            var ext = name.substr(file.originalname.lastIndexOf('.') + 1)
            var rename = Date.now() + '.' + ext;
            cb(null, rename);
        }
    }
});

// multer configuration for bundle files
var uploadThumbnail = multer({
    storage: storageThumbnail,
    limits: { fileSize: 2147483648 } // Max file size: 2GB 
}).any();

// Api to upload file before submiting bundle, and start seeding once uploaded done.
uploadController.soloUploadVideo = async function (req, res) {
    await upload(req, res, function (err) {
        if (err) {
            console.log("err --------------->>>>>>>>>>", err);

            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(200).json({ message: 'File size is too large.' });
            } else if (err.code === 'filetype') {
                res.status(200).json({ message: 'File type is invalid. Only accepted .png/.jpg/.jpeg/.svg .' });
            } else {
                console.log(err);
                res.status(200).json({ message: 'File was not able to be uploaded' });
            }
        } else {
            var mediaObj = {};
            mediaObj.userid = req.payload._id
            var obj = req.files[0];
            var string = obj.path + "";
            var path = string.replace('public/', '');
            mediaObj.media_path = path;
            filename = obj.originalname
            mediaObj.media_name = filename.substring(0, filename.lastIndexOf("."));
            if (obj.filename.toLowerCase().match(/\.(mp4|mkv|webm|wmv)$/)) {
                mediaObj.type = 'video'
            }
            var mediapath = "./public/" + mediaObj.media_path;
            fs.unlink(mediapath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                //file removed
            })
            res.status(200).json({ name: mediaObj.media_name, type: mediaObj.type });
        }
    })
}


// Api to upload file before submiting bundle, and start seeding once uploaded done.
uploadController.soloUploadAudio = async function (req, res) {
    try {
        // multer's method to allow file upload and body parse
        await uploadAudio(req, res, function (err) {
            if (err) {
                //shell.rm('-rf', "./public/upload/profile_pictures/" + req.payload._id + '/*');
                if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).json({ message: 'File size is too large.' });
                } else if (err.code === 'fieltype') {
                    res.status(400).json({ message: 'File type is invalid. Only accepted .png/.jpg/.jpeg/.svg .' });
                } else {
                    console.log(err);
                    res.status(400).json({ message: 'File was not able to be uploaded' });
                }
            } else {
                var mediaObj = {};
                mediaObj.userid = req.payload._id
                var obj = req.files[0];
                var string = obj.path + "";
                var path = string.replace('public/', '');
                mediaObj.media_path = path;
                filename = obj.originalname
                mediaObj.media_name = filename.substring(0, filename.lastIndexOf("."));
                if (obj.filename.toLowerCase().match(/\.(mp3|wav|wma|aac)$/)) {
                    mediaObj.type = 'audio'
                }
                var mediapath = "./public/" + mediaObj.media_path;
                fs.unlink(mediapath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //file removed
                })
                res.status(200).json({ name: mediaObj.media_name, type: mediaObj.type });

            }
        })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}



uploadController.adminUploadsImage = function (req, res, next) {
    console.log("Demo");
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
            upload(req, res, function (err) {
                if (err) {
                    throw err;
                }
                else {
                    var userid = req.payload._id;
                    var filesArr = req.files;
                    var image_title = req.body.title;
                    var profileObj = {};
                    var errorObj = {};

                    if (typeof userid !== 'undefined' && userid && userid !== '') {
                        profileObj.userid = userid;
                        if (filesArr.length > 0) {

                            var contentObj = [];
                            filesArr.forEach(function (file) {

                                var path = file.path.replace("public", '').substr(1);
                                var ext = pathmodule.extname(path).toString();
                                var type = '';
                                var privacy = '';
                                var title = req.body.title;
                                var thumbnail = '';
                                var filename = file.originalname;

                                if (filesArr.length === 1) {
                                    if (ImageSupported.indexOf(ext) !== -1) {
                                        type = 'Image'
                                        image_title = req.body.title;
                                    }
                                } else if (filesArr.length === 2) {
                                    if (ImageSupported.indexOf(ext) !== -1) {
                                        type = 'Thumbnail'
                                        title = req.body.title
                                        thumbnail = file.filename;
                                    }

                                }
                                // if (ImageSupported.indexOf(ext) !== -1) {
                                //     type = 'Image'
                                // }
                                if (VideoSupported.indexOf(ext) !== -1) {
                                    type = 'Video'
                                    privacy = req.body.privacy
                                    title = req.body.title
                                    // contentObj.video_thumbnail = thumbnail
                                }

                                contentObj.push({
                                    content_url: path,
                                    contenttype: type,
                                    userid: userid,
                                    filename: filename,
                                    video_privacy: privacy,
                                    video_title: title,
                                    image_title: image_title,
                                    video_thumbnail: thumbnail
                                });
                            });
                            content.create(contentObj, function (error, conRes) {

                                if (error) {
                                    res.status(200).json({ message: error });
                                }
                                else {
                                    var vidoId = '';
                                    var thumbId = '';
                                    var thumbPath = '';
                                    if (conRes.length > 1) {
                                        if (conRes[0].contenttype == 'Video') {
                                            vidoId = conRes[0]._id;
                                        } else if (conRes[1].contenttype == 'Video') {
                                            vidoId = conRes[1]._id;
                                        }

                                        if (conRes[0].contenttype == 'Thumbnail') {
                                            thumbId = conRes[0]._id;
                                            thumbPath = conRes[0].content_url;
                                        } else if (conRes[1].contenttype == 'Thumbnail') {
                                            thumbId = conRes[1]._id;
                                            thumbPath = conRes[1].content_url;
                                        }
                                        content.findOneAndUpdate({ _id: vidoId }, { video_thumbnail_id: thumbId, video_thumbnail: thumbPath }).exec(function (error, rows) {
                                            if (error) {
                                                res.status(200).json({ success: false, message: error.message });
                                            } else {
                                                res.status(200).json({ message: 'content updated successfully', success: true })
                                            }
                                        })
                                    } else {
                                        res.status(200).json({ message: 'content updated successfully.' });
                                    }
                                }
                            })
                        }
                        else {
                            res.status(200).json({ message: 'Files not found..' });
                        }
                    }
                    else {
                        res.status(200).json({ message: errorObj });
                    }
                }
            });
        }
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}

uploadController.adminUploads = function (req, res, next) {
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
                let userid = req.payload._id;
                let videofilename = req.body.videofilename;
                let radiobtn = req.body.radiobtn;
                let title = req.body.title;
                let contentObj = [];
                if (videofilename !== '' && radiobtn!=="" && title!=="") {
                    contentObj.push({
                        content_url: videofilename,
                        contenttype: "Video",
                        userid: userid,
                        filename: videofilename,
                        video_privacy: radiobtn,
                        video_title: title,
                        audio_thumbnail: ""
                    });
                    content.create(contentObj, function (error, conRes) {
                        if (error) {
                            res.status(200).json({ message: error });
                        }
                        else 
                        {                  
                            res.status(200).json({success:true,message: 'content updated successfully.' });
                        }                
                    });            
                }
                else{
                    res.status(200).json({success:false,message: 'Please fill all details' });
                }
            }
            else{
                 res.status(400).json({ message: 'Access denied', access_flag: false });
            }
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}


// admin Uploads
uploadController.adminAudioUpload = function (req, res, next) {
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
            uploadAudio(req, res, function (err) {
                if (err) {
                    console.log("err====>>>", err);
                    throw err;
                }
                else {
                    var userid = req.payload._id;
                    var filesArr = req.files;
                    var profileObj = {};
                    var errorObj = {};

                    if (typeof userid !== 'undefined' && userid && userid !== '') {
                        profileObj.userid = userid;
                        if (filesArr.length > 0) {

                            var contentObj = [];
                            filesArr.forEach(function (file) {
                                var path = file.path.replace("public", '').substr(1);
                                var ext = pathmodule.extname(path).toString();
                                var type = '';
                                var privacy = '';
                                var title = '';
                                var thumbnail = '';
                                var filename = file.originalname;

                                // if (filesArr.length === 1) {
                                //     if (ImageSupported.indexOf(ext) !== -1) {
                                //         type = 'Image'
                                //     }
                                // } else if (filesArr.length === 2) {
                                //     if (ImageSupported.indexOf(ext) !== -1) {
                                //         type = 'Thumbnail'
                                //         title = req.body.title
                                //         thumbnail = file.filename;
                                //     }
                                // }

                                if (ImageSupported.indexOf(ext) !== -1) {
                                    type = 'Thumbnail'
                                    title = req.body.title
                                    thumbnail = file.filename;
                                }
                                if (AudioSupported.indexOf(ext) !== -1) {
                                    type = 'Audio'
                                    privacy = req.body.privacy
                                    title = req.body.title
                                    // contentObj.video_thumbnail = thumbnail
                                }

                                contentObj.push({
                                    content_url: path,
                                    contenttype: type,
                                    userid: userid,
                                    filename: filename,
                                    audio_privacy: privacy,
                                    audio_title: title,
                                    audio_thumbnail: thumbnail
                                });
                            });
                            content.create(contentObj, function (error, conRes) {
                                if (error) {
                                    res.status(200).json({ message: error });
                                }
                                else {
                                    var vidoId = '';
                                    var thumbId = '';
                                    var thumbPath = '';
                                    if (conRes.length > 1) {
                                        if (conRes[0].contenttype == 'Audio') {
                                            vidoId = conRes[0]._id;
                                        } else if (conRes[1].contenttype == 'Audio') {
                                            vidoId = conRes[1]._id;
                                        }

                                        if (conRes[0].contenttype == 'Thumbnail') {
                                            thumbId = conRes[0]._id;
                                            thumbPath = conRes[0].content_url;
                                        } else if (conRes[1].contenttype == 'Thumbnail') {
                                            thumbId = conRes[1]._id;
                                            thumbPath = conRes[1].content_url;
                                        }
                                        content.findOneAndUpdate({ _id: vidoId }, { audio_thumbnail_id: thumbId, audio_thumbnail: thumbPath }).exec(function (error, rows) {
                                            if (error) {
                                                res.status(200).json({ success: false, message: error.message });
                                            } else {
                                                res.status(200).json({ message: 'content updated successfully', success: true })
                                            }
                                        })
                                    } else {
                                        res.status(200).json({ message: 'content updated successfully.' });
                                    }
                                }
                            })
                        }
                        else {
                            res.status(200).json({ message: 'Files not found..' });
                        }
                    }
                    else {
                        res.status(200).json({ message: errorObj });
                    }
                }
            });
        }
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// upload articles by admin..
uploadController.uploadArticle = function (req, res, next) {
    try {

        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
            // multer's method to allow file upload and body parse
            uploadThumbnail(req, res, function (err) {
                if (err) {
                    //shell.rm('-rf', "./public/upload/profile_pictures/" + req.payload._id + '/*');
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        res.status(400).json({ message: 'File size is too large.' });
                    } else if (err.code === 'fieltype') {
                        res.status(400).json({ message: 'File type is invalid. Only accepted .png/.jpg/.jpeg/.svg .' });
                    } else {
                        console.log(err);
                        res.status(400).json({ message: 'File was not able to be uploaded' });
                    }
                } else {

                    var userid = req.payload._id;
                    var filesArr = req.files;

                    if (typeof userid !== 'undefined' && userid && userid !== '') {
                        if (filesArr.length > 0) {
                            var contentObj = [];
                            filesArr.forEach(function (file) {

                                var path = file.path.replace("public", '').substr(1);
                                var ext = pathmodule.extname(path).toString();
                                var type = 'Article';
                                var title = req.body.title;
                                var filename = file.originalname;
                                var article = req.body.article;                           

                                contentObj.push({
                                    article_thumbnail: path,
                                    contenttype: type,
                                    userid: userid,
                                    filename: filename,
                                    article_title: title,
                                    article: article
                                });
                            });

                            content.create(contentObj, function (crErr, crRes) {
                                if (crErr) {
                                    res.status(200).json({ message: crErr, success: false })
                                } else {
                                    res.status(200).json({ message: "Article Uploaded Successfully.", success: true })
                                }
                            })

                        }
                        else {
                            res.status(200).json({ message: 'Files not found..' });
                        }
                    }

                }
            })

        }

        // var article = req.body.article;
        // var obj = {};
        // if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
        //     if (typeof article != 'undefined' && article && article != '') {

        //         obj.userid = req.payload._id;
        //         obj.article = article;
        //         obj.contenttype = 'Article';

        //         content.create(obj, function (crErr, crRes) {
        //             if (crErr) {
        //                 res.status(200).json({ message: crErr, success: false })
        //             } else {
        //                 res.status(200).json({ message: "Article Uploaded Successfully.", success: true })
        //             }
        //         })
        //     }
        // } else {
        //     return res.status(200).json({ message: "Unauthrozied Access", success: false })
        // }
    } catch (error) {
        console.log(error);

        return res.status(200).json({ message: error.message, success: false })
    }

}


uploadController.editAdminUploads = function (req, res, next) {

    // try {
    //     if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
    //         upload(req, res, function (err) {
    //             if (err) {
    //                 throw err;
    //             }
    //             else {
    //                 var userid = req.payload._id;
    //                 var filesArr = req.files;
    //                 var id = req.body.id;
    //                 var type = req.body.type;
    //                 var profileObj = {};
    //                 var errorObj = {};
    //                 if (typeof userid !== 'undefined' && userid && userid !== '' &&
    //                     typeof id !== 'undefined' && id && id !== '' &&
    //                     typeof type !== 'undefined' && type && type !== '') {
    //                     profileObj.userid = userid;
    //                     if (filesArr.length > 0) {
    //                         var contentObj = [];
    //                         filesArr.forEach(function (file) {
    //                             var path = file.path.replace("public", '').substr(1);
    //                             var ext = pathmodule.extname(path).toString();
    //                             var type = '';
    //                             if (ImageSupported.indexOf(ext) !== -1) {
    //                                 type = 'Image'
    //                             }
    //                             if (VideoSupported.indexOf(ext) !== -1) {
    //                                 type = 'Video'
    //                             }
    //                             contentObj.push({
    //                                 content_url: path,
    //                                 contenttype: type,
    //                                 userid: userid
    //                             });
    //                         });
    //                         content.findOne({ _id: id, userid: userid }).exec(function (contError, uploads) {
    //                             if (contError) {
    //                                 res.status(500).json({ message: contError.message });
    //                             } else if (uploads == null) {
    //                                 res.status(400).json({ message: "File not found.." });
    //                             } else {
    //                                 var mediapath = "./public/" + uploads.content_url;
    //                                 contentObj.forEach(mediaItem => {
    //                                     content.updateOne({ _id: id, userid: userid }, { $set: { content_url: mediaItem.content_url, contenttype: mediaItem.contenttype } }).exec(function (contentUpdateError, contentUpdated) {
    //                                         if (contentUpdateError) {
    //                                             res.status(500).json({ message: contentUpdateError.message });
    //                                         }
    //                                         else {
    //                                             fs.unlink(mediapath, (err) => {
    //                                                 if (err) {
    //                                                     console.error(err)
    //                                                     return
    //                                                 }
    //                                                 //file removed
    //                                             })

    //                                             res.status(200).json({ message: 'content updated successfully.' });
    //                                         }
    //                                     })
    //                                 })
    //                             }
    //                         })
    //                     }
    //                     else {
    //                         res.status(500).json({ message: 'Files not found..' });
    //                     }
    //                 }
    //                 else {
    //                     res.status(400).json({ message: errorObj });
    //                 }
    //             }
    //         });
    //     }
    // }
    // catch (e) {
    //     res.status(500).json({ message: e.message })
    // }
    console.log("Demo");
    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
                let userid = req.payload._id;
                console.log('body',req.body);
                let id = req.body.id;
                let videoTitle = req.body.videoTitle;
                let videoURL = req.body.videoURL;
                let contentObj = [];
                console.log("id",id);
                console.log("videoTitle",videoTitle);
                console.log("videoURL",videoURL);
                if (videoTitle !== '' && videoURL!=="" && id!=="") {
                    content.updateOne({ _id: id},{ content_url: videoURL, video_title: videoTitle}).exec(function (contentUpdateError, contentUpdated) {
                        if (contentUpdateError) {
                            res.status(500).json({ message: contentUpdateError.message });
                        }
                        else {
                            res.status(200).json({ message: 'content updated successfully.' });
                        }
                    });                        
                }
                else{
                    res.status(200).json({success:false,message: 'Please fill all details' });
                }
            }
            else{
                 res.status(400).json({ message: 'Access denied', access_flag: false });
            }
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}



uploadController.editAudioAdminUpload = function (req, res, next) {

    try {
        if (typeof req.payload._id !== 'undefined' && req.payload._id && req.payload._id !== '') {
            uploadAudio(req, res, function (err) {
                if (err) {
                    throw err;
                }
                else {
                    var userid = req.payload._id;
                    var filesArr = req.files;
                    var id = req.body.id;
                    var type = req.body.type;
                    var profileObj = {};
                    var errorObj = {};
                    if (typeof userid !== 'undefined' && userid && userid !== '' &&
                        typeof id !== 'undefined' && id && id !== '' &&
                        typeof type !== 'undefined' && type && type !== '') {
                        profileObj.userid = userid;
                        if (filesArr.length > 0) {
                            var contentObj = [];
                            filesArr.forEach(function (file) {
                                var path = file.path.replace("public", '').substr(1);
                                var ext = pathmodule.extname(path).toString();
                                var type = '';
                                if (ImageSupported.indexOf(ext) !== -1) {
                                    type = 'Image'
                                }
                                if (AudioSupported.indexOf(ext) !== -1) {
                                    type = 'Audio'
                                }
                                contentObj.push({
                                    content_url: path,
                                    contenttype: type,
                                    userid: userid
                                });
                            });
                            content.findOne({ _id: id, userid: userid }).exec(function (contError, uploads) {
                                if (contError) {
                                    res.status(500).json({ message: contError.message });
                                } else if (uploads == null) {
                                    res.status(400).json({ message: "File not found.." });
                                } else {
                                    var mediapath = "./public/" + uploads.content_url;
                                    contentObj.forEach(mediaItem => {
                                        content.updateOne({ _id: id, userid: userid }, { $set: { content_url: mediaItem.content_url, contenttype: mediaItem.contenttype } }).exec(function (contentUpdateError, contentUpdated) {
                                            if (contentUpdateError) {
                                                res.status(500).json({ message: contentUpdateError.message });
                                            }
                                            else {
                                                fs.unlink(mediapath, (err) => {
                                                    if (err) {
                                                        console.error(err)
                                                        return
                                                    }
                                                    //file removed
                                                })

                                                res.status(200).json({ message: 'content updated successfully.' });
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        else {
                            res.status(500).json({ message: 'Files not found..' });
                        }
                    }
                    else {
                        res.status(400).json({ message: errorObj });
                    }
                }
            });
        }
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}



// update articles by admin..
uploadController.updateArticle = function (req, res, next) {
    try {
        var article = req.body.article;
        var id = req.body.id;
        var type = req.body.type;
        var userid = req.payload._id;
        if (typeof req.payload._id != 'undefined' && req.payload._id && req.payload._id != '') {
            if (typeof article != 'undefined' && article && article != '' &&
                typeof id != 'undefined' && id && id != '' &&
                typeof type != 'undefined' && type && type != '') {

                content.findOne({ _id: id, userid: userid }).exec(function (contError, uploads) {
                    if (contError) {
                        res.status(500).json({ message: contError.message });
                    } else if (uploads == null) {
                        res.status(400).json({ message: "File not found.." });
                    } else {
                        content.updateOne({ _id: id, userid: userid }, { $set: { article: article, contenttype: type } }).exec(function (contentUpdateError, contentUpdated) {
                            if (contentUpdateError) {
                                res.status(500).json({ message: contentUpdateError.message });
                            }
                            else {
                                res.status(200).json({ message: 'Article updated successfully.' });
                            }
                        })
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


uploadController.uploadartImage = async function (req, res) {

    await uploadArtImg(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({ message: 'File size is too large.' });
            } else if (err.code === 'filetype') {
                res.status(400).json({ message: 'File type is invalid. Only accepted .png/.jpg/.jpeg/.svg .' });
            } else {
                console.log(err);
                res.status(400).json({ message: 'File was not able to be uploaded' });
            }
        } else {
            // var mediaObj = {};
            // mediaObj.userid = req.payload._id
            // var obj = req.files[0];
            // var string = obj.path + "";
            // var path = string.replace('public/', '');
            // mediaObj.media_path = path;
            // filename = obj.originalname
            // mediaObj.media_name = filename.substring(0, filename.lastIndexOf("."));
            // if (obj.filename.toLowerCase().match(/\.(png|jpg|jpeg)$/)) {
            //     mediaObj.type = 'image'
            // }
            res.status(200).json("uploaded");
        }
    })
}


uploadController.addMediaCategory = function (req, res, next) {
    try {
        let item = req.body.item;
        let category = req.body.category;
        let title = req.body.title;
        content.updateOne({ _id: item }, { category: category,image_title:title }).exec(function (error, result) {
            console.log(result);
                    if (!error && result) {
                        res.status(200).json({ success: true, message: "Successfully update" })
                    } else {
                        res.status(200).json({ success: false, message: error.message })
                    }
                })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

var ctrl = module.exports = uploadController;
