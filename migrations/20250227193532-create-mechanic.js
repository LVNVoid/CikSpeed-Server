"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Membuat tabel Mechanics
    await queryInterface.createTable("Mechanics", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Menambahkan kolom mechanicId ke tabel Reservations
    await queryInterface.addColumn("Reservations", "mechanicId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Mechanics",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus kolom mechanicId dari tabel Reservations
    await queryInterface.removeColumn("Reservations", "mechanicId");

    // Menghapus tabel Mechanics
    await queryInterface.dropTable("Mechanics");
  },
};
