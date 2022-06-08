//Authentication routes: POST /auth/signup & POST /auth/signin

const express = require('express');

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

// NEW MULTER
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
}); // save the file to memory first
const multerUploads = multer({ storage }).single('image'); // specifies the field name multer should go to when it’s looking for the file

// express router
let router = express.Router();

router.use((req, res, next) => {
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "x-access-token, Origin, Content-Type, Accept"
    // );

    console.log(`${req.method} ${req.originalUrl}`);
    next()
})

// AUTH CONTROLLER: 
// the user needs to send the token on each request to the secure routes
// this middleware verifies the provided token and performs extra security checks like analyse the logged user profile 

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