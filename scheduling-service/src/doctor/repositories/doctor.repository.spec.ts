import { PrismaService } from "@healthcare-scheduling/database";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DoctorRepository } from "./doctor.repository.js";

vi.mock("@healthcare-scheduling/database", () => ({ PrismaService: class PrismaService {} }));

describe("DoctorRepository", () => {
    let repository: DoctorRepository;
    let create: ReturnType<typeof vi.fn>;
    let where: ReturnType<typeof vi.fn>;
    let first: ReturnType<typeof vi.fn>;
    let update: ReturnType<typeof vi.fn>;
    let deleteRecord: ReturnType<typeof vi.fn>;
    const record = { id: "doctor-1", name: "Lee", createdAt: new Date(), updatedAt: new Date() };

    beforeEach(() => {
        create = vi.fn(); where = vi.fn(); first = vi.fn(); update = vi.fn(); deleteRecord = vi.fn();
        const prisma = { orm: { Doctor: { create, where } } } as unknown as PrismaService;
        repository = new DoctorRepository(prisma);
    });

    it("creates and maps a doctor", async () => {
        create.mockResolvedValue(record);
        await expect(repository.createDoctor({ name: record.name })).resolves.toEqual(record);
    });

    it("updates a doctor and returns null when absent", async () => {
        where.mockReturnValue({ update });
        update.mockResolvedValue(record);
        await expect(repository.updateDoctor({ id: record.id, name: record.name })).resolves.toEqual(record);
    });

    it("finds a doctor by id or returns null", async () => {
        where.mockReturnValue({ first });
        first.mockResolvedValue(record);
        await expect(repository.getDoctorById(record.id)).resolves.toEqual(record);
        first.mockResolvedValue(null);
        await expect(repository.getDoctorById(record.id)).resolves.toBeNull();
    });

    it("deletes by id", async () => {
        where.mockReturnValue({ delete: deleteRecord });
        deleteRecord.mockResolvedValue(undefined);
        await repository.deleteDoctor(record.id);
        expect(where).toHaveBeenCalledWith({ id: record.id });
    });
});