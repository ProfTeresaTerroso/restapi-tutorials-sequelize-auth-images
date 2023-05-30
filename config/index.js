const config = {
     HOST: process.env.DB_HOST ,
     USER: process.env.DB_USER ,
     PASSWORD: process.env.DB_PASSWORD ,
     DB: process.env.DB_NAME ,
     dialect: "mysql",
     // pool is optional, it will be used for Sequelize connection pool configuration
     pool: {
          max: 5,   //maximum number of connections in pool
          min: 0,   //minimum number of connections in pool
          acquire: 30000,     //maximum time, in milliseconds, that pool will try to get connection before throwing error
          idle: 10000    //maximum time, in milliseconds, that a connection can be idle before being released
     },
     // secret key (as String) to encode and decode token from JWT
     JWT_SECRET: process.env.JWT_SECRET,
     // CLOUDINARY (image hosting)
     C_CLOUD_NAME: process.env.C_CLOUD_NAME,
     C_API_KEY: process.env.C_API_KEY,
     C_API_SECRET: process.env.C_API_SECRET,
     MONGO_URL: process.env.MONGO_URL
};

module.exports = config;