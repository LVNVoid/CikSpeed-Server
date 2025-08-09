"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Reservations", "status", {
      type: Sequelize.ENUM(
        "confirmed",
        "pending",
        "in_progress",
        "success",
        "failed"
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Reservations", "status", {
      type: Sequelize.ENUM("confirmed", "pending", "success", "failed"),
      allowNull: false,
    });
  },
};
