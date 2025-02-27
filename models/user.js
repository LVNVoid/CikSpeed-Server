"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {}
  );

  User.associate = function (models) {
    // Relasi one-to-many dengan Vehicle
    User.hasMany(models.Vehicle, { foreignKey: "userId" });

    // Relasi one-to-many dengan Reservation
    User.hasMany(models.Reservation, { foreignKey: "userId" });
  };

  return User;
};
