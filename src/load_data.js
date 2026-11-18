
import fs from 'node:fs/promises';
import { ObjectId } from 'mongodb';
import * as shoes from './shoes.js';

const UPLOADS_FOLDER = './uploads';
const DATA_FOLDER = './data';
const dataFile = 'data.json';

// Check how many shoes are already stored in the database
const count = await shoes.countShoes();

if (count === 0) {
    const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');
    const initialShoes = JSON.parse(dataString);

    for (const shoe of initialShoes) {
        if (Array.isArray(shoe.reviews)) {
            shoe.reviews = shoe.reviews.map((review) => ({
                _id: new ObjectId(),
                ...review
            }));
        } else {
            shoe.reviews = [];
        }

        await shoes.addShoe(shoe);
    }

    console.log('Demo data loaded');
}

// Always ensure that the uploads directory contains the example images
await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
await fs.cp(DATA_FOLDER + '/images', UPLOADS_FOLDER, { recursive: true });

// Ensure all existing reviews have an ObjectId
await shoes.ensureReviewIds();
