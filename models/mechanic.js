"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mechanic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mechanic.hasMany(models.Reservation, {
        foreignKey: "mechanicId",
      });
    }
  }
  Mechanic.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Mechanic",
    }
  );
  return Mechanic;
};
