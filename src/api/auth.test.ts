import { describe, it, expect, beforeAll } from "vitest";
import { Request } from "express";

import { checkPasswordHash, getApiKey, getBearerToken, hashPassword, makeJWT, validateJWT } from "./auth.js";
import { UnauthorizedError } from "../error.js";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result1 = await checkPasswordHash(password1, hash1);
        expect(result1).toBe(true);

        const result2 = await checkPasswordHash(password2, hash2);
        expect(result2).toBe(true);
    });

    it("should return false for the incorrect password", async () => {
        const result1 = await checkPasswordHash(password1, hash2);
        expect(result1).toBe(false);

        const result2 = await checkPasswordHash(password2, hash1);
        expect(result2).toBe(false);
    });
});

describe("JWT Functions", () => {
    const secret = "some_secret";
    const userId = "userid";
    let token: string;

    beforeAll(async () => {
        token = makeJWT(userId, 3600, secret);
    });

    it("should validate and return the user ID from token", () => {
        const result = validateJWT(token, secret);
        expect(result).toBe(userId);
    });

    it("should throw an error for an invalid token string", () => {
        expect(() => validateJWT("invalid.token.string", secret)).toThrow(
            UnauthorizedError,
        );
    });

    it("should throw an error for using the wrong secret", () => {
        expect(() => validateJWT(token, "wrongsecret")).toThrow(
            UnauthorizedError,
        );
    });
});

describe("Bearer Key Parsing", () => {
    it("should return just the token without the Bearer prefix", () => {
        const request: Request = {
            get: (header: string) =>
                header === "Authorization" ? "Bearer abcdefg" : undefined,
        } as Request;
        expect(getBearerToken(request)).toBe("abcdefg");
    });

    it("should remove trailing whitespace from the token", () => {
        const request: Request = {
            get: (header: string) =>
                header === "Authorization" ? "Bearer    aabbcc  " : undefined,
        } as Request;
        expect(getBearerToken(request)).toBe("aabbcc");
    });
});

describe("API Key Parsing", () => {
    it("should return just the token without the ApiKey prefix", () => {
        const request: Request = {
            get: (header: string) =>
                header === "Authorization" ? "ApiKey abcdefg" : undefined,
        } as Request;
        expect(getApiKey(request)).toBe("abcdefg");
    });

    it("should remove trailing whitespace from the token", () => {
        const request: Request = {
            get: (header: string) =>
                header === "Authorization" ? "ApiKey    aabbcc  " : undefined,
        } as Request;
        expect(getApiKey(request)).toBe("aabbcc");
    });
});