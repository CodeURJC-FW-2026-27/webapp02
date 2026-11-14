import fs from 'node:fs/promises';
import * as shoes from './shoes.js';

const UPLOADS_FOLDER = './uploads';
const DATA_FOLDER = './data';
const dataFile = 'data.json';

const count = await shoes.countShoes();

if (count === 0) {
    const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');
    const initialShoes = JSON.parse(dataString);

    for (let shoe of initialShoes) {
        await shoes.addShoe(shoe);
    }

    await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
    await fs.cp(DATA_FOLDER + '/images', UPLOADS_FOLDER, { recursive: true });

    console.log('Demo data loaded');
}