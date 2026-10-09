import { PrismaService } from "@healthcare-scheduling/database";
import { Injectable } from "@nestjs/common";
import { CreateCustomerData, CustomerRecord, UpdateCustomerData, UpdateCustomerRecord } from "../types/customer.types.js";
import { convertDate } from "../../util/convert-date.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { CustomerPage } from "../model/customer-page.model.js";


@Injectable()
export class CustomerRepository {
    constructor(
        private readonly prisma: PrismaService 
    ) {}

    async createCustomer(createCustomerInput: CreateCustomerData): Promise<CustomerRecord> {
        const customer = await this.prisma.orm.Customer.create(createCustomerInput);

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            createdAt: convertDate(customer.createdAt),
            updatedAt: convertDate(customer.updatedAt),
        };
    }

    async updateCustomer(updateCustomerInput: UpdateCustomerData): Promise<UpdateCustomerRecord | null> {
        const customer = await this.prisma.orm.Customer.where({ id: updateCustomerInput.id}).update({
            name: updateCustomerInput.name,
            email: updateCustomerInput.email,
        });

        if (!customer) {
            return null;
        }

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            updatedAt: convertDate(customer.updatedAt),
        };
    }

    async getCustomerById(id: string): Promise<CustomerRecord | null> {
        const customer = await this.prisma.orm.Customer.where({ id }).first();

        if (!customer) {
            return null;
        }

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            createdAt: convertDate(customer.createdAt),
            updatedAt: convertDate(customer.updatedAt),
        };
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.prisma.orm.Customer.where({ id }).delete();
    }

    async getAllCustomers(paginationArgs: PaginationArgs): Promise<CustomerPage> {
        const customers = await this.prisma.orm.Customer.orderBy((p) => p.createdAt.desc())
        .limit(paginationArgs.limit || 10)
        .offset(((paginationArgs.page || 1) - 1) * (paginationArgs.limit || 10))
        .all();

        const totalCustomers = (await this.prisma.orm.Customer.aggregate((agg) => ({ total: agg.count() }))).total;

        return {
            data: customers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                createdAt: convertDate(customer.createdAt),
                updatedAt: convertDate(customer.updatedAt),
            })),
            meta: {
                total: totalCustomers,
                page: paginationArgs.page || 1,
                limit: paginationArgs.limit || 10,
            }
        };
    }
}