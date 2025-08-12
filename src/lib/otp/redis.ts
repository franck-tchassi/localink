// lib/redis.ts
import { Redis } from "ioredis";

const getRedisConfig = () => {
  if (process.env.REDIS_DATABASE_URI) {
    const uri = process.env.REDIS_DATABASE_URI;
    // Nettoyer l'URI et extraire les composants
    const cleanedUri = uri.replace(/^"+|"+$/g, '');
    
    // Pour une configuration plus sécurisée
    if (cleanedUri.startsWith('rediss://')) {
      return {
        uri: cleanedUri,
        tls: {
          rejectUnauthorized: false // Nécessaire pour Upstash
        },
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        }
      };
    }
  }
  throw new Error('REDIS_DATABASE_URI is not properly configured');
};

const redisConfig = getRedisConfig();
const redis = new Redis(redisConfig.uri, redisConfig);

// Gestion des erreurs
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

export default redis;