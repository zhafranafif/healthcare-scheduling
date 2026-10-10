import { NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerRepository } from "../repositories/customer.repository.js";
import { CustomerService } from "./customer.service.js";

describe("CustomerService", () => {
    let service: CustomerService;
    let repository: Pick<CustomerRepository, "createCustomer" | "updateCustomer" | "getCustomerById" | "deleteCustomer" | "getAllCustomers">;
    const record = {
        id: "customer-1", name: "Pat", email: "pat@example.com",
        createdAt: new Date(), updatedAt: new Date(),
    };

    beforeEach(() => {
        repository = {
            createCustomer: vi.fn(), updateCustomer: vi.fn(), getCustomerById: vi.fn(),
            deleteCustomer: vi.fn(), getAllCustomers: vi.fn(),
        };
        service = new CustomerService(repository as CustomerRepository);
    });

    it("creates a customer", async () => {
        vi.mocked(repository.createCustomer).mockResolvedValue(record);
        await expect(service.createCustomer({ name: record.name, email: record.email })).resolves.toEqual(record);
    });

    it("updates an existing customer", async () => {
        vi.mocked(repository.updateCustomer).mockResolvedValue(record);
        await expect(service.updateCustomer({ id: record.id, name: record.name })).resolves.toEqual(record);
    });

    it("throws when the customer update finds no record", async () => {
        vi.mocked(repository.updateCustomer).mockResolvedValue(null);
        await expect(service.updateCustomer({ id: record.id })).rejects.toBeInstanceOf(NotFoundException);
    });

    it("gets a customer by id", async () => {
        vi.mocked(repository.getCustomerById).mockResolvedValue(record);
        await expect(service.getCustomerById(record.id)).resolves.toEqual(record);
    });

    it("throws when the customer is missing", async () => {
        vi.mocked(repository.getCustomerById).mockResolvedValue(null);
        await expect(service.getCustomerById(record.id)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("deletes a customer", async () => {
        vi.mocked(repository.deleteCustomer).mockResolvedValue(undefined);
        await expect(service.deleteCustomer(record.id)).resolves.toBeUndefined();
        expect(repository.deleteCustomer).toHaveBeenCalledWith(record.id);
    });

    it("returns the customer page", async () => {
        const page = { data: [record], meta: { total: 1, page: 1, limit: 10 } };
        vi.mocked(repository.getAllCustomers).mockResolvedValue(page);
        await expect(service.getAllCustomers({ page: 1, limit: 10 })).resolves.toEqual(page);
    });
});