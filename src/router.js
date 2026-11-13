import express from 'express';
import * as shoes from './shoes.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const shoesList = await shoes.getShoes();
  
    res.render('index', { shoes: shoesList });
});

export default router;