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
    dbUrl: string;
};

export const config: APIConfig = {
    fileserverHits: 0,
    dbUrl: envOrThrow("DB_URL"),
};