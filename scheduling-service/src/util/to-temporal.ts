import { Temporal } from "temporal-polyfill";

export function toTemporalInstant(value: Date): Temporal.Instant {
    return Temporal.Instant.from(value.toISOString());
}