import { Injectable } from "@nestjs/common";
import { CreateDoctorInput } from "../dto/create-doctor-input.js";
import { Doctor } from "../model/doctor.model.js";
import { DoctorRepository } from "../repositories/doctor.repository.js";
import { UpdateDoctorInput } from "../dto/update-doctor-input.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { DoctorPage } from "../model/doctor-page.model.js";


@Injectable()
export class DoctorService {
    constructor(
        private readonly doctorRepository: DoctorRepository
    ) {}

    async createDoctor(createDoctorInput: CreateDoctorInput): Promise<Doctor> {
        const doctor = await this.doctorRepository.createDoctor(createDoctorInput);
        return doctor;
    }

    async updateDoctor(updateDoctorInput: UpdateDoctorInput): Promise<Doctor> {
        const doctor = await this.doctorRepository.updateDoctor(updateDoctorInput);
        
        if (!doctor) {
            throw new Error(`Doctor with ID ${updateDoctorInput.id} not found`);
        }

        return doctor;
    }

    async getDoctorById(id: string): Promise<Doctor> {
        const doctor = await this.doctorRepository.getDoctorById(id);

        if (!doctor) {
            throw new Error(`Doctor with ID ${id} not found`);
        }

        return doctor;
    }

    async deleteDoctor(id: string): Promise<void> {
        await this.doctorRepository.deleteDoctor(id);
    }

    async getAllDoctors(paginationArgs: PaginationArgs): Promise<DoctorPage> {
        return this.doctorRepository.getAllDoctors(paginationArgs);
    }
}