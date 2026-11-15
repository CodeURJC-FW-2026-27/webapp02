import express from 'express';
import * as shoes from './shoes.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    dest: shoes.UPLOADS_FOLDER
});

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


    const sportOptions = [
    { value: 'Futbol', label: 'Fútbol' },
    { value: 'Running', label: 'Running' },
    { value: 'Baloncesto', label: 'Baloncesto' }
    ];

    const sports = sportOptions.map(option => ({
    ...option, 
    selected: option.value === sport
    }));

    const pages = Array.from(
    { length: totalPages },
    (_, index) => ({
        number: index + 1,
        active: index + 1 === page
    })
    );


    // 4. Build extra URL query string to preserve active filters when changing pages
    let filterQuery = '';
    if (query) filterQuery += `&query=${encodeURIComponent(query)}`;
    if (sport) filterQuery += `&sport=${encodeURIComponent(sport)}`;

    // 5. Render index.html passing the shoes array and pagination/filter variables to Mustache
    res.render('index', {
        shoes: items,
        query,
        sport,
        sports,                     //Desp. Options of sports
        currentPage: page,
        totalPages,
        pages,                      // Nº page
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


router.get('/shoe/:id/edit', async (req, res) => {
    try {
        const shoe = await shoes.getShoe(req.params.id);

        if (!shoe) {
            return res.status(404).send('Shoe not found');
        }

        const sports = ['Fútbol', 'Baloncesto', 'Running'].map(sport => ({
    value: sport,
    selected: sport === shoe.sport
}));


router.post('/shoe/:id/edit', upload.fields([
    { name: 'Photo', maxCount: 1 },
    { name: 'AdditionalPhotos', maxCount: 10 }
]), async (req, res) => {
    try {
        const id = req.params.id;
        const currentShoe = await shoes.getShoe(id);

        if (!currentShoe) {
            return res.status(404).send('Shoe not found');
        }

        const data = req.body;

        const sizes = (data.Size || '')
            .split(',')
            .filter(size => size.trim() !== '')
            .map(Number);

        const updatedData = {
            shoeId: Number(data.Id_Zapatilla),
            name: data.Name,
            brand: data.Brand,
            price: Number(data.Price),
            sizes: sizes,
            colour: data.Colour,
            sport: data.Sport,
            stock: Number(data.Stock),
            description: data.Description
        };

        // Keep the current main photo unless a new one is uploaded
        const mainPhoto = req.files?.Photo?.[0];

        if (mainPhoto) {
            updatedData.imageFilename = mainPhoto.filename;
        }

        // Keep existing additional photos and append new ones
        const newPhotos = req.files?.AdditionalPhotos || [];

        if (newPhotos.length > 0) {
            updatedData.additionalPhotos = [
                ...(currentShoe.additionalPhotos || []),
                ...newPhotos.map(file => file.filename)
            ];
        }

        // Validate numeric fields and selected sizes
        if (
            !Number.isInteger(updatedData.shoeId) ||
            updatedData.shoeId < 1 ||
            !Number.isFinite(updatedData.price) ||
            updatedData.price < 0 ||
            !Number.isInteger(updatedData.stock) ||
            updatedData.stock < 0 ||
            sizes.length === 0 ||
            sizes.some(size => !Number.isInteger(size) || size < 1)
        ) {
            return res.status(400).send('Invalid shoe data');
        }

        await shoes.updateShoe(id, updatedData);

        res.redirect(`/shoe/${id}`);

    } catch (error) {
        console.error('Error updating shoe:', error);
        res.status(500).send('Error updating shoe');
    }
});


res.render('editProduct', { shoe, sports });

    } catch (error) {
        console.error('Error loading edit form:', error);
        res.status(500).send('Error loading edit form');
    }
});



router.post('/shoe/new', upload.fields([
    { name: 'Photo', maxCount: 1 },
    { name: 'AdditionalPhotos', maxCount: 10 }
]), async (req, res) => {
    try {
        const data = req.body;

        const sizes = data.Size
            .split(',')
            .map(size => Number(size));

        const mainPhoto = req.files?.Photo?.[0];

        if (!mainPhoto) {
            return res.status(400).send('Main photo is required');
        }

        const shoe = {
            shoeId: Number(data.Id_Zapatilla),
            name: data.Name,
            brand: data.Brand,
            price: Number(data.Price),
            sizes: sizes,
            colour: data.Colour,
            sport: data.Sport,
            stock: Number(data.Stock),
            description: data.Description,
            imageFilename: mainPhoto.filename,
            additionalPhotos: (req.files?.AdditionalPhotos || [])
                .map(file => file.filename),
            reviews: []
        };

        await shoes.addShoe(shoe);

        res.redirect('/');

    } catch (error) {
        console.error('Error creating shoe:', error);
        res.status(500).send('Error creating shoe');
    }
});


 // Route to display the details of a shoe
router.get('/shoe/:id', async (req, res) => {
    try {
        const shoe = await shoes.getShoe(req.params.id);

        if (!shoe) {
            return res.status(404).send('Shoe not found');
        }

        res.render('producto', { shoe });

    } catch (error) {
        console.error('Error loading shoe details:', error);
        res.status(500).send('Error loading shoe details');
    }
});



router.post('/shoe/:id/delete', async (req, res) => {
    try {
        const result = await shoes.deleteShoe(req.params.id);

        if (result.deletedCount === 0) {
            return res.status(404).send('Shoe not found');
        }

        res.redirect('/');

    } catch (error) {
        console.error('Error deleting shoe:', error);
        res.status(500).send('Error deleting shoe');
    }
});



export default router;