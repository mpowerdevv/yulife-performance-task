import { ObjectType, Field, ID } from "type-graphql";
import Message, { Archive } from "../message/message.type";

@ObjectType()
class User {
    @Field(type => ID)
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    unreadMessageCount?: number;

    @Field()
    readMessageCount?: number;

    @Field(type => [Message])
    inbox?: Message[];

    @Field(type => [Archive])
    archive?: Archive[];
}

export default User;
