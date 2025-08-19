import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-1",
});

interface DatabaseCredentials {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbname: string;
}

interface ApplicationSecrets {
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  PAYSERA_PROJECT_ID: string;
  PAYSERA_SIGN_PASSWORD: string;
  VENIPAK_API_KEY: string;
  VENIPAK_USERNAME: string;
  VENIPAK_PASSWORD: string;
}

interface RedisConnection {
  REDIS_HOST: string;
  REDIS_PORT: string;
}

export async function getDatabaseCredentials(): Promise<DatabaseCredentials> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: "medusa/database/credentials",
    });
    const response = await client.send(command);
    return JSON.parse(response.SecretString!);
  } catch (error) {
    console.error("Error retrieving database credentials:", error);
    throw error;
  }
}

export async function getApplicationSecrets(): Promise<ApplicationSecrets> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: "medusa/application/secrets",
    });
    const response = await client.send(command);
    return JSON.parse(response.SecretString!);
  } catch (error) {
    console.error("Error retrieving application secrets:", error);
    throw error;
  }
}

export async function getRedisConnection(): Promise<RedisConnection> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: "medusa/redis/connection",
    });
    const response = await client.send(command);
    return JSON.parse(response.SecretString!);
  } catch (error) {
    console.error("Error retrieving Redis connection:", error);
    throw error;
  }
}