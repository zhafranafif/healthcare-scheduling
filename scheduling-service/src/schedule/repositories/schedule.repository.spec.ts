import { PrismaService } from "@healthcare-scheduling/database";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScheduleRepository } from "./schedule.repositoy.js";

vi.mock("@healthcare-scheduling/database", () => ({ PrismaService: class PrismaService {} }));

describe("ScheduleRepository", () => {
    let repository: ScheduleRepository;
    let create: ReturnType<typeof vi.fn>;
    let where: ReturnType<typeof vi.fn>;
    let first: ReturnType<typeof vi.fn>;
    let deleteRecord: ReturnType<typeof vi.fn>;
    const record = {
        id: "schedule-1", objective: "Consultation", doctorId: "doctor-1", customerId: "customer-1",
        scheduledAt: new Date("2026-11-01T10:00:00.000Z"), createdAt: new Date(), updatedAt: new Date(),
    };

    beforeEach(() => {
        create = vi.fn(); where = vi.fn(); first = vi.fn(); deleteRecord = vi.fn();
        const prisma = { orm: { Schedule: { create, where } } } as unknown as PrismaService;
        repository = new ScheduleRepository(prisma);
    });

    it("creates and maps a schedule", async () => {
        create.mockResolvedValue(record);
        await expect(repository.createSchedule(record)).resolves.toEqual(record);
    });

    it("finds a schedule by id or returns null", async () => {
        where.mockReturnValue({ first });
        first.mockResolvedValue(record);
        await expect(repository.getScheduleById(record.id)).resolves.toEqual(record);
        first.mockResolvedValue(null);
        await expect(repository.getScheduleById(record.id)).resolves.toBeNull();
    });

    it("deletes by id", async () => {
        where.mockReturnValue({ delete: deleteRecord });
        deleteRecord.mockResolvedValue(undefined);
        await repository.deleteSchedule(record.id);
        expect(where).toHaveBeenCalledWith({ id: record.id });
    });
});