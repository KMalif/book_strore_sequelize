const { Genre, Book } = require("../models");

exports.getGenre = async (req, res) => {
  try {
    const response = await Genre.findAll({
      include: Book,
    });
    res.status(200).json({ data: response, message: "Success" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};
