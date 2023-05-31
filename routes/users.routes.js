//Authentication routes: POST /auth/signup & POST /auth/signin

const express = require('express');

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

// NEW MULTER
const multer = require('multer');
// const storage = multer.diskStorage({
//     // set up the directory where all files will be saved​
//     destination: (req, file, cb) => {
//         cb(null, '/tmp') 
//     },
//     // give the files a new identifier​
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname)
//     }
// }); 
const storage = multer.memoryStorage();
// acccepts a single file upload: 
//  specifies the field name where multer looks for the file​
//  multer will look for files in request.file.image
const multerUploads = multer({ storage }).single('image');

// var storage = multer.memoryStorage({
//     destination: function(req, file, callback) {
//        callback(null, '');
//     }
//  });
//  var upload = multer({ storage: storage }).single('image');

// express router
let router = express.Router();

router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next()
})

// AUTH CONTROLLER: 
// the user needs to send the token on each request to the secure routes
// this middleware verifies the provided token - function verifyToken

router.route('/')
    .get(authController.verifyToken, userController.getAllUsers) //ADMIN ACCESS ONLY
    .post(multerUploads, userController.create);

router.route('/login')
    .post(userController.login);

router.route('/:userID')
    .get(authController.verifyToken, userController.getUser); //USER_ID OR ADMIN ACCESS

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'USERS: what???' });
})

module.exports = router;