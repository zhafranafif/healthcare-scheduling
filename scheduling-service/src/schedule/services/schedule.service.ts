import { Injectable } from "@nestjs/common";
import { CreateScheduleInput } from "../dto/create-schedule-input.js";
import { Schedule } from "../model/schedule.model.js";
import { DoctorRepository } from "../../doctor/repositories/doctor.repository.js";
import { CustomerRepository } from "../../customer/repositories/customer.repository.js";
import { ScheduleRepository } from "../repositories/schedule.repository.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { FilterArgs } from "../dto/filter-args.js";
import { SchedulePage } from "../model/schedule-page.model.js";
import { ScheduleNotificationProducer } from "./schedule-notification.producer.js";
import { formatScheduleDate } from "../../util/format-schedule-date.js";


@Injectable()
export class ScheduleService {
    constructor(
        private readonly scheduleRepository: ScheduleRepository,
        private readonly doctorRepository: DoctorRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly notificationProducer: ScheduleNotificationProducer,
    ) {}

    async createSchedule(createScheduleInput: CreateScheduleInput): Promise<Schedule> {
        const doctor = await this.doctorRepository.getDoctorById(createScheduleInput.doctorId);

        if (!doctor) {
            throw new Error(`Doctor with ID ${createScheduleInput.doctorId} not found.`);
        }

        const customer = await this.customerRepository.getCustomerById(createScheduleInput.customerId);

        if (!customer) {
            throw new Error(`Customer with ID ${createScheduleInput.customerId} not found.`);
        }

        if (createScheduleInput.scheduledAt < new Date()) {
            throw new Error("Scheduled date cannot be in the past.");
        }

        const schedule = await this.scheduleRepository.createSchedule(createScheduleInput);

        // Queue a notification for the customer
        await this.notificationProducer.enqueueEmail(
            customer.email,
            "Schedule created",
            `Your schedule with ${doctor.name} for ${schedule.objective} is set for ${formatScheduleDate(schedule.scheduledAt)}.`,
            `schedule-created-${schedule.id}`,
        );

        return schedule;
    }

    async getScheduleById(id: string): Promise<Schedule> {
        const schedule = await this.scheduleRepository.getScheduleById(id);

        if (!schedule) {
            throw new Error(`Schedule with ID ${id} not found.`);
        }

        return schedule;
    }

    async deleteSchedule(id: string): Promise<void> {
        const schedule = await this.scheduleRepository.getScheduleById(id);
        const customer = schedule
            ? await this.customerRepository.getCustomerById(schedule.customerId)
            : null;

        await this.scheduleRepository.deleteSchedule(id);

        if (schedule && customer) {

            // Queue a notification for the customer about the deletion
            await this.notificationProducer.enqueueEmail(
                customer.email,
                "Schedule deleted",
                `Your schedule for ${schedule.objective} on ${formatScheduleDate(schedule.scheduledAt)} has been deleted.`,
                `schedule-deleted-${schedule.id}`,
            );
        }
    }

    async getAllSchedules(paginationArgs: PaginationArgs, filterArgs: FilterArgs): Promise<SchedulePage> {
        return this.scheduleRepository.getAllSchedules(paginationArgs, filterArgs);
    }
}