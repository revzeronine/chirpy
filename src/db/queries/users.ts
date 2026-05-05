import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { User, users } from "../schema.js";

export async function createUser(user: User): Promise<User | undefined>
{
    const result = await db.insert(users)
                           .values(user)
                           .onConflictDoNothing()
                           .returning();
    return result.at(0);
}

export async function updateCredentials(userId: string, 
                                        email: string, 
                                        password: string): Promise<User | undefined>
{
    const result = await db.update(users)
                           .set({
                               email: email,
                               hashedPassword: password,
                           })
                           .where(eq(users.id, userId))
                           .returning();
    return result.at(0);
}

export async function getUserByEmail(email: string): Promise<User | undefined>
{
    const result = await db.select()
                           .from(users)
                           .where(eq(users.email, email));
    return result.at(0);
}

export async function deleteUsers()
{
    await db.delete(users);
}