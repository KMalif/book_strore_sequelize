const { Transaction, Book, Book_Genre } = require("../models");
const joi = require("joi");

exports.getTransaction = async (req, res) => {  
  try {
    const response = await Transaction.findAll({
      include: "transactionBook",
    });
    res.status(200).json({ message: "Success Get all Transaction", status: 200, data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const newData = req.body;
    const bookIDs = req.body.bookIDs;
    const scheme = joi.object({
      buyerName: joi.string().min(3).required(),
      email: joi.string().email({ tlds: { allow: false } }),
      phoneNumber: joi.number().required(),
      bookIDs: joi.array().min(1).required(),
    });

    const { error } = scheme.validate(newData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, status: 400 });
    }

    for (const bookID of bookIDs) {
      const existingBook = await Book.findOne({ where: { id: bookID } });
      if (!existingBook) {
        return res.status(404).json({ message: `Book with ID ${bookID} not found`, status: 400 });
      }
      if (existingBook.transactionID !== null) {
        return res.status(400).json({ message: `Book with ID ${bookID} sold out` });
      }
    }

    const newTransaction = await Transaction.create(newData);
    const newTransactionId = newTransaction.id;

    for (const bookID of bookIDs) {
      await Book.update({ transactionID: newTransactionId }, { where: { id: bookID } });
    }

    res.status(201).json({ message: "Transaction Created", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
};

exports.getTransactionID = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Transaction.findOne({ include: "transactionBook", where: { id: id } });
    if (!response) {
      return res.status(404).json({ message: `Transaction Not Found` });
    }
    res.status(200).json({ message: "Success get Transaction", status: 200, data: response });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const selectedTransaction = await Transaction.findOne({ where: { id: id } });

    if (!selectedTransaction) {
      return res.status(404).json({ message: `Transaction Not Found` });
    }

    const books = await Book.findAll({ where: { transactionID: id } });

    for (const book of books) {
      await Book_Genre.destroy({ where: { bookId: book.id } });

      await Book.destroy({ where: { id: book.id } });
    }

    await Transaction.destroy({ where: { id: id } });

    res.status(200).json({ message: "Transaction have been deleted", status: 200 });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
