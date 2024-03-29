module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: { notNull: { msg: "Username cannot be empty or null!" } }
        },
        //new
        profile_image: {
            type: DataTypes.STRING,
        },
        cloudinary_id: {
            type: DataTypes.STRING,
        },
        //end_NEW
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            trim: true, // remove spaces on both ends of the string
            allowNull: false,
            validate: { notNull: { msg: "Password cannot be empty or null!" } }
        },
        role: {
            type: DataTypes.ENUM('admin', 'regular'), // access ENUM values: console.log(User.getAttributes().role.values);
            defaultValue: 'regular',
            validate: {isIn: {
                args: [['admin', 'regular']],
                msg: "Allowed roles: admin or regular"
              }}
        }
    }, {
        timestamps: false
    });
    return User;
};

// module.exports = (mongoose) => {
//     const schema = mongoose.Schema(
//             {
//                 username:  String,
//                 email: String,
//                 password: String,
//                 role: { type:String, default: "regular"},
//                 cloudinary_id: String,
//                 profile_image: String
//             },
//             { timestamps: false }
//         );
//     // creates a new model Tutorial using the defined schema above
//     const User = mongoose.model("user", schema);
//     return User;
// };