import mongoose from "mongoose";
import Redis from "ioredis";
const connectDB = async () => {
  try {
    const connectionIntance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `MongoDB connected !! DB HOST: ${connectionIntance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1);
  }
};
const connectRedis = async (maxRetries = 5, delay = 3000) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`🔁 Redis connection attempt ${attempt}...`);

    const redis = new Redis(process.env.REDIS_URL, {
      tls: {}, // Required for Aiven
      lazyConnect: true,
    });

    try {
      await redis.connect();
      console.log("✅ Redis connected");
      return redis;
    } catch (error) {
      console.error(`❌ Redis connection failed:`, error.message);
      if (attempt === maxRetries) {
        console.error("🚫 Max retries reached. Exiting.");
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};
export { connectDB, connectRedis };
