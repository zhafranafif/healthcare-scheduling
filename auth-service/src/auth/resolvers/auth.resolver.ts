import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Auth } from "../model/auth.model.js";
import { RegisterUserInput } from "../dto/register-user.input.js";
import { AuthService } from "../services/auth.service.js";
import { LoginInput } from "../dto/login-input.js";


@Resolver(() => Auth)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    @Query(() => String, { name: 'hello', description: 'Placeholder query' })
    getHello(): string {
        return 'GraphQL server is running.';
    }


    @Mutation(() => Auth)
    async register(@Args('registerUserInput') registerUserInput: RegisterUserInput)
    : Promise<Auth> {
        return this.authService.register(registerUserInput);
    }

    @Mutation(() => Auth)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<Auth> {
        return this.authService.login(loginInput);
    }

    @Query(() => Auth)
    async validateToken(@Args('token') token: string): Promise<Auth> {
        return this.authService.validateToken(token);
    }
}