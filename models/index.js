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
        await sequelize.authenticate;
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

const db = {};
db.sequelize = sequelize;

// add User model into DB
db.user = require("./user.model.js")(sequelize, DataTypes);

// optionally: SYNC
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
