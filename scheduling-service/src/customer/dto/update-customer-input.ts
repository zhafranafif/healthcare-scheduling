import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class UpdateCustomerInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;
}