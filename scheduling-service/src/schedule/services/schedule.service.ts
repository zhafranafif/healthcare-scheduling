import { Injectable } from "@nestjs/common";
import { CreateScheduleInput } from "../dto/create-schedule-input.js";
import { Schedule } from "../model/schedule.model.js";
import { DoctorRepository } from "../../doctor/repositories/doctor.repository.js";
import { CustomerRepository } from "../../customer/repositories/customer.repository.js";
import { ScheduleRepository } from "../repositories/schedule.repositoy.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { FilterArgs } from "../dto/filter-args.js";
import { SchedulePage } from "../model/schedule-page.model.js";


@Injectable()
export class ScheduleService {
    constructor(
        private readonly scheduleRepository: ScheduleRepository,
        private readonly doctorRepository: DoctorRepository,
        private readonly customerRepository: CustomerRepository
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

        return this.scheduleRepository.createSchedule(createScheduleInput);
    }

    async getScheduleById(id: string): Promise<Schedule> {
        const schedule = await this.scheduleRepository.getScheduleById(id);

        if (!schedule) {
            throw new Error(`Schedule with ID ${id} not found.`);
        }

        return schedule;
    }

    async deleteSchedule(id: string): Promise<void> {
        await this.scheduleRepository.deleteSchedule(id);
    }

    async getAllSchedules(paginationArgs: PaginationArgs, filterArgs: FilterArgs): Promise<SchedulePage> {
        return this.scheduleRepository.getAllSchedules(paginationArgs, filterArgs);
    }
}