import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()

export function envOrThrow(key: string): string
{
    const value = process.env[key];

    if (value === undefined)
        throw new Error(`Environment variable ${key} is not set`);

    return value;
}

type APIConfig = {
    fileserverHits: number;
    platform: string;
    secret: string;
    polkaKey: string;
};

type DBConfig = {
    dbUrl: string;
    migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "src/db/migration"
};

const apiConfig: APIConfig = {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    secret: envOrThrow("TOKEN_STRING"),
    polkaKey: envOrThrow("POLKA_KEY"),
}

const dbConfig: DBConfig = {
    dbUrl: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
};

export const config = {
    api: apiConfig,
    db: dbConfig,
};