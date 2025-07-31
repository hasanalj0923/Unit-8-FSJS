'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {}

  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title field cannot be empty'
        },
        notNull: {
          msg: 'Title field cannot be empty'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author field cannot be empty'
        },
        notNull: {
          msg: 'Author field cannot be empty'
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Year must be a number'
        },
        min: {
          args: [0],
          msg: 'Year must be a positive number'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });

  return Book;
};
