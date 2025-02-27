"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Symptoms",
      [
        {
          name: "Mesin sulit menyala",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aki motor sering tekor",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Lampu depan atau belakang tidak menyala",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Suara knalpot tidak normal (berisik)",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Rem kurang pakem",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ban bocor atau tekanan angin kurang",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Oli motor perlu diganti",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Stang motor terasa berat",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Busi bermasalah (mesin ngelitik)",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kabel gas atau kopling kendor",
          serviceType: "regular",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mesin motor overheating (terlalu panas)",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mesin mengeluarkan asap putih atau hitam",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Transmisi macet atau sulit pindah gigi",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Suara mesin kasar atau berisik",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Oli motor sering habis atau bocor",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mesin mati tiba-tiba saat digunakan",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pembakaran tidak sempurna (mesin tersendat)",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ganti komponen mesin (piston, ring, dll.)",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ganti rantai atau gir motor",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Perbaikan sistem kelistrikan utama",
          serviceType: "major",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Symptoms", null, {});
  },
};
