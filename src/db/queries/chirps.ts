import { asc, eq } from "drizzle-orm";
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

export async function getChirpsForUser(userId: string): Promise<Chirp[]>
{
    const result = await db.select()
                           .from(chirps)
                           .where(eq(chirps.userId, userId))
                           .orderBy(asc(chirps.createdAt));
    return result;
}

export async function getChirp(chirpId: string): Promise<Chirp | undefined>
{
    const result = await db.select()
                           .from(chirps)
                           .where(eq(chirps.id, chirpId));
    return result.at(0);
}

export async function deleteChirp(chirpId: string)
{
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}