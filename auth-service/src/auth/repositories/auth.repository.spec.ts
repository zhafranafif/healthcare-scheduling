import { PrismaService } from "@healthcare-scheduling/database";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthRepository } from "./auth.repository.js";

vi.mock("@healthcare-scheduling/database", () => ({
    PrismaService: class PrismaService {},
}));

describe("AuthRepository", () => {
    let repository: AuthRepository;
    let createUser: ReturnType<typeof vi.fn>;
    let whereUser: ReturnType<typeof vi.fn>;
    let firstUser: ReturnType<typeof vi.fn>;

    const databaseUser = {
        id: "user-1",
        email: "person@example.com",
        password: "hashed-password",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    beforeEach(() => {
        createUser = vi.fn();
        whereUser = vi.fn();
        firstUser = vi.fn();

        const prismaService = {
            orm: {
                User: {
                    create: createUser,
                    where: whereUser,
                },
            },
        } as unknown as PrismaService;

        repository = new AuthRepository(prismaService);
    });

    it("creates and maps a user record", async () => {
        createUser.mockResolvedValue(databaseUser);

        const result = await repository.createUser({
            email: databaseUser.email,
            password: databaseUser.password,
        });

        expect(createUser).toHaveBeenCalledWith({
            email: databaseUser.email,
            password: databaseUser.password,
        });
        expect(result).toEqual(databaseUser);
    });

    it("finds and maps a user by email", async () => {
        whereUser.mockReturnValue({ first: firstUser });
        firstUser.mockResolvedValue(databaseUser);

        const result = await repository.findByEmail(databaseUser.email);

        expect(whereUser).toHaveBeenCalledWith({ email: databaseUser.email });
        expect(firstUser).toHaveBeenCalledOnce();
        expect(result).toEqual(databaseUser);
    });

    it("returns null when no user matches the email", async () => {
        whereUser.mockReturnValue({ first: firstUser });
        firstUser.mockResolvedValue(null);

        const result = await repository.findByEmail("missing@example.com");

        expect(result).toBeNull();
    });
});