import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { carsRouter, postgresRouter } from './api';
import { TG_BOT } from './telega';

const PORT = 5555;
const app = express();

// Чтобы принимать JSON параметры в res.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://localhost:3333'] }));

// Роутеры
app.use('/cars', carsRouter);
app.use('/bd', postgresRouter);

app.get('/hello', (req, res) => {
  // console.log(req.headers);
  res.send('Привет');
});

// обработка ошибок
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: err.message ?? 'Севрер устал ¯\\_(ツ)_/¯' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен http://localhost:${PORT}`);
  TG_BOT.launch();
  console.log(`TG бот запущен`);
});
