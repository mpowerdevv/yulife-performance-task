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

    //IE: number of messages been read.
    @Field()
    readMessageCount?: number;

    @Field(type => [Message])
    inbox?: Message[];

    //IE: collection to hold the message have been read to reduce inbox volumes
    @Field(type => [Archive])
    archive?: Archive[];
}

export default User;
