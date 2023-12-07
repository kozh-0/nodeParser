import express, { Request } from 'express';
import { User } from '../lib/postgres';

export const postgresRouter = express.Router();

postgresRouter.get('getUsers', (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ users: 'Что-то пошло не так...' });
    });
});
postgresRouter.get('getUser/:userId', (req: Request<{ userId: number }>, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then((user) => {
      if (!user) return res.status(404).json({ msg: 'Пользователь не найден!' });
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ users: 'Что-то пошло не так...' });
    });
});
postgresRouter.post(
  'createUser',
  (req: Request<{ id: number; name: string; tg_username: string; request: string }>, res, next) => {
    const { name, tg_username, request } = req.params;
    User.create({ name, tg_username, request })
      .then((createdUser) => {
        res.status(201).json({ createdUser, message: 'Пользователь создан!' });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Что-то пошло не так...' });
      });
  }
);
postgresRouter.delete('deleteUser/:userId', (req: Request<{ userId: number }>, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then((user) => {
      if (!user) return res.status(404).json({ msg: 'Пользователь не найден!' });
      User.destroy({
        where: {
          id: userId,
        },
      });
    })
    .then(() => res.status(200).json({ msg: 'Пользователь удален!' }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ users: 'Что-то пошло не так...' });
    });
});
