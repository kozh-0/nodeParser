import express from 'express';
import { getCarDataFromAvito } from '../lib/parser';

export const carsRouter = express.Router();

carsRouter.post('/getList', async (req, res) => {
  try {
    const carsData = await getCarDataFromAvito(req.body);

    if (carsData.status === 404) {
      return res.status(404).send(carsData);
    }

    res.json(carsData);
  } catch (error) {
    res.status(400).json({ data: [], error: 'Что-пошло не так...', status: 500 });
  }
});
