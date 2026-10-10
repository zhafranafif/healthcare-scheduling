import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Doctor } from "./doctor.model.js";


@ObjectType()
export class DoctorPageMeta {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
}

@ObjectType()
export class DoctorPage {
    @Field(() => [Doctor])
    data: Doctor[];

    @Field(() => DoctorPageMeta)
    meta: DoctorPageMeta;
}
