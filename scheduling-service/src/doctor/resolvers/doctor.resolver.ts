import { Injectable } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Doctor } from "../model/doctor.model.js";
import { CreateDoctorInput } from "../dto/create-doctor-input.js";
import { DoctorService } from "../services/doctor.service.js";
import { UpdateDoctorInput } from "../dto/update-doctor-input.js";
import { PaginationArgs } from "../dto/pagination-args.js";
import { DoctorPage } from "../model/doctor-page.model.js";


@Injectable()
export class DoctorResolver {
    constructor(
        private readonly doctorService: DoctorService
    ) {}

    @Mutation(() => Doctor)
    async createDoctor(@Args('createDoctorInput') createDoctorInput: CreateDoctorInput): Promise<Doctor> {
        return this.doctorService.createDoctor(createDoctorInput);
    }

    @Mutation(() => Doctor)
    async updateDoctor(@Args('updateDoctorInput') updateDoctorInput: UpdateDoctorInput): Promise<Doctor> {
        return this.doctorService.updateDoctor(updateDoctorInput);
    }

    @Query(() => Doctor)
    async getDoctorById(@Args('id') id: string): Promise<Doctor> {
        return this.doctorService.getDoctorById(id);
    }

    @Mutation(() => Boolean)
    async deleteDoctor(@Args('id') id: string): Promise<boolean> {
        await this.doctorService.deleteDoctor(id);
        return true;
    }

    @Query(() => DoctorPage)
    async getAllDoctors(@Args() paginationArgs: PaginationArgs): Promise<DoctorPage> {
        return this.doctorService.getAllDoctors(paginationArgs);
    }
}