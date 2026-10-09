import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerRepository } from "../../customer/repositories/customer.repository.js";
import { DoctorRepository } from "../../doctor/repositories/doctor.repository.js";
import { ScheduleRepository } from "../repositories/schedule.repositoy.js";
import { ScheduleNotificationProducer } from "./schedule-notification.producer.js";
import { ScheduleService } from "./schedule.service.js";

describe("ScheduleService", () => {
    let service: ScheduleService;
    let scheduleRepository: Pick<ScheduleRepository, "createSchedule" | "getScheduleById" | "deleteSchedule" | "getAllSchedules">;
    let doctorRepository: Pick<DoctorRepository, "getDoctorById">;
    let customerRepository: Pick<CustomerRepository, "getCustomerById">;
    let notificationProducer: Pick<ScheduleNotificationProducer, "enqueueEmail">;

    const doctor = { id: "doctor-1", name: "Lee", createdAt: new Date(), updatedAt: new Date() };
    const customer = {
        id: "customer-1", name: "Pat", email: "pat@example.com",
        createdAt: new Date(), updatedAt: new Date(),
    };
    const schedule = {
        id: "schedule-1", objective: "Consultation", doctorId: doctor.id, customerId: customer.id,
        scheduledAt: new Date("2026-11-01T10:00:00.000Z"), createdAt: new Date(), updatedAt: new Date(),
    };
    const input = {
        objective: schedule.objective, doctorId: doctor.id, customerId: customer.id,
        scheduledAt: schedule.scheduledAt,
    };

    beforeEach(() => {
        scheduleRepository = {
            createSchedule: vi.fn(), getScheduleById: vi.fn(), deleteSchedule: vi.fn(), getAllSchedules: vi.fn(),
        };
        doctorRepository = { getDoctorById: vi.fn() };
        customerRepository = { getCustomerById: vi.fn() };
        notificationProducer = { enqueueEmail: vi.fn().mockResolvedValue(undefined) };
        service = new ScheduleService(
            scheduleRepository as ScheduleRepository,
            doctorRepository as DoctorRepository,
            customerRepository as CustomerRepository,
            notificationProducer as ScheduleNotificationProducer,
        );
    });

    it("creates a schedule and queues a notification", async () => {
        vi.mocked(doctorRepository.getDoctorById).mockResolvedValue(doctor);
        vi.mocked(customerRepository.getCustomerById).mockResolvedValue(customer);
        vi.mocked(scheduleRepository.createSchedule).mockResolvedValue(schedule);

        await expect(service.createSchedule(input)).resolves.toEqual(schedule);
        expect(notificationProducer.enqueueEmail).toHaveBeenCalledWith(
            customer.email,
            "Schedule created",
            expect.stringContaining(schedule.objective),
            `schedule-created-${schedule.id}`,
        );
    });

    it("does not create a schedule if the doctor is missing", async () => {
        vi.mocked(doctorRepository.getDoctorById).mockResolvedValue(null);
        await expect(service.createSchedule(input)).rejects.toThrow(`Doctor with ID ${doctor.id} not found.`);
        expect(scheduleRepository.createSchedule).not.toHaveBeenCalled();
    });

    it("does not create a schedule if the customer is missing", async () => {
        vi.mocked(doctorRepository.getDoctorById).mockResolvedValue(doctor);
        vi.mocked(customerRepository.getCustomerById).mockResolvedValue(null);
        await expect(service.createSchedule(input)).rejects.toThrow(`Customer with ID ${customer.id} not found.`);
        expect(scheduleRepository.createSchedule).not.toHaveBeenCalled();
    });

    it("gets a schedule by id", async () => {
        vi.mocked(scheduleRepository.getScheduleById).mockResolvedValue(schedule);
        await expect(service.getScheduleById(schedule.id)).resolves.toEqual(schedule);
    });

    it("throws when a schedule is missing", async () => {
        vi.mocked(scheduleRepository.getScheduleById).mockResolvedValue(null);
        await expect(service.getScheduleById(schedule.id)).rejects.toThrow(`Schedule with ID ${schedule.id} not found.`);
    });

    it("deletes a schedule and queues a notification", async () => {
        vi.mocked(scheduleRepository.getScheduleById).mockResolvedValue(schedule);
        vi.mocked(customerRepository.getCustomerById).mockResolvedValue(customer);
        vi.mocked(scheduleRepository.deleteSchedule).mockResolvedValue(undefined);

        await service.deleteSchedule(schedule.id);

        expect(scheduleRepository.deleteSchedule).toHaveBeenCalledWith(schedule.id);
        expect(notificationProducer.enqueueEmail).toHaveBeenCalledWith(
            customer.email,
            "Schedule deleted",
            expect.stringContaining(schedule.objective),
            `schedule-deleted-${schedule.id}`,
        );
    });

    it("deletes an absent schedule without queuing an email", async () => {
        vi.mocked(scheduleRepository.getScheduleById).mockResolvedValue(null);
        vi.mocked(scheduleRepository.deleteSchedule).mockResolvedValue(undefined);

        await service.deleteSchedule(schedule.id);

        expect(notificationProducer.enqueueEmail).not.toHaveBeenCalled();
    });

    it("returns the schedule page", async () => {
        const page = { data: [schedule], meta: { total: 1, page: 1, limit: 10 } };
        vi.mocked(scheduleRepository.getAllSchedules).mockResolvedValue(page);
        await expect(service.getAllSchedules({ page: 1, limit: 10 }, {})).resolves.toEqual(page);
    });
});