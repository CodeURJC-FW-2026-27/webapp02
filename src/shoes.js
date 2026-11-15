import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('stepup');
const shoes = db.collection('shoes');

export const UPLOADS_FOLDER = './uploads';

export async function addShoe(shoe) {
    return await shoes.insertOne(shoe);
}

export async function getShoes(query = '', sport = '', page = 1, limit = 6) {
    const filter = {};
    if (query) {
        // Search by name or brand (case-insensitive)
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { brand: { $regex: query, $options: 'i' } }
        ];
    }
    if (sport) {
        filter.sport = sport;
    }
    const skip = (page - 1) * limit;
    const total = await shoes.countDocuments(filter);
    const items = await shoes.find(filter).skip(skip).limit(limit).toArray();
    return { items, total };
}

export async function getShoe(id) {
    return await shoes.findOne({ _id: new ObjectId(id) });
}

export async function countShoes() {
    return await shoes.countDocuments();
}