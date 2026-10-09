import { beforeEach, describe, expect, it, vi } from "vitest";
import { DoctorRepository } from "../repositories/doctor.repository.js";
import { DoctorService } from "./doctor.service.js";

describe("DoctorService", () => {
    let service: DoctorService;
    let repository: Pick<DoctorRepository, "createDoctor" | "updateDoctor" | "getDoctorById" | "deleteDoctor" | "getAllDoctors">;
    const doctor = { id: "doctor-1", name: "Lee", createdAt: new Date(), updatedAt: new Date() };

    beforeEach(() => {
        repository = {
            createDoctor: vi.fn(), updateDoctor: vi.fn(), getDoctorById: vi.fn(),
            deleteDoctor: vi.fn(), getAllDoctors: vi.fn(),
        };
        service = new DoctorService(repository as DoctorRepository);
    });

    it("creates a doctor", async () => {
        vi.mocked(repository.createDoctor).mockResolvedValue(doctor);
        await expect(service.createDoctor({ name: doctor.name })).resolves.toEqual(doctor);
    });

    it("updates a doctor", async () => {
        vi.mocked(repository.updateDoctor).mockResolvedValue(doctor);
        await expect(service.updateDoctor({ id: doctor.id, name: doctor.name })).resolves.toEqual(doctor);
    });

    it("throws when an update target does not exist", async () => {
        vi.mocked(repository.updateDoctor).mockResolvedValue(null);
        await expect(service.updateDoctor({ id: doctor.id })).rejects.toThrow(`Doctor with ID ${doctor.id} not found`);
    });

    it("gets a doctor by id", async () => {
        vi.mocked(repository.getDoctorById).mockResolvedValue(doctor);
        await expect(service.getDoctorById(doctor.id)).resolves.toEqual(doctor);
    });

    it("throws when a doctor does not exist", async () => {
        vi.mocked(repository.getDoctorById).mockResolvedValue(null);
        await expect(service.getDoctorById(doctor.id)).rejects.toThrow(`Doctor with ID ${doctor.id} not found`);
    });

    it("deletes a doctor", async () => {
        vi.mocked(repository.deleteDoctor).mockResolvedValue(undefined);
        await expect(service.deleteDoctor(doctor.id)).resolves.toBeUndefined();
    });

    it("returns all doctors", async () => {
        const page = { data: [doctor], meta: { total: 1, page: 1, limit: 10 } };
        vi.mocked(repository.getAllDoctors).mockResolvedValue(page);
        await expect(service.getAllDoctors({ page: 1, limit: 10 })).resolves.toEqual(page);
    });
});