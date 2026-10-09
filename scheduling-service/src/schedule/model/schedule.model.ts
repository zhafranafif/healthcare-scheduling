import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Schedule {
    @Field()
    id: string;

    @Field()
    objective: string

    @Field()
    customerId: string;

    @Field()
    doctorId: string;

    @Field(() => Date)
    scheduledAt: Date;

    @Field(() => Date)
    createdAt?: Date;
    
    @Field(() => Date)
    updatedAt?: Date;
}