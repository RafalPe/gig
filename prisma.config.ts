module.exports = {
  migrations: {
    seed: "ts-node --project tsconfig.seed.json prisma/seed.ts",
  },
};