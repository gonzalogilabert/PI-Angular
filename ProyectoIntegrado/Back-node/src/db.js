import mongoose from "mongoose"; // Force restart

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    console.log("Intentando conectar a MongoDB...");
    // Masking password for security
    const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log("URI:", maskedUri);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(" Conectado a la base de datos");
  } catch (error) {
    console.error(" Error conectando:", error);
    if (error.reason) console.error("Razón:", error.reason);
    process.exit(1);
  }
}