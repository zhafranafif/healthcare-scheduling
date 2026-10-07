import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Auth {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => String, { nullable: true })
    accessToken?: string;
}