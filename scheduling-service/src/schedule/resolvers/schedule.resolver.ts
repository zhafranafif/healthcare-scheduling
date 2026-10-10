import { Injectable } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Schedule } from "../model/schedule.model.js";
import { CreateScheduleInput } from "../dto/create-schedule-input.js";
import { ScheduleService } from "../services/schedule.service.js";
import { SchedulePage } from "../model/schedule-page.model.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { FilterArgs } from "../dto/filter-args.js";


@Injectable()
export class ScheduleResolver {
    constructor(
        private readonly scheduleService: ScheduleService
    ) {}

    @Mutation(() => Schedule)
    async createSchedule(@Args ('createScheduleInput') createScheduleInput: CreateScheduleInput): Promise<Schedule> {
        return this.scheduleService.createSchedule(createScheduleInput);
    }

    @Query(() => Schedule)
    async getScheduleById(@Args('id') id: string): Promise<Schedule> {
        return this.scheduleService.getScheduleById(id);
    }

    @Mutation(() => Boolean)
    async deleteSchedule(@Args('id') id: string): Promise<boolean> {
        await this.scheduleService.deleteSchedule(id);
        return true;
    }

    @Query(() => SchedulePage)
    async getAllSchedules(@Args() paginationArgs: PaginationArgs, @Args() filterArgs: FilterArgs): Promise<SchedulePage> {
        return this.scheduleService.getAllSchedules(paginationArgs, filterArgs);
    }
}