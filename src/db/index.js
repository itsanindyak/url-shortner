import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const connectionIntance= await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log(`MongoDB connected !! DB HOST: ${connectionIntance.connection.host}`);
    
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1);
  }
};



export default connectDB