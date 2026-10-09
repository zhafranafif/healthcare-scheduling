export function  formatScheduleDate(value: Date): string {
    return `${new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "UTC",
    }).format(value)}`;
}