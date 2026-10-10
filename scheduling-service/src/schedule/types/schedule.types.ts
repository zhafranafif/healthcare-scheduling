export interface CreateScheduleData {
    objective: string;
    doctorId: string;
    customerId: string;
    scheduledAt: Date;
}

export interface ScheduleRecord {
    id: string;
    objective: string;
    doctorId: string;
    customerId: string;
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}