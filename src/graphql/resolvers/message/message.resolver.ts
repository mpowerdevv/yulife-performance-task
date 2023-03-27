import { Resolver, Mutation, Ctx, Root, Arg, FieldResolver, UseMiddleware, Query } from "type-graphql";
import Message, { Archive } from "./message.type";
import User from "../user/user.type";
import { Context } from "../../context";
import { random } from "../../../utils/math";
import { isAuthorized } from "../../__helpers__/isAuthorized";
import { isDocument } from "@typegoose/typegoose";
const randomSentence = require("random-sentence");

@Resolver(Message)
export default class MessageResolver {
    /**
     * Looks up and returns the recipient
     */
    @FieldResolver()
    async to(@Root() { to }: Message | Archive, @Ctx() { database }: Context): Promise<User | null> {
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
            archive: undefined
        };
    }

    /**
     * Looks up and returns the sender
     */
    @FieldResolver()
    async from(@Root() { from }: Message | Archive, @Ctx() { database }: Context): Promise<User | null> {
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
            archive: undefined
        };
    }

    /**
     * Sends a message to a random user
     */
    @Mutation(type => Message)
    @UseMiddleware(isAuthorized)
    async sendRandomMessage(@Ctx() { database, payload }: Context, @Arg("message") message: string): Promise<Message> {
        const userId = payload.userId;

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

    //IE: the method is used to move inbox message to archive when it's been read.
    @Mutation(() => Archive)
    @UseMiddleware(isAuthorized)
    async markMessageAsRead(@Ctx() { database, payload }: Context, @Arg("messageId") messageId: string): Promise<Archive> {
        const userId = payload.userId;

        const record = await database.MessageModel.findOne({
            to: userId,
            _id: messageId
        });

        if (!isDocument(record)) {
            throw new Error('No message found!')
        }

        if (!isDocument(record.from)) {
            throw new Error('No From User defined!')
        }

        if (!isDocument(record.to)) {
            throw new Error('No To User defined!')
        }

        const { from, to, contents } = record;

        const archivedRecord = await database.ArchiveModel.create({
            from: from?._id,
            to: to?._id,
            contents: contents,
            archivedAt: Date.now()
        })

        archivedRecord.delete();


        return {
            id: archivedRecord.id,
            from: archivedRecord.from as any,
            to: archivedRecord.to as any,
            contents: archivedRecord.contents,
            archivedAt: archivedRecord.archivedAt as number
        };
    }

    @Query(() => Message, { nullable: true })
    @UseMiddleware(isAuthorized)
    async getMessageById(@Ctx() { database, payload }: Context, @Arg("messageId") messageId: string) {
        const userId = payload.userId;

        const record = await database.MessageModel.findOne({
            to: userId,
            _id: messageId
        });

        return record;
    }
}
