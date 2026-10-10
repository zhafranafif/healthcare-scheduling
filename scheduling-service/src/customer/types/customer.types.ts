export interface CreateCustomerData {
    name: string;
    email: string;
}

export interface CustomerRecord {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateCustomerData {
    id: string;
    name?: string;
    email?: string;
}

export interface UpdateCustomerRecord {
    id: string;
    name: string;
    email: string;
    updatedAt: Date;
}