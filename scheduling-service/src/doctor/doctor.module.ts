import { PrismaModule } from "@healthcare-scheduling/database";
import { Module } from "@nestjs/common";
import { AuthModule } from "../guard/auth.module.js";
import { DoctorResolver } from "./resolvers/doctor.resolver.js";
import { DoctorRepository } from "./repositories/doctor.repository.js";
import { DoctorService } from "./services/doctor.service.js";


@Module({
    imports: [PrismaModule, AuthModule],
    providers: [DoctorService, DoctorRepository, DoctorResolver],
    exports: [DoctorRepository],
})
export class DoctorModule {}