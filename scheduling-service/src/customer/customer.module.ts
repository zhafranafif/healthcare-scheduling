import { Module } from "@nestjs/common";
import { CustomerService } from "./services/customer.service.js";
import { CustomerRepository } from "./repositories/customer.repository.js";
import { CustomerResolver } from "./resolvers/customer.resolver.js";
import { PrismaModule } from "@healthcare-scheduling/database";
import { AuthModule } from "../guard/auth.module.js";


@Module({
    imports: [PrismaModule, AuthModule],
    providers: [CustomerService, CustomerRepository, CustomerResolver],
    exports: [CustomerRepository],
})
export class CustomerModule {}