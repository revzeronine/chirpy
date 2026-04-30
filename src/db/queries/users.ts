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

export async function deleteUsers()
{
    await db.delete(users);
}