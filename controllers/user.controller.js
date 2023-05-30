const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config/index.js");

const db = require("../models");
const User = db.user;

// NEW
const cloudinary = require("cloudinary").v2;
// cloudinary configuration
cloudinary.config({
    cloud_name: config.C_CLOUD_NAME,
    api_key: config.C_API_KEY,
    api_secret: config.C_API_SECRET
});

const { ValidationError } = require('sequelize');

exports.create = async (req, res) => {
    try {
        console.log(req.body)
        
        if (!req.body && !req.body.username && !req.body.password)
            return res.status(400).json({ success: false, msg: "Username and password are mandatory" });
    
            console.log(req.body)
        // NEW
        let user_image = null;
        if (req.file) {
            /*
            https://cloudinary.com/documentation/node_image_and_video_upload
            The file to upload can be specified as a local path, a remote HTTP or HTTPS URL, a whitelisted storage bucket (S3 or Google Storage) URL, a base64 data URI, or an FTP URL
            For details, see File source options.
            */
            let img_file = req.file.path;
            // upload image
            let result = await cloudinary.uploader.upload(img_file);
            console.log(result)
            user_image = result;
        }


        // Save user to DB
        let user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            // password: req.body.password,
            role: req.body.role,
            // NEW
            profile_image: user_image ? user_image.url : null,
            cloudinary_id: user_image ? user_image.public_id : null
        });
        console.log(user)
        return res.status(201).json({ success: true, msg: "User was registered successfully!" });

    }
    catch (err) {
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while signing up."
            });
    };
};


exports.login = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.body || !req.body.username || !req.body.password)
            return res.status(400).json({ success: false, msg: "Failed! Must provide username and password." });

        let user = await User.findOne({
            where: { username: req.body.username }
        });
        console.log(user)
        if (!user)
            return res.status(404).json({ success: false, msg: "User not found." });

        // decrypt psswd from DB and compare with the provided psswd in request
        // tests a string (password in body) against a hash (password in database)​
        const check = bcrypt.compareSync(
            req.body.password, user.password
        );
        // const check = req.body.password == user.password;

        if (!check) {
            return res.status(401).json({
                success: false, accessToken: null, msg: "Invalid credentials!"
            });
        }

        //UNSAFE TO STORE EVERYTHING OF USER, including PSSWD
        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: user.id, role: user.role },
            config.JWT_SECRET, {
            expiresIn: '24h' // 24 hours
            // expiresIn: '20m' // 20 minutes
            // expiresIn: '1s' // 1 second
        });

        console.log({ id: user.id, role: user.role })
        return res.status(200).json({
            success: true,
            accessToken: token,
            id: user.id,
            role: user.role
        });

    } catch (err) {
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred at login."
            });
    };
};

exports.getAllUsers = async (req, res) => {
    try {
        if (req.loggedUserRole !== "admin")
            return res.status(403).json({
                success: false, msg: "This request requires ADMIN role!"
            });

        // let users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] })
        let users = await User.findAll()
        res.status(200).json({ success: true, users: users });
    }
    catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving all users."
        });
    };
};


exports.getUser = async (req, res) => {
    try {
        if ( req.loggedUserId != req.params.userID )
            return res.status(403).json({
                success: false, msg: "This request is only available for ADMINS or LOGGED user!"
            });

        let user = await User.findByPk(req.params.userID)
        if (user == null)
            return res.status(404).json({
                message: `Not found User with id ${req.params.userID}.`
            });

        res.status(200).json({ success: true, user: user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};
