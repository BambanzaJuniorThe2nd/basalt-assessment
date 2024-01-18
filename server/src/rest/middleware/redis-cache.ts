import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from "..";
import redisLib = require("redis");
import cron = require("node-cron");

// Centralized Redis configuration
const client = redisLib.createClient();
(async () => {
  await client.connect();
})();

client.on("connect", () => console.log("Redis Client Connected"));
client.on("error", (err) => console.log("Redis Client Connection Error", err));

// Hash to store large results
const CACHE_KEY = "searchResults";

// Middleware for compressing and caching responses
export const compressAndCache = async (
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNextFunction
) => {
  try {
    const { result, key: cacheKey } = res.locals;

    // Check cache first
    const cached = await client.hGet(CACHE_KEY, cacheKey);
    if (!cached) {
      console.log("NOT CACHED YET");

      // Cache compressed result
      await client.hSet(CACHE_KEY, cacheKey, JSON.stringify(result));
    }

    res.status(StatusCode.SUCCESS).send(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Gets data from the Redis cache.
 * Checks if cached data exists for the given key,
 * returning it if found or proceeding to next middleware if not found.
 */
export const getFromCache = async (
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNextFunction
) => {
  try {
    const cacheKey = req.params.id;
    const cachedData = await client.hGet(CACHE_KEY, cacheKey);

    if (cachedData) {
      res.status(StatusCode.SUCCESS).json(JSON.parse(cachedData));
    } else {
      // Data not found in cache, proceed to the next middleware (e.g., getById)
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getAllFromCache = async (
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNextFunction
) => {
  try {
    const cachedData = await client.hGetAll(CACHE_KEY);

    if (Object.keys(cachedData).length) {
      const parsedCachedData = Object.keys(cachedData).map((key) =>
        JSON.parse(cachedData[key])
      );
      res.status(StatusCode.SUCCESS).send(parsedCachedData);
    } else {
      // Data not found in cache, proceed to the next middleware (e.g., getById)
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Helper to clear cached results
async function clearCachedSearches() {
  await client.del(CACHE_KEY);
}

// Clear every hour
cron.schedule("0 * * * *", clearCachedSearches);
