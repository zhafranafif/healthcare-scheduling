import { Injectable } from "@nestjs/common";
import { convertDate } from "../../util/convert-date.js";
import { PrismaService } from "@healthcare-scheduling/database";
import { CreateScheduleData, ScheduleRecord } from "../types/schedule.types.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { FilterArgs } from "../dto/filter-args.js";
import { SchedulePage } from "../model/schedule-page.model.js";
import { toTemporalInstant } from "../../util/to-temporal.js";


@Injectable()
export class ScheduleRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async createSchedule(data: CreateScheduleData): Promise<ScheduleRecord> {
        const schedule = await this.prismaService.orm.Schedule.create({
            ...data,
            scheduledAt: toTemporalInstant(data.scheduledAt),
        });

        return {
            id: schedule.id,
            doctorId: schedule.doctorId,
            customerId: schedule.customerId,
            objective: schedule.objective,
            scheduledAt: convertDate(schedule.scheduledAt),
            createdAt: convertDate(schedule.createdAt),
            updatedAt: convertDate(schedule.updatedAt),
        };
    }

    async getScheduleById(id: string): Promise<ScheduleRecord | null> {
        const schedule = await this.prismaService.orm.Schedule.where({ id }).first();

        if (!schedule) {
            return null;
        }

        return {
            id: schedule.id,
            doctorId: schedule.doctorId,
            customerId: schedule.customerId,
            objective: schedule.objective,
            scheduledAt: convertDate(schedule.scheduledAt),
            createdAt: convertDate(schedule.createdAt),
            updatedAt: convertDate(schedule.updatedAt),
        };
    }

    async deleteSchedule(id: string): Promise<void> {
        await this.prismaService.orm.Schedule.where({ id }).delete();
    }

    async getAllSchedules(paginationArgs: PaginationArgs, filterArgs: FilterArgs): Promise<SchedulePage> {
        const { page, limit } = paginationArgs;
        const { doctorId, customerId, scheduledFrom, scheduledTo, objective } = filterArgs;

        const pageNum = page ?? 1;
        const pageLimit = limit ?? 10;


        let baseQuery = this.prismaService.orm.Schedule;

        if (doctorId) {
        baseQuery = baseQuery.where((p) => p.doctorId.ilike(`%${doctorId}%`));
        }
        if (customerId) {
        baseQuery = baseQuery.where((p) => p.customerId.ilike(`%${customerId}%`));
        }
        if (scheduledFrom) {
        baseQuery = baseQuery.where((p) => p.scheduledAt.gte(toTemporalInstant(scheduledFrom)));
        }
        if (scheduledTo) {
        baseQuery = baseQuery.where((p) => p.scheduledAt.lte(toTemporalInstant(scheduledTo)));
        }
        if (objective) {
        baseQuery = baseQuery.where((p) => p.objective.ilike(`%${objective}%`));
        }

        const [schedules, totalCountResult] = await Promise.all([
        baseQuery
            .orderBy((p) => p.createdAt.desc())
            .limit(pageLimit)
            .offset((pageNum - 1) * pageLimit)
            .all(),
        baseQuery.aggregate((a) => ({ total: a.count() })),
        ]);

        const scheduleRecords: ScheduleRecord[] = schedules.map((schedule) => ({
        id: schedule.id,
        doctorId: schedule.doctorId,
        customerId: schedule.customerId,
        objective: schedule.objective,
        scheduledAt: convertDate(schedule.scheduledAt),
        createdAt: convertDate(schedule.createdAt),
        updatedAt: convertDate(schedule.updatedAt),
        }));

        return {
        data: scheduleRecords,
        meta: {
            total: totalCountResult.total,
            page: pageNum,
            limit: pageLimit,
        },
        };
    }
}