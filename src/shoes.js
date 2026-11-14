import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('stepup');
const shoes = db.collection('shoes');

export const UPLOADS_FOLDER = './uploads';

export async function addShoe(shoe) {
    return await shoes.insertOne(shoe);
}

export async function deleteShoe(id) {
    return await shoes.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function getShoes() {
    return await shoes.find().toArray();
}

export async function getShoe(id) {
    return await shoes.findOne({ _id: new ObjectId(id) });
}

export async function countShoes() {
    return await shoes.countDocuments();
}