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