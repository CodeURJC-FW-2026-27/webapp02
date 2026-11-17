import express from 'express';
import multer from 'multer';
import * as shoes from './shoes.js';

const router = express.Router();
const upload = multer({ dest: shoes.UPLOADS_FOLDER });

// Validate shoe fields on the server side

async function validateShoeData(body, file, isEdit = false, existingShoe = null) {
    const shoeId = parseInt(body.shoeId, 10);
    const name = (body.name || '').trim();
    const brand = (body.brand || '').trim();
    const price = parseFloat(body.price);
    const colour = (body.colour || '').trim();
    const sport = (body.sport || '').trim();
    const stock = parseInt(body.stock, 10);
    const description = (body.description || '').trim();
    const rawSizes = (body.sizes || '').trim();

    if (!name || !brand || !colour || !sport || !description || !rawSizes) {
        return { error: 'Todos los campos obligatorios deben estar rellenos, incluida al menos una talla.' };
    }

    if (!/^[A-ZÁÉÍÓÚÜÑ]/.test(name)) {
        return { error: 'El nombre de la zapatilla debe comenzar por una letra mayúscula.' };
    }

    const nameTaken = await shoes.isShoeNameTaken(
        name,
        isEdit ? existingShoe._id.toString() : null
    );

    if (nameTaken) {
        return { error: 'Ya existe otra zapatilla registrada con ese nombre.' };
    }

    if (Number.isNaN(shoeId) || shoeId < 1) {
        return { error: 'El identificador numérico de la zapatilla debe ser mayor que 0.' };
    }

    const idTaken = await shoes.isShoeIdTaken(
        shoeId,
        isEdit ? existingShoe._id.toString() : null
    );

    if (idTaken) {
        return { error: 'Ya existe otra zapatilla registrada con ese ID.' };
    }

    const allowedSports = ['Fútbol', 'Baloncesto', 'Running'];

    if (!allowedSports.includes(sport)) {
        return { error: 'El deporte seleccionado no es válido.' };
    }

    if (Number.isNaN(price) || price <= 0 || price > 5000) {
        return { error: 'El precio debe ser un valor numérico válido entre 1 y 5000 €.' };
    }

    if (Number.isNaN(stock) || stock < 0 || stock > 10000) {
        return { error: 'El stock debe ser un número entero entre 0 y 10000.' };
    }

    if (description.length < 10 || description.length > 500) {
        return { error: 'La descripción debe tener entre 10 y 500 caracteres.' };
    }

    const sizes = rawSizes
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n) && n >= 20 && n <= 55);

    if (sizes.length === 0) {
        return { error: 'Debes seleccionar al menos una talla válida (entre 20 y 55).' };
    }

    if (!isEdit && !file) {
        return { error: 'Debes seleccionar una imagen para la nueva zapatilla.' };
    }

    const imageFilename = file ? file.filename : existingShoe.imageFilename;

    return {
        data: {
            shoeId,
            name,
            brand,
            price,
            sizes,
            colour,
            sport,
            stock,
            description,
            imageFilename
        }
    };
}


// Validate review fields on the server side
function validateReviewData(body) {
    const user = (body.user || '').trim();
    const date = (body.date || '').trim();
    const rating = parseInt(body.rating, 10);
    const text = (body.text || '').trim();

    if (!user || !date || !text) {
        return { error: 'Todos los campos de la reseña son obligatorios.' };
    }

    if (user.length < 2 || user.length > 50) {
        return { error: 'El nombre de usuario debe tener entre 2 y 50 caracteres.' };
    }

    if (Number.isNaN(Date.parse(date))) {
        return { error: 'La fecha introducida no es válida.' };
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
        return { error: 'La puntuación debe ser un número entero entre 1 y 5.' };
    }

    if (text.length < 5 || text.length > 300) {
        return { error: 'El comentario de la reseña debe tener entre 5 y 300 caracteres.' };
    }

    return {
        data: { user, date, rating, text }
    };
}

// Shared handler for creating and editing a shoe
async function handleShoeSave(req, res, isEdit) {
    const shoeId = req.params.id;
    const backUrl = isEdit ? `/shoe/${shoeId}/edit` : '/shoe/new';

    let existingShoe = null;
    if (isEdit) {
        existingShoe = await shoes.getShoe(shoeId);
        if (!existingShoe) {
            return res.status(404).render('error', {
                message: 'La zapatilla que intentas editar no existe.',
                backUrl: '/'
            });
        }
    }

    const validation = await validateShoeData(req.body, req.file, isEdit, existingShoe);
    if (validation.error) {
        return res.status(400).render('error', {
            message: validation.error,
            backUrl
        });
    }

    if (isEdit) {
        await shoes.updateShoe(shoeId, validation.data);
        return res.render('message', {
            text: 'La zapatilla se ha actualizado correctamente.',
            link: `/shoe/${shoeId}`,
            linkText: 'Volver al detalle del producto'
        });
    } else {
        const result = await shoes.addShoe({
            ...validation.data,
            reviews: []
        });
        return res.render('message', {
            text: 'La zapatilla se ha creado correctamente.',
            link: `/shoe/${result.insertedId}`,
            linkText: 'Ver detalle de la zapatilla'
        });
    }
}

// Main route: dynamic listing, search, sport filter, and pagination
router.get('/', async (req, res) => {
    const query = req.query.query || '';
    const sport = req.query.sport || '';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 6;

    const { items, total } = await shoes.getShoes(query, sport, page, limit);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    let filterQuery = '';
    if (query) filterQuery += `&query=${encodeURIComponent(query)}`;
    if (sport) filterQuery += `&sport=${encodeURIComponent(sport)}`;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push({
            number: i,
            active: i === page
        });
    }

    res.render('index', {
        shoes: items,
        query,
        sport,
        currentPage: page,
        totalPages,
        pages,
        hasPrev: page > 1,
        prevPage: page - 1,
        hasNext: page < totalPages,
        nextPage: page + 1,
        filterQuery
    });
});

// Create shoe form
router.get('/shoe/new', (req, res) => {
    res.render('shoeForm', {
        formTitle: 'Añadir nueva zapatilla',
        action: '/shoe/new',
        cancelUrl: '/',
        isNew: true,
        shoe: {}
    });
});

// Process new shoe creation
router.post('/shoe/new', upload.single('image'), async (req, res) => {
    await handleShoeSave(req, res, false);
});

// Shoe detail page
router.get('/shoe/:id', async (req, res) => {
    const shoe = await shoes.getShoe(req.params.id);
    if (!shoe) {
        return res.status(404).render('error', {
            message: 'No se ha encontrado la zapatilla solicitada.',
            backUrl: '/'
        });
    }
    res.render('producto', { shoe });
});

// Delete shoe
router.post('/shoe/:id/delete', async (req, res) => {
    const deleted = await shoes.deleteShoe(req.params.id);
    if (!deleted) {
        return res.status(404).render('error', {
            message: 'No se pudo eliminar la zapatilla porque no existe.',
            backUrl: '/'
        });
    }
    res.render('message', {
        text: 'La zapatilla ha sido eliminada correctamente.',
        link: '/',
        linkText: 'Volver a la página principal'
    });
});

// Edit shoe form (reusing shoeForm.html)
router.get('/shoe/:id/edit', async (req, res) => {
    const shoe = await shoes.getShoe(req.params.id);
    if (!shoe) {
        return res.status(404).render('error', {
            message: 'No se ha encontrado la zapatilla que intentas editar.',
            backUrl: '/'
        });
    }

    shoe.sizesString = Array.isArray(shoe.sizes) ? shoe.sizes.join(',') : '';

    res.render('shoeForm', {
        formTitle: 'Editar zapatilla',
        action: `/shoe/${shoe._id}/edit`,
        cancelUrl: `/shoe/${shoe._id}`,
        shoe,
        isFootball: shoe.sport === 'Fútbol',
        isBasketball: shoe.sport === 'Baloncesto',
        isRunning: shoe.sport === 'Running'
    });
});

// Process shoe edit (independent route, outside GET)
router.post('/shoe/:id/edit', upload.single('image'), async (req, res) => {
    await handleShoeSave(req, res, true);
});

// Create review (secondary entity)
router.post('/shoe/:id/review/new', async (req, res) => {
    const shoeId = req.params.id;
    const shoe = await shoes.getShoe(shoeId);
    if (!shoe) {
        return res.status(404).render('error', {
            message: 'La zapatilla asociada no existe.',
            backUrl: '/'
        });
    }

    const validation = validateReviewData(req.body);
    if (validation.error) {
        return res.status(400).render('error', {
            message: validation.error,
            backUrl: `/shoe/${shoeId}`
        });
    }

    await shoes.addReview(shoeId, validation.data);
    res.render('message', {
        text: 'Tu reseña se ha añadido correctamente.',
        link: `/shoe/${shoeId}`,
        linkText: 'Volver a la zapatilla'
    });
});

// Delete review
router.post('/shoe/:id/review/:reviewId/delete', async (req, res) => {
    const { id: shoeId, reviewId } = req.params;
    await shoes.deleteReview(shoeId, reviewId);
    res.render('message', {
        text: 'La reseña se ha eliminado correctamente.',
        link: `/shoe/${shoeId}`,
        linkText: 'Volver a la zapatilla'
    });
});

// Edit review form
router.get('/shoe/:id/review/:reviewId/edit', async (req, res) => {
    const { id: shoeId, reviewId } = req.params;
    const review = await shoes.getReview(shoeId, reviewId);
    if (!review) {
        return res.status(404).render('error', {
            message: 'No se ha encontrado la reseña solicitada.',
            backUrl: `/shoe/${shoeId}`
        });
    }

    res.render('editReview', {
        shoeId,
        review
    });
});

// Process review edit
router.post('/shoe/:id/review/:reviewId/edit', async (req, res) => {
    const { id: shoeId, reviewId } = req.params;
    const validation = validateReviewData(req.body);
    if (validation.error) {
        return res.status(400).render('error', {
            message: validation.error,
            backUrl: `/shoe/${shoeId}/review/${reviewId}/edit`
        });
    }

    await shoes.updateReview(shoeId, reviewId, validation.data);
    res.render('message', {
        text: 'La reseña se ha actualizado correctamente.',
        link: `/shoe/${shoeId}`,
        linkText: 'Volver a la zapatilla'
    });
});

export default router;