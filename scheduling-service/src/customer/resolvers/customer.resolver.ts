import { Injectable, UseGuards, } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { GqlAuthGuard } from "../../guard/gql-auth.guard.js";
import { Customer } from "../model/customer.model.js";
import { CustomerPage } from "../model/customer-page.model.js";
import { CreateCustomerInput } from "../dto/create-customer-input.js";
import { CustomerService } from "../services/customer.service.js";
import { UpdateCustomerInput } from "../dto/update-customer-input.js";
import { PaginationArgs } from "../dto/pagination-args.js";


@Injectable()
@UseGuards(GqlAuthGuard)
export class CustomerResolver {
    constructor(
        private readonly customerService: CustomerService 
    ) {}

    @Mutation(() => Customer)
    async createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerInput): Promise<Customer> {
        return this.customerService.createCustomer(createCustomerInput);
    }

    @Mutation(() => Customer)
    async updateCustomer(@Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput): Promise<Customer> {
        return this.customerService.updateCustomer(updateCustomerInput);
    }

    @Query(() => Customer)
    async getCustomerById(@Args('id') id: string): Promise<Customer> {
        return this.customerService.getCustomerById(id);
    }

    @Mutation(() => Boolean)
    async deleteCustomer(@Args('id') id: string): Promise<boolean> {
        await this.customerService.deleteCustomer(id);
        return true;
    }

    @Query(() => CustomerPage)
    async getAllCustomers(@Args() paginationArgs: PaginationArgs): Promise<CustomerPage> {
        return this.customerService.getAllCustomers(paginationArgs);
    }
}