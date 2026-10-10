import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Schedule } from "./schedule.model.js";

@ObjectType()
export class SchedulePageMeta {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
}

@ObjectType()
export class SchedulePage {
    @Field(() => [Schedule])
    data: Schedule[];

    @Field(() => SchedulePageMeta)
    meta: SchedulePageMeta;
}
