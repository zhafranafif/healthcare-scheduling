import { Module } from "@nestjs/common";
import { ScheduleService } from "./services/schedule.service.js";
import { ScheduleRepository } from "./repositories/schedule.repositoy.js";
import { ScheduleResolver } from "./resolvers/schedule.resolver.js";
import { PrismaModule } from "@healthcare-scheduling/database";
import { AuthModule } from "../guard/auth.module.js";
import { DoctorModule } from "../doctor/doctor.module.js";
import { CustomerModule } from "../customer/customer.module.js";


@Module({
    imports: [PrismaModule, AuthModule, DoctorModule, CustomerModule],
    providers: [ScheduleService, ScheduleRepository, ScheduleResolver],
})
export class ScheduleModule {}