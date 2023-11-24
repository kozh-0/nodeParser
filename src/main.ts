// import { readFileSync } from "fs";
// import doSomething from "./modules/kek.js";

// const fileContent = readFileSync("./lmfao.txt", "utf-8");
// fs.writeFileSync("test.txt", "some text");
// console.log(fileContent);
// doSomething();
import express from 'express';
import { carsRouter } from './modules/cars.js';

const PORT = 5555;
const app = express();

// Чтобы принимать JSON параметры
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/cars', carsRouter);

app.listen(PORT, () => {
  console.log(`
  ========================================================================================
  Сервер запущен http://localhost:${PORT}
  ========================================================================================
  `);
});
