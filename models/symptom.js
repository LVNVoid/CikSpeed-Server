// models/symptom.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Symptom extends Model {
    static associate(models) {
      // Relasi many-to-many dengan Reservation melalui tabel pivot ReservationSymptom
      Symptom.belongsToMany(models.Reservation, {
        through: "ReservationSymptom",
        foreignKey: "symptomId",
        otherKey: "reservationId",
      });
    }
  }
  Symptom.init(
    {
      name: DataTypes.STRING,
      serviceType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Symptom",
    }
  );
  return Symptom;
};
