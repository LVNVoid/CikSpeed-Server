// models/reservation.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // Relasi many-to-one dengan User
      Reservation.belongsTo(models.User, { foreignKey: "userId" });

      // Relasi many-to-one dengan Vehicle
      Reservation.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });

      // Relasi many-to-many dengan Symptom melalui tabel pivot ReservationSymptom
      Reservation.belongsToMany(models.Symptom, {
        through: "ReservationSymptom",
        foreignKey: "reservationId",
        otherKey: "symptomId",
      });

      // Relasi many-to-one dengan Mechanic
      Reservation.belongsTo(models.Mechanic, {
        foreignKey: "mechanicId",
      });
    }
  }
  Reservation.init(
    {
      date: DataTypes.DATEONLY,
      time: DataTypes.TIME,
      serviceType: DataTypes.STRING,
      status: DataTypes.STRING,
      description: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      vehicleId: DataTypes.INTEGER,
      mechanicId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  );
  return Reservation;
};
