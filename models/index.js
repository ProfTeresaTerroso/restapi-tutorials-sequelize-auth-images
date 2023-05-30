const dbConfig = require('../config/index.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

(async () => {
    try {
        console.log(dbConfig)
        await sequelize.authenticate;
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

// const db = {};
// db.sequelize = sequelize;

// const mongoose = require("mongoose");

// const db = {};
// db.mongoose = mongoose;
// db.url = dbConfig.MONGO_URL;

// (async () => {
//     try {
//         console.log(db.url )
//         await db.mongoose.connect(db.url,
//                 {
//                     useNewUrlParser: true,
//                     useUnifiedTopology: true
//                 }
//             );
//         console.log("Connected to the database!");
//     } catch (error) {
//         console.log("Cannot connect to the database!", error);
//         process.exit();
//     }
// })();

// // add User model into DB
db.user = require("./user.model.js")(sequelize, DataTypes);
// db.user = require("./user.model.js")(mongoose);

// // optionally: SYNC
// (async () => {
//     try {
//         // await sequelize.sync({ force: true });
//         await sequelize.sync({ alter: true });
//         console.log('DB is successfully synchronized')
//     } catch (error) {
//         console.log(error)
//     }
// })();

//export DATABASE connection & models
module.exports = db;
