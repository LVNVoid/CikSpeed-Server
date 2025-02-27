"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      brand: DataTypes.STRING,
      type: DataTypes.STRING,
      productionYear: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );

  Vehicle.associate = function (models) {
    // Relasi many-to-one dengan User
    Vehicle.belongsTo(models.User, { foreignKey: "userId" });

    // Relasi one-to-many dengan Reservation
    Vehicle.hasMany(models.Reservation, { foreignKey: "vehicleId" });
  };

  return Vehicle;
};
