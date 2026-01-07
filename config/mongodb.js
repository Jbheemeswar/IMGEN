import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
    console.log("Connected DB:", mongoose.connection.name);

  } catch (error) {
    console.error("DB Error:", error.message);
  }
};

export default connectDB;
