// import { readFileSync } from "fs";
// import doSomething from "./modules/kek.js";

// const fileContent = readFileSync("./lmfao.txt", "utf-8");
// fs.writeFileSync("test.txt", "some text");
// console.log(fileContent);
// doSomething();
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { carsRouter } from './cars';
import { TG_BOT } from './telega';

const PORT = 5555;
const app = express();

// Чтобы принимать JSON параметры в res.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3333'] }));

app.use('/cars', carsRouter);

app.get('/hello', (req, res) => {
  // console.log(req.headers);
  res.send('Привет');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен http://localhost:${PORT}`);
  TG_BOT.launch();
  console.log(`TG бот запущен`);
});
