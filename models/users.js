// Requiring bcrypt for password hashing. Using the bcryptjs version as
//the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      private: true,
      unique: {
        args: true,
        msg: "Sorry, this email address is already taken. Please try another."
      },
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      private: true,
      validate: {
        len: [1]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1]
      }
    },
    userPhoto: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Creating a custom method for our User model.
  //This will check if an un hashed password entered by the
  //user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.beforeCreate(function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  User.associate = function(models) {
    // Associating Users with Posts
    // When a user is deleted, also delete any associated Posts
    User.hasMany(models.Project, {
      onDelete: "cascade"
    });

    User.hasMany(models.BlogPost, {
      onDelete: "cascade"
    });

    User.hasMany(models.BlogComments, {
      onDelete: "cascade"
    });

    User.belongsToMany(models.Project, {
      as: "attendees",
      through: models.ProjectParticipant
    });
  };

  return User;
};
