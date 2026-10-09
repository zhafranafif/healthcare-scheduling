import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCustomerData, CustomerRecord, UpdateCustomerRecord } from "../types/customer.types.js";
import { CustomerRepository } from "../repositories/customer.repository.js";
import { UpdateCustomerInput } from "../dto/update-customer-input.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { CustomerPage } from "../model/customer-page.model.js";


@Injectable()
export class CustomerService {
    constructor(
        private readonly customerRepository: CustomerRepository
    ) {}

    async createCustomer(createCustomerInput: CreateCustomerData): Promise<CustomerRecord> {
        const customer = await this.customerRepository.createCustomer(createCustomerInput);
        return customer;
    }

    async updateCustomer(updateCustomerInput: UpdateCustomerInput): Promise<UpdateCustomerRecord> {
        const customer = await this.customerRepository.updateCustomer(updateCustomerInput);

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${updateCustomerInput.id} not found`);
        }

        return customer;
    }

    async getCustomerById(id: string): Promise<CustomerRecord> {
        const customer = await this.customerRepository.getCustomerById(id);

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }

        return customer;
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.customerRepository.deleteCustomer(id);
    }

    async getAllCustomers(paginationArgs: PaginationArgs): Promise<CustomerPage> {
        const customers = await this.customerRepository.getAllCustomers(paginationArgs);
        return customers;
    }
}