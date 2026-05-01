import { asc } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";

export async function createChirp(chirp: Chirp): Promise<Chirp | undefined>
{
    const result = await db.insert(chirps)
                           .values(chirp)
                           .returning();
    return result.at(0);
}

export async function getChirps(): Promise<Chirp[]>
{
    const result = await db.select()
                           .from(chirps)
                           .orderBy(asc(chirps.createdAt));
    return result;
}