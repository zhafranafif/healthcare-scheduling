import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Doctor {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => Date)
    createdAt?: Date;

    @Field(() => Date)
    updatedAt?: Date;
}