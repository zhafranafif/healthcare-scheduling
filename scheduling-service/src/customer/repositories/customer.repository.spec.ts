import { PrismaService } from "@healthcare-scheduling/database";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerRepository } from "./customer.repository.js";

vi.mock("@healthcare-scheduling/database", () => ({ PrismaService: class PrismaService {} }));

describe("CustomerRepository", () => {
    let repository: CustomerRepository;
    let create: ReturnType<typeof vi.fn>;
    let where: ReturnType<typeof vi.fn>;
    let first: ReturnType<typeof vi.fn>;
    let update: ReturnType<typeof vi.fn>;
    let deleteRecord: ReturnType<typeof vi.fn>;

    const record = { id: "customer-1", name: "Pat", email: "pat@example.com", createdAt: new Date(), updatedAt: new Date() };

    beforeEach(() => {
        create = vi.fn(); where = vi.fn(); first = vi.fn(); update = vi.fn(); deleteRecord = vi.fn();
        const prisma = { orm: { Customer: { create, where, aggregate: vi.fn() } } } as unknown as PrismaService;
        repository = new CustomerRepository(prisma);
    });

    it("creates and maps a customer", async () => {
        create.mockResolvedValue(record);
        await expect(repository.createCustomer({ name: record.name, email: record.email })).resolves.toEqual(record);
    });

    it("updates a customer and returns null for a missing record", async () => {
        where.mockReturnValue({ update });
        update.mockResolvedValue(record);
        await expect(repository.updateCustomer({ id: record.id, name: record.name })).resolves.toEqual({
            id: record.id, name: record.name, email: record.email, updatedAt: record.updatedAt,
        });
        update.mockResolvedValue(null);
        await expect(repository.updateCustomer({ id: record.id })).resolves.toBeNull();
    });

    it("finds a customer by id or returns null", async () => {
        where.mockReturnValue({ first });
        first.mockResolvedValue(record);
        await expect(repository.getCustomerById(record.id)).resolves.toEqual(record);
        first.mockResolvedValue(null);
        await expect(repository.getCustomerById(record.id)).resolves.toBeNull();
    });

    it("deletes by id", async () => {
        where.mockReturnValue({ delete: deleteRecord });
        deleteRecord.mockResolvedValue(undefined);
        await repository.deleteCustomer(record.id);
        expect(where).toHaveBeenCalledWith({ id: record.id });
        expect(deleteRecord).toHaveBeenCalledOnce();
    });
});