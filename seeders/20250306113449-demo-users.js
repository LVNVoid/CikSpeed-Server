"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fungsi untuk menghash password
    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };

    // Data yang akan di-insert ke tabel Users
    await queryInterface.bulkInsert("Users", [
      {
        name: "John Doe",
        phone: "8123456789",
        address: "123 Main St, City A",
        password: await hashPassword("password123"),
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Smith",
        phone: "812345678901",
        address: "456 Elm St, City B",
        password: await hashPassword("password123"),
        role: "frontdesk",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Admin User",
        phone: "81234567890",
        address: "789 Oak St, City C",
        password: await hashPassword("password123"), // Hash password
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus semua data yang di-insert oleh seeder ini
    await queryInterface.bulkDelete("Users", null, {});
  },
};
