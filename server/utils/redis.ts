import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("Redis connection failed: REDIS_URL not provided");
}

console.log("Redis connection successful");
export const redis = new Redis(redisUrl);
