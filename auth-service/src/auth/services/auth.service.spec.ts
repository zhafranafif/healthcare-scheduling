import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthRepository } from "../repositories/auth.repository.js";
import { UserRecord } from "../types/auth.types.js";
import { AuthService } from "./auth.service.js";

vi.mock("bcrypt", () => ({
    hash: vi.fn(),
    compare: vi.fn(),
}));

const bcryptHashMock = bcrypt.hash as unknown as {
    mockReset(): void;
    mockResolvedValue(value: string): void;
};
const bcryptCompareMock = bcrypt.compare as unknown as {
    mockReset(): void;
    mockResolvedValue(value: boolean): void;
};

describe("AuthService", () => {
    let service: AuthService;
    let authRepository: Pick<AuthRepository, "createUser" | "findByEmail">;
    let jwtService: Pick<JwtService, "sign" | "verify">;

    const user: UserRecord = {
        id: "user-1",
        email: "person@example.com",
        password: "hashed-password",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    beforeEach(() => {
        authRepository = {
            createUser: vi.fn(),
            findByEmail: vi.fn(),
        };
        jwtService = {
            sign: vi.fn(),
            verify: vi.fn(),
        };
        service = new AuthService(
            authRepository as AuthRepository,
            jwtService as JwtService,
        );

        bcryptHashMock.mockReset();
        bcryptCompareMock.mockReset();
    });

    describe("register", () => {
        it("hashes the password and creates a user", async () => {
            bcryptHashMock.mockResolvedValue("hashed-password");
            vi.mocked(authRepository.findByEmail).mockResolvedValue(null);
            vi.mocked(authRepository.createUser).mockResolvedValue(user);

            const result = await service.register({
                email: user.email,
                password: "plain-password",
            });

            expect(bcrypt.hash).toHaveBeenCalledWith("plain-password", 10);
            expect(authRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(authRepository.createUser).toHaveBeenCalledWith({
                email: user.email,
                password: "hashed-password",
            });
            expect(result).toEqual({
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        });

        it("rejects an existing email without creating another user", async () => {
            bcryptHashMock.mockResolvedValue("hashed-password");
            vi.mocked(authRepository.findByEmail).mockResolvedValue(user);

            await expect(service.register({
                email: user.email,
                password: "plain-password",
            })).rejects.toThrow("User with this email already exists");

            expect(authRepository.createUser).not.toHaveBeenCalled();
        });
    });

    describe("login", () => {
        it("returns an access token for valid credentials", async () => {
            vi.mocked(authRepository.findByEmail).mockResolvedValue(user);
            bcryptCompareMock.mockResolvedValue(true);
            vi.mocked(jwtService.sign).mockReturnValue("access-token");

            const result = await service.login({
                email: user.email,
                password: "plain-password",
            });

            expect(bcrypt.compare).toHaveBeenCalledWith("plain-password", user.password);
            expect(jwtService.sign).toHaveBeenCalledWith({
                userId: user.id,
                email: user.email,
            });
            expect(result.accessToken).toBe("access-token");
        });

        it("rejects an unknown email without comparing passwords", async () => {
            vi.mocked(authRepository.findByEmail).mockResolvedValue(null);

            await expect(service.login({
                email: user.email,
                password: "plain-password",
            })).rejects.toThrow("Invalid email or password");

            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwtService.sign).not.toHaveBeenCalled();
        });

        it("rejects an incorrect password without signing a token", async () => {
            vi.mocked(authRepository.findByEmail).mockResolvedValue(user);
            bcryptCompareMock.mockResolvedValue(false);

            await expect(service.login({
                email: user.email,
                password: "wrong-password",
            })).rejects.toThrow("Invalid email or password");

            expect(jwtService.sign).not.toHaveBeenCalled();
        });
    });

    describe("validateToken", () => {
        it("returns the user for a valid token", async () => {
            vi.mocked(jwtService.verify).mockReturnValue({ email: user.email });
            vi.mocked(authRepository.findByEmail).mockResolvedValue(user);

            const result = await service.validateToken("access-token");

            expect(jwtService.verify).toHaveBeenCalledWith("access-token");
            expect(authRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(result).toEqual({
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        });

        it("rejects a token when its user no longer exists", async () => {
            vi.mocked(jwtService.verify).mockReturnValue({ email: user.email });
            vi.mocked(authRepository.findByEmail).mockResolvedValue(null);

            await expect(service.validateToken("access-token"))
                .rejects.toThrow("Invalid token or token has expired");
        });

        it("rejects an invalid or expired token", async () => {
            vi.mocked(jwtService.verify).mockImplementation(() => {
                throw new Error("Token expired");
            });

            await expect(service.validateToken("expired-token"))
                .rejects.toThrow("Invalid token or token has expired");

            expect(authRepository.findByEmail).not.toHaveBeenCalled();
        });
    });
});