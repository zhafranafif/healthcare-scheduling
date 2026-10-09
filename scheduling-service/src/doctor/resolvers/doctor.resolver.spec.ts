import { beforeEach, describe, expect, it, vi } from "vitest";
import { DoctorService } from "../services/doctor.service.js";
import { DoctorResolver } from "./doctor.resolver.js";

describe("DoctorResolver", () => {
    let resolver: DoctorResolver;
    let service: Pick<DoctorService, "createDoctor" | "updateDoctor" | "getDoctorById" | "deleteDoctor" | "getAllDoctors">;
    const doctor = { id: "doctor-1", name: "Lee", createdAt: new Date(), updatedAt: new Date() };

    beforeEach(() => {
        service = {
            createDoctor: vi.fn(), updateDoctor: vi.fn(), getDoctorById: vi.fn(),
            deleteDoctor: vi.fn(), getAllDoctors: vi.fn(),
        };
        resolver = new DoctorResolver(service as DoctorService);
    });

    it("forwards create", async () => {
        const input = { name: doctor.name };
        vi.mocked(service.createDoctor).mockResolvedValue(doctor);
        await expect(resolver.createDoctor(input)).resolves.toEqual(doctor);
        expect(service.createDoctor).toHaveBeenCalledWith(input);
    });
    it("forwards update", async () => {
        const input = { id: doctor.id, name: doctor.name };
        vi.mocked(service.updateDoctor).mockResolvedValue(doctor);
        await expect(resolver.updateDoctor(input)).resolves.toEqual(doctor);
        expect(service.updateDoctor).toHaveBeenCalledWith(input);
    });
    it("forwards get by id", async () => {
        vi.mocked(service.getDoctorById).mockResolvedValue(doctor);
        await expect(resolver.getDoctorById(doctor.id)).resolves.toEqual(doctor);
        expect(service.getDoctorById).toHaveBeenCalledWith(doctor.id);
    });
    it("deletes and returns true", async () => {
        vi.mocked(service.deleteDoctor).mockResolvedValue(undefined);
        await expect(resolver.deleteDoctor(doctor.id)).resolves.toBe(true);
        expect(service.deleteDoctor).toHaveBeenCalledWith(doctor.id);
    });
    it("forwards list pagination", async () => {
        const args = { page: 1, limit: 10 };
        const page = { data: [doctor], meta: { total: 1, ...args } };
        vi.mocked(service.getAllDoctors).mockResolvedValue(page);
        await expect(resolver.getAllDoctors(args)).resolves.toEqual(page);
        expect(service.getAllDoctors).toHaveBeenCalledWith(args);
    });
});