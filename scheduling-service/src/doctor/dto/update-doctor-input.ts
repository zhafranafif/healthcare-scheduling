import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class UpdateDoctorInput {
    @Field()
    id: string;

    @Field()
    name: string;
}