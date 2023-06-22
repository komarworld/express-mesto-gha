const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { NOT_FOUND_ERROR } = require('../utils/utils');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
});


module.exports = router;