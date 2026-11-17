import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('stepup');
const shoes = db.collection('shoes');

export const UPLOADS_FOLDER = './uploads';

// Escape special regex characters to prevent server errors on queries like "(" or "["
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function addShoe(shoe) {
    return await shoes.insertOne(shoe);
}

export async function updateShoe(id, updatedFields) {
    return await shoes.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFields }
    );
}

export async function deleteShoe(id) {
    return await shoes.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function getShoes(query = '', sport = '', page = 1, limit = 6) {
    const filter = {};

    if (query) {
        const safeQuery = escapeRegex(query);
        filter.$or = [
            { name: { $regex: safeQuery, $options: 'i' } },
            { brand: { $regex: safeQuery, $options: 'i' } }
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
    if (!ObjectId.isValid(id)) return null;
    return await shoes.findOne({ _id: new ObjectId(id) });
}

export async function countShoes() {
    return await shoes.countDocuments();
}

// Check if another shoe already has the exact same name (case-insensitive)
export async function isShoeNameTaken(name, excludeId = null) {
    const filter = {
        name: { $regex: `^${escapeRegex(name.trim())}$`, $options: 'i' }
    };
    if (excludeId && ObjectId.isValid(excludeId)) {
        filter._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await shoes.findOne(filter);
    return existing !== null;
}

// Secondary entity (reviews) operations
export async function addReview(shoeId, review) {
    const newReview = {
        _id: new ObjectId(),
        ...review
    };
    return await shoes.updateOne(
        { _id: new ObjectId(shoeId) },
        { $push: { reviews: newReview } }
    );
}

export async function deleteReview(shoeId, reviewId) {
    if (!ObjectId.isValid(shoeId) || !ObjectId.isValid(reviewId)) return null;
    return await shoes.updateOne(
        { _id: new ObjectId(shoeId) },
        { $pull: { reviews: { _id: new ObjectId(reviewId) } } }
    );
}

export async function getReview(shoeId, reviewId) {
    if (!ObjectId.isValid(shoeId) || !ObjectId.isValid(reviewId)) return null;
    const shoe = await getShoe(shoeId);
    if (!shoe || !Array.isArray(shoe.reviews)) return null;
    return shoe.reviews.find((r) => r._id && r._id.toString() === reviewId) || null;
}

export async function updateReview(shoeId, reviewId, updatedReview) {
    if (!ObjectId.isValid(shoeId) || !ObjectId.isValid(reviewId)) return null;
    return await shoes.updateOne(
        {
            _id: new ObjectId(shoeId),
            'reviews._id': new ObjectId(reviewId)
        },
        {
            $set: {
                'reviews.$.user': updatedReview.user,
                'reviews.$.date': updatedReview.date,
                'reviews.$.rating': updatedReview.rating,
                'reviews.$.text': updatedReview.text
            }
        }
    );
}
// Check if another shoe already has the exact same numeric shoeId
export async function isShoeIdTaken(shoeId, excludeId = null) {
    const filter = { shoeId };
    if (excludeId && ObjectId.isValid(excludeId)) {
        filter._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await shoes.findOne(filter);
    return existing !== null;
}

// Ensure all existing reviews in the database have an _id field
export async function ensureReviewIds() {
    const allShoes = await shoes.find({ 'reviews.0': { $exists: true } }).toArray();
    for (const shoe of allShoes) {
        let updated = false;
        const fixedReviews = shoe.reviews.map((review) => {
            if (!review._id) {
                updated = true;
                return { _id: new ObjectId(), ...review };
            }
            return review;
        });
        if (updated) {
            await shoes.updateOne(
                { _id: shoe._id },
                { $set: { reviews: fixedReviews } }
            );
        }
    }
}