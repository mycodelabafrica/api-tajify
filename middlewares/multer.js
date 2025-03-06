const multer = require('multer');


//////////////////////////////////////////////////
//// MULTER STORAGE ////
//////////////////////////////////////////////////
const multerStorage = multer.diskStorage({});


//////////////////////////////////////////////////
//// MULTER FILTER ////
//////////////////////////////////////////////////
const multerFilter = (_, file, cb) => {
    try {
        // if (file.mimetype.startsWith('image') || file.mimetype.startsWith("video") || file.mimetype.startsWith("audio") || file.mimetype.startsWith("thumbnail")) {
        if(file) {
            cb(null, true);
        } else {
            throw new Error('Not a Vaild file! Please upload only accepted files');
        }
    } catch (error) {
        cb(error, false);
    }
}


//////////////////////////////////////////////////
//// MULTER UPLOAD ////
//////////////////////////////////////////////////
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
}); 


//////////////////////////////////////////////////
//// MULTER UPLOADS ////
//////////////////////////////////////////////////
exports.uploadSingleImage = upload.single('image');

exports.uploadSingleTube = upload.fields([
    { name: 'tube', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);
exports.uploadSingleAudio = upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

exports.uploadEbook = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'book', maxCount: 1 }
]);
exports.uploadAudioBook = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'audioBook', maxCount: 1 }
]);
 