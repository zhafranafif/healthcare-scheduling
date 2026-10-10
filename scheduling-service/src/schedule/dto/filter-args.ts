import { ArgsType, Field } from "@nestjs/graphql";


@ArgsType()
export class FilterArgs {
    @Field(() => String, { nullable: true })
    doctorId?: string;

    @Field(() => String, { nullable: true })
    customerId?: string;

    @Field(() => Date, { nullable: true })
    scheduledFrom?: Date;

    @Field(() => Date, { nullable: true })
    scheduledTo?: Date;
    
    @Field(() => String, { nullable: true })
    objective?: string;
}