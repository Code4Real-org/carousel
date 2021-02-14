module.exports = {
  HOST: "localhost",
  USER: "anjugoenka",
  PASSWORD: "teamc4r",
  DB: "carousel",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};