import { ObjectType, Field, ID } from "type-graphql";
import Message from "../message/message.type";

@ObjectType()
class User {
    @Field(type => ID)
    id!: string;

    @Field({ nullable: true })
    name?: string;

    @Field()
    unreadMessageCount?: number;

    @Field(type => [Message])
    inbox?: Message[];
}

export default User;
