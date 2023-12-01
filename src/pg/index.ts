import Sequelize, { Sequelize as ORM_INIT } from 'sequelize';

export const db = new ORM_INIT(process.env.PG_NAME, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.PG_HOST,
  dialect: 'postgres',
});

export const User = db.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
  name: Sequelize.STRING,
  tg_username: Sequelize.STRING,
  request: Sequelize.STRING,
});
