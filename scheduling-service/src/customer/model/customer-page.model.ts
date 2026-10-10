import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Customer } from "./customer.model.js";

@ObjectType()
export class CustomerPageMeta {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
}

@ObjectType()
export class CustomerPage {
    @Field(() => [Customer])
    data: Customer[];

    @Field(() => CustomerPageMeta)
    meta: CustomerPageMeta;
}
