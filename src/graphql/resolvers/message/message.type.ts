import { ObjectType, Field, ID } from "type-graphql";
import User from "../user/user.type";

@ObjectType()
class Message {
    @Field(type => ID)
    id!: string;

    @Field()
    contents!: string;

    @Field()
    from?: User;

    @Field()
    to?: User;

}


//IE: The type is used for collection of the messag's' been read.
@ObjectType()
export class Archive {
    @Field(type => ID)
    id!: string;

    @Field()
    contents!: string;

    @Field()
    from?: User;

    @Field()
    to?: User;

    @Field()
    archivedAt?: number;
};

export default Message;
