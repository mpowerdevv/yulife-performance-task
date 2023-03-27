import { Resolver, Mutation, Ctx, Root, Arg, FieldResolver } from "type-graphql";
import Message from "./message.type";
import User from "../user/user.type";
import Context from "../../context";
import { random } from "../../../utils/math";
const randomSentence = require("random-sentence");

@Resolver(Message)
export default class MessageResolver {
    /**
     * Looks up and returns the recipient
     */
    @FieldResolver()
    async to(@Root() { to }: Message, @Ctx() { database }: Context): Promise<User | null> {
        // TODO: add lookup from DB
        if (!to) {
            return null;
        }

        const user = await database.UserModel.findById(to);

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            unreadMessageCount: undefined,
            inbox: undefined,
        };
    }

    /**
     * Looks up and returns the sender
     */
    @FieldResolver()
    async from(@Root() { from }: Message, @Ctx() { database }: Context): Promise<User | null> {
        if (!from) {
            return null;
        }

        const user = await database.UserModel.findById(from);

        console.log(`User found!`, user);

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            unreadMessageCount: undefined,
            inbox: undefined,
        };
    }

    /**
     * Sends a message to a random user
     */
    @Mutation(type => Message)
    async sendRandomMessage(@Ctx() { database, userId }: Context, @Arg("message") message: string): Promise<Message> {
        if (!userId) {
            throw new Error(`Not authenticated`);
        }

        const count = await database.UserModel.countDocuments({});
        const to = await database.UserModel.findOne({ _id: { $ne: userId } })
            .skip(random(0, count))
            .select("_id");

        const record = await database.MessageModel.create({
            from: userId,
            to: to?._id,
            contents: message,
        });

        return {
            id: record.id,
            contents: message,
            to: to?._id,
            from: userId as any,
        };
    }
}
