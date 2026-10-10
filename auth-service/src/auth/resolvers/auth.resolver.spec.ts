import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginInput } from "../dto/login-input.js";
import { RegisterUserInput } from "../dto/register-user.input.js";
import { Auth } from "../model/auth.model.js";
import { AuthService } from "../services/auth.service.js";
import { AuthResolver } from "./auth.resolver.js";

describe("AuthResolver", () => {
    let resolver: AuthResolver;
    let authService: Pick<AuthService, "register" | "login" | "validateToken">;

    const auth: Auth = {
        id: "user-1",
        email: "person@example.com",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
        accessToken: "access-token",
    };

    beforeEach(() => {
        authService = {
            register: vi.fn(),
            login: vi.fn(),
            validateToken: vi.fn(),
        };
        resolver = new AuthResolver(authService as AuthService);
    });

    it("forwards registration to AuthService", async () => {
        const input: RegisterUserInput = {
            email: auth.email,
            password: "plain-password",
        };
        vi.mocked(authService.register).mockResolvedValue(auth);

        await expect(resolver.register(input)).resolves.toEqual(auth);
        expect(authService.register).toHaveBeenCalledWith(input);
    });

    it("forwards login to AuthService", async () => {
        const input: LoginInput = {
            email: auth.email,
            password: "plain-password",
        };
        vi.mocked(authService.login).mockResolvedValue(auth);

        await expect(resolver.login(input)).resolves.toEqual(auth);
        expect(authService.login).toHaveBeenCalledWith(input);
    });

    it("forwards token validation to AuthService", async () => {
        vi.mocked(authService.validateToken).mockResolvedValue(auth);

        await expect(resolver.validateToken("access-token")).resolves.toEqual(auth);
        expect(authService.validateToken).toHaveBeenCalledWith("access-token");
    });
});