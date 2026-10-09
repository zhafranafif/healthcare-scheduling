export interface DoctorRecord {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDoctorData {
    name: string;
}