export function convertDate(value: unknown): Date {
    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
        throw new Error('Database returned an invalid timestamp');
    }

    return date;
}