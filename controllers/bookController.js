const { Book } = require("../models");
const { Book_Genre } = require("../models");
const joi = require("joi");

exports.getBook = async (req, res) => {
  try {
    const response = await Book.findAll();
    res.status(200).json({ data: response, message: "Success" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

exports.getBookID = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Book.findOne({ where: { id: id } });
    if (!response) {
      return res.status(404).json({ message: `Book Not Found` });
    }
    res.status(200).json({ data: response, message: "Success" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const newData = req.body;
    const genreIDs = req.body.genreIDs;

    const scheme = joi.object({
      name: joi.string().min(3).required(),
      description: joi.string().required(),
      genreIDs: joi.array().min(1).required(),
    });

    const { error } = scheme.validate(newData);
    if (error) {
      return res.status(400).json({ status: "Validation Failed", message: error.details[0].message });
    }

    const existingBook = await Book.findOne({ where: { name: newData.name } });
    if (existingBook) {
      return res.status(400).json({ message: `Book with name ${newData.name} already exist...` });
    }

    const newBook = await Book.create(newData);
    const newBookID = newBook.id;

    for (const genreID of genreIDs) {
      const bookGenre = {
        bookId: newBookID,
        genreId: genreID,
      };
      await Book_Genre.create(bookGenre);
    }

    res.status(201).json({ message: "Book Created..." });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const scheme = joi.object({
      name: joi.string().min(3).required(),
      description: joi.string().required(),
    });
    const { error } = scheme.validate(newData);
    if (error) {
      return res.status(400).json({ status: "Validation Failed", message: error.details[0].message });
    }

    const selectedBook = await Book.findOne({ where: { id: id } });
    if (!selectedBook) {
      return res.status(404).json({ message: `Book Not Found` });
    }
    if (selectedBook.transactionID) {
      return res.status(400).json({ message: `Book with name ${selectedBook.name} sold out...` });
    }
    const updatedBook = await Book.update(newData, { where: { id: id } });

    res.status(200).json({ message: "Book Updated..." });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};
