const { Genre, Book } = require("../models");
const joi = require("joi");

exports.getGenre = async (req, res) => {
  try {
    const response = await Genre.findAll({
      include: Book,
    });
    res.status(200).json({ message: "Success", status: 200, data: response });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
};

exports.postGenre = async (req, res) => {
  try {
    const newData = req.body;

    const scheme = joi.object({
      name: joi.string().min(3).required(),
    });

    const { error } = scheme.validate(newData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, status: 400 });
    }

    const existingGenre = await Genre.findOne({ where: { name: newData.name }})
    if (existingGenre) {
      return res.status(400).json({ message: `${newData.name} already exist`, status: 400 });
    }

    const newGenre = await Genre.create(newData)
    res.status(201).json({ message: "Success create genre", status: 201});
  }catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
}


