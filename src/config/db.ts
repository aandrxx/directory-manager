import { Sequelize } from "sequelize-typescript";
import path from "path";
import fs from "fs";
import Directory from "../models/directory.model";

const dbDir = path.join(process.cwd(), "data");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
  models: [Directory],
});

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
};

export const initDatabase = async (): Promise<void> => {
  try {
   await sequelize.sync();
  } catch (error) {
    throw error;
  }
};

export default sequelize;
