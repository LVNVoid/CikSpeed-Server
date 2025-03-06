"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Mechanics", [
      {
        name: "Budi Santoso",
        phoneNumber: "81234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Agus Wijaya",
        phoneNumber: "82345678901",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Mechanics", null, {});
  },
};
