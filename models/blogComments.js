module.exports = function(sequelize, DataTypes) {
  let BlogComments = sequelize.define("BlogComments", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 150]
      }
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  BlogComments.associate = function(models) {
    //Foreign key prevents projects from started made without a user
    BlogComments.belongsTo(models.User, {
      as: "commenter",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return BlogComments;
};
