const Card = require('../models/card');
const {NOT_FOUND_ERROR, CREATED, BAD_REQUEST_ERROR, SERVER_ERROR} = require('../utils/utils')

const getCards = (req, res) => {
  Card.find({})
  .then((cards) =>
  res.status(200).send(cards))
    .catch(() => {
      res.status(SERVER_ERROR).send({message: 'Ошибка сервера'})
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({message:'Переданы некорректные данные при создании карточки'});
      }
        return res.status(SERVER_ERROR).send({message: 'Ошибка сервера'});
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (card.owner.toString() !== req.user._id) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Нет прав для удаления карточки' });
        return;
      }
      Card.findByIdAndRemove(cardId)
        .then(() => {
          res.send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(SERVER_ERROR).send({message: 'Ошибка сервера'});
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(SERVER_ERROR).send({message: 'Ошибка сервера'});
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для удаления лайка' });
    }
    return res.status(SERVER_ERROR).send({message: 'Ошибка сервера'});
  });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};