export interface CreateUserData {
    email: string;
    password: string;
}

export interface UserRecord {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
