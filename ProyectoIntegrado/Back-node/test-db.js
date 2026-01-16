import mongoose from 'mongoose';
import 'dotenv/config';

async function test() {
    const uri = process.env.MONGODB_URI;
    console.log("URI:", uri.replace(/:([^@]+)@/, ":****@"));
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE");
        console.error(err);
        process.exit(1);
    }
}

test();
