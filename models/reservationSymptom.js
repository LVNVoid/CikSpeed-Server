// models/reservationSymptom.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReservationSymptom extends Model {
    static associate(models) {
      // Relasi many-to-one dengan Reservation
      ReservationSymptom.belongsTo(models.Reservation, {
        foreignKey: "reservationId",
      });

      // Relasi many-to-one dengan Symptom
      ReservationSymptom.belongsTo(models.Symptom, {
        foreignKey: "symptomId",
      });
    }
  }
  ReservationSymptom.init(
    {
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Reservations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      symptomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Symptoms",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "ReservationSymptom",
    }
  );
  return ReservationSymptom;
};
