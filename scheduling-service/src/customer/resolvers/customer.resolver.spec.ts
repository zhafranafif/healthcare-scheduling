import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerService } from "../services/customer.service.js";
import { CustomerResolver } from "./customer.resolver.js";

describe("CustomerResolver", () => {
    let resolver: CustomerResolver;
    let service: Pick<CustomerService, "createCustomer" | "updateCustomer" | "getCustomerById" | "deleteCustomer" | "getAllCustomers">;
    const customer = { id: "customer-1", name: "Pat", email: "pat@example.com", createdAt: new Date(), updatedAt: new Date() };

    beforeEach(() => {
        service = {
            createCustomer: vi.fn(), updateCustomer: vi.fn(), getCustomerById: vi.fn(),
            deleteCustomer: vi.fn(), getAllCustomers: vi.fn(),
        };
        resolver = new CustomerResolver(service as CustomerService);
    });

    it("forwards create", async () => {
        const input = { name: customer.name, email: customer.email };
        vi.mocked(service.createCustomer).mockResolvedValue(customer);
        await expect(resolver.createCustomer(input)).resolves.toEqual(customer);
        expect(service.createCustomer).toHaveBeenCalledWith(input);
    });
    it("forwards update", async () => {
        const input = { id: customer.id, name: customer.name };
        vi.mocked(service.updateCustomer).mockResolvedValue(customer);
        await expect(resolver.updateCustomer(input)).resolves.toEqual(customer);
        expect(service.updateCustomer).toHaveBeenCalledWith(input);
    });
    it("forwards get by id", async () => {
        vi.mocked(service.getCustomerById).mockResolvedValue(customer);
        await expect(resolver.getCustomerById(customer.id)).resolves.toEqual(customer);
        expect(service.getCustomerById).toHaveBeenCalledWith(customer.id);
    });
    it("deletes and returns true", async () => {
        vi.mocked(service.deleteCustomer).mockResolvedValue(undefined);
        await expect(resolver.deleteCustomer(customer.id)).resolves.toBe(true);
        expect(service.deleteCustomer).toHaveBeenCalledWith(customer.id);
    });
    it("forwards list pagination", async () => {
        const args = { page: 1, limit: 10 };
        const page = { data: [customer], meta: { total: 1, ...args } };
        vi.mocked(service.getAllCustomers).mockResolvedValue(page);
        await expect(resolver.getAllCustomers(args)).resolves.toEqual(page);
        expect(service.getAllCustomers).toHaveBeenCalledWith(args);
    });
});