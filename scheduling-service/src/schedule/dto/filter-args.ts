import { ArgsType, Field } from "@nestjs/graphql";


@ArgsType()
export class FilterArgs {
    @Field(() => String, { nullable: true })
    doctorId?: string;

    @Field(() => String, { nullable: true })
    customerId?: string;

    @Field(() => Date, { nullable: true })
    scheduledAt?: Date;
    
    @Field(() => String, { nullable: true })
    objective?: string;
}