import express from 'express';
import * as shoes from './shoes.js';

const router = express.Router();

// Main route
router.get('/', async (req, res) => {
    // 1. Extract query parameters from the URL
    const query = req.query.query || '';
    const sport = req.query.sport || '';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 6; // Maximum number of shoes displayed per page

    // 2. Fetch the matching shoes for the current page and total count from MongoDB
    const { items, total } = await shoes.getShoes(query, sport, page, limit);

    // 3. Calculate total pages (minimum 1 so "Página 1 de 1" shows even with 0 results)
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // 4. Build extra URL query string to preserve active filters when changing pages
    let filterQuery = '';
    if (query) filterQuery += `&query=${encodeURIComponent(query)}`;
    if (sport) filterQuery += `&sport=${encodeURIComponent(sport)}`;

    // 5. Render index.html passing the shoes array and pagination/filter variables to Mustache
    res.render('index', {
        shoes: items,
        query,
        sport,
        currentPage: page,
        totalPages,
        hasPrev: page > 1,          // True if on page 2 or higher (enables "Anterior" button)
        prevPage: page - 1,         // Page number for the "Anterior" link
        hasNext: page < totalPages, // True if more pages exist ahead (enables "Siguiente" button)
        nextPage: page + 1,         // Page number for the "Siguiente" link
        filterQuery                 // Appends &query=... and/or &sport=... to pagination links
    });
});

// Route to render the form for adding a new shoe
router.get('/shoe/new', (req, res) => {
    res.render('newProduct');
});

export default router;