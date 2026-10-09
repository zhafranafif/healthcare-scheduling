import { PrismaService } from "@healthcare-scheduling/database";
import { Injectable } from "@nestjs/common";
import { convertDate } from "../../util/convert-date.js";
import { CreateDoctorData, DoctorRecord } from "../types/doctor.types.js";
import { UpdateDoctorInput } from "../dto/update-doctor-input.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { DoctorPageMeta } from "../model/doctor-page.model.js";


@Injectable()
export class DoctorRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createDoctor(createDoctorInput: CreateDoctorData): Promise<DoctorRecord> {
        const doctor = await this.prisma.orm.Doctor.create(createDoctorInput);

        return {
            id: doctor.id,
            name: doctor.name,
            createdAt: convertDate(doctor.createdAt),
            updatedAt: convertDate(doctor.updatedAt),
        };
    }

    async updateDoctor(updateDoctorInput: UpdateDoctorInput): Promise<DoctorRecord | null> {
        const doctor = await this.prisma.orm.Doctor.where({ id: updateDoctorInput.id }).update({
            name: updateDoctorInput.name,
        });

        if (!doctor) {
           return null;
        }
        return {
            id: doctor.id,
            name: doctor.name,
            createdAt: convertDate(doctor.createdAt),
            updatedAt: convertDate(doctor.updatedAt),
        };
    }

    async getDoctorById(id: string): Promise<DoctorRecord | null> {
        const doctor = await this.prisma.orm.Doctor.where({ id }).first();

        if (!doctor) {
            return null;
        }

        return {
            id: doctor.id,
            name: doctor.name,
            createdAt: convertDate(doctor.createdAt),
            updatedAt: convertDate(doctor.updatedAt),
        };
    }

    async deleteDoctor(id: string): Promise<void> {
        await this.prisma.orm.Doctor.where({ id }).delete();
    }

    async getAllDoctors(paginationArgs: PaginationArgs): Promise<{ data: DoctorRecord[]; meta: DoctorPageMeta }> {
        const doctors = await this.prisma.orm.Doctor
        .offset(((paginationArgs.page || 1) - 1) * (paginationArgs.limit || 10))
        .limit(paginationArgs.limit || 10)
        .all();

        const totalDoctors = (await this.prisma.orm.Doctor.aggregate((agg) => ({ total: agg.count() }))).total;

        return {
            data: doctors.map((doctor) => ({
                id: doctor.id,
                name: doctor.name,
                createdAt: convertDate(doctor.createdAt),
                updatedAt: convertDate(doctor.updatedAt),
            })),
            meta: {
                total: totalDoctors,
                page: paginationArgs.page || 1,
                limit: paginationArgs.limit || 10,
            }
        };
    }
}