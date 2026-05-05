import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { RefreshToken, refreshTokens } from "../schema.js";

export async function createToken(token: RefreshToken): Promise<RefreshToken | undefined>
{
    const result = await db.insert(refreshTokens)
                           .values(token)
                           .returning();
    return result.at(0);
}

export async function getToken(token: string): Promise<RefreshToken | undefined>
{
    const result = await db.select()
                           .from(refreshTokens)
                           .where(eq(refreshTokens.token, token));
    return result.at(0);
}

export async function revokeToken(refreshToken: string): Promise<void>
{
    const dateNow = new Date;
    await db.update(refreshTokens)
            .set({
                revokedAt: dateNow,
                updatedAt: dateNow,
            })
            .where(eq(refreshTokens.token, refreshToken));
}