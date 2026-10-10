import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScheduleService } from "../services/schedule.service.js";
import { ScheduleResolver } from "./schedule.resolver.js";

describe("ScheduleResolver", () => {
    let resolver: ScheduleResolver;
    let service: Pick<ScheduleService, "createSchedule" | "getScheduleById" | "deleteSchedule" | "getAllSchedules">;
    const schedule = {
        id: "schedule-1", objective: "Consultation", doctorId: "doctor-1", customerId: "customer-1",
        scheduledAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    };

    beforeEach(() => {
        service = { createSchedule: vi.fn(), getScheduleById: vi.fn(), deleteSchedule: vi.fn(), getAllSchedules: vi.fn() };
        resolver = new ScheduleResolver(service as ScheduleService);
    });

    it("forwards create", async () => {
        const input = { objective: schedule.objective, doctorId: schedule.doctorId, customerId: schedule.customerId, scheduledAt: schedule.scheduledAt };
        vi.mocked(service.createSchedule).mockResolvedValue(schedule);
        await expect(resolver.createSchedule(input)).resolves.toEqual(schedule);
        expect(service.createSchedule).toHaveBeenCalledWith(input);
    });
    it("forwards get by id", async () => {
        vi.mocked(service.getScheduleById).mockResolvedValue(schedule);
        await expect(resolver.getScheduleById(schedule.id)).resolves.toEqual(schedule);
        expect(service.getScheduleById).toHaveBeenCalledWith(schedule.id);
    });
    it("deletes and returns true", async () => {
        vi.mocked(service.deleteSchedule).mockResolvedValue(undefined);
        await expect(resolver.deleteSchedule(schedule.id)).resolves.toBe(true);
        expect(service.deleteSchedule).toHaveBeenCalledWith(schedule.id);
    });
    it("forwards pagination and filters", async () => {
        const pagination = { page: 1, limit: 10 };
        const filters = { doctorId: schedule.doctorId };
        const page = { data: [schedule], meta: { total: 1, ...pagination } };
        vi.mocked(service.getAllSchedules).mockResolvedValue(page);
        await expect(resolver.getAllSchedules(pagination, filters)).resolves.toEqual(page);
        expect(service.getAllSchedules).toHaveBeenCalledWith(pagination, filters);
    });
});