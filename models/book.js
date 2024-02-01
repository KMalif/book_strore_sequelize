"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsToMany(models.Genre, { through: models.Book_Genre, foreignKey: "bookId", otherKey: "genreId" });

      Book.belongsTo(models.Transaction, {
        as: "transactionBook",
        foreignKey: {
          name: "transactionID",
        },
      });
    }
  }
  Book.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      transactionID: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (Book) => {
          Book.transactionID = null;
        },
      },
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
