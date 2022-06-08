/*
To process Authentication & Authorization, we have these functions:
- check if token is provided, legal or not. We get token from x-access-token of 
    HTTP headers, then use jsonwebtoken's verify() function.
- check if roles of the user contains required role or not.
*/

const jwt = require("jsonwebtoken");

// const multer = require("multer")

const config = require("../config/index.js");
const db = require("../models");
const User = db.user;


exports.verifyToken = (req, res, next) => {
    // search token can be in the headers most commonly used for authentication
    const header = req.headers['x-access-token'] || req.headers.authorization;

    if (typeof header == 'undefined') {
        return res.status(401).json({
            success: false, msg: "No token provided!"
        });
    }

    let token, bearer = header.split(' ');
    if (bearer.length == 2)
        token = bearer[1];
    else
        token = header;
    console.log(bearer, token)
    //jsonwebtoken's verify() function
    try {
        let decoded = jwt.verify(token, config.JWT_SECRET);
        req.loggedUserId = decoded.id;
        req.loggedUserRole = decoded.role;
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ success: false, msg: "Whoops, your token has expired! Please login again." });

        if (err.name === 'JsonWebTokenError')
            return res.status(401).json({ success: false, msg: "Malformed JWT" });

        return res.status(401).json({ success: false, msg: "Unauthorized!" });
    }
};


// // storage method
// const multerStorage = multer.diskStorage({
//     // set destination
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     // set filename
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1]; // get file extension: MIME type looks like 'image/jpeg'
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // use the user ID and the current timestamp to create a filename
//     }
// });

// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new AppError('Not an image! Please upload an image.', 400), false);
//     }
// };

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });

// // exports.uploadUserPhoto = upload.single('photo');
// exports.updateProfilePic = async (req, res) => {
//     if (!req.file) {
//         console.log("No file received");
//         return res.status(404).send({
//             message: "No file submitted"
//         });

//     } else {
//         console.log('file received: ' + req.file.filename);
//         console.log('file path: ' + req.file.path);
//         console.log('original name: ' + req.file.originalname);
//         return res.send({
//             success: true
//         })
//     }
// };
