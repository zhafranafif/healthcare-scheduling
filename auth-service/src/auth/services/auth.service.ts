import { Injectable, Logger } from "@nestjs/common";
import { RegisterUserInput } from "../dto/register-user.input.js";
import { Auth } from "../model/auth.model.js";
import * as bcrypt from 'bcrypt';
import { AuthRepository } from "../repositories/auth.repository.js";
import { LoginInput } from "../dto/login-input.js";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) {}

    async register(registerUserInput: RegisterUserInput): Promise<Auth> {
        const { email, password } = registerUserInput;

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const newUser = await this.authRepository.createUser({
            email,
            password: hashedPassword,
        });

        this.logger.log(`User registered: ${newUser.email} (ID: ${newUser.id})`);
        return {
            id: newUser.id,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };

    }
    
    async login(loginInput: LoginInput): Promise<Auth> {
        const { email, password } = loginInput;

        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const accessToken = this.jwtService.sign({ userId: user.id, email: user.email });

        this.logger.log(`User logged in: ${user.email} (ID: ${user.id})`);

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            accessToken,
        };
    }

    async validateToken(token: string): Promise<Auth> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.authRepository.findByEmail(decoded.email);
            if (!user) {
                throw new Error('Invalid token - user not found');
            }

            this.logger.log(`Token validated for user: ${user.email} (ID: ${user.id})`);

            return {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        } catch (error) {
            throw new Error('Invalid token or token has expired');
        }
    }
}