const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const createError = require('http-errors');
const { Op } = require("sequelize");

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

router.get(['/', '/search'], asyncHandler(async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : null;
    const page = parseInt(req.query.page, 10) >= 1 ? parseInt(req.query.page, 10) : 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    let where = {};

    if (req.path === '/search') {
        if (!query) {
            const { count, rows } = await Book.findAndCountAll({ limit, offset });
            return res.render('index', { books: rows, currPage: page, pageCount: Math.ceil(count / limit), path: req, query: '' });
        }
        where = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { author: { [Op.iLike]: `%${query}%` } },
                { genre: { [Op.iLike]: `%${query}%` } },
                ...(isNaN(parseInt(query)) ? [] : [{ year: parseInt(query) }])
            ]
        };
    }

    const { count, rows } = await Book.findAndCountAll({
        where,
        limit,
        offset,
    });

    res.render('index', { books: rows, currPage: page, pageCount: Math.ceil(count / limit), path: req, query });
}));

router.get('/new', (req, res) => {
    res.render('new-book', { book: {} });
});

router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/books");
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = Book.build(req.body);
            res.render("new-book", { book, errors: error.errors });
        } else {
            throw error;
        }
    }
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', { book });
    } else {
        next(createError(404, "Sorry! We couldn't find the book you were looking for."));
    }
}));

router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        await book.update(req.body);
        res.redirect("/books");
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = Book.build(req.body);
            book.id = req.params.id;
            res.render("update-book", { book, errors: error.errors });
        } else {
            throw error;
        }
    }
}));

router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect("/books");
    } else {
        next(createError(404, "Book not found"));
    }
}));

module.exports = router;
