import { Resolver, Query, Mutation, Ctx, Arg, FieldResolver, Root, Field, ObjectType, UseMiddleware } from "type-graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./user.type";
import { Context } from "../../context";
import config from "../../../config";
import { isAuthorized } from "../../__helpers__/isAuthorized";



@Resolver(User)
export default class UserResolver {
    /**
     * Me Query
     */
    @Query(returns => User)
    @UseMiddleware(isAuthorized) //IE: JWT token auth. check.
    async me(@Ctx() { database, payload }: Context): Promise<User> {
        const userId = payload.userId;

        if (!userId) {
            throw new Error(`Not authenticated`);
        }

        const user = await database.UserModel.findById(userId);

        if (!user) {
            throw new Error(`User does not exist`);
        }

        return {
            id: user._id,
            name: user.name,
            inbox: undefined,
            unreadMessageCount: undefined,
            readMessageCount: undefined
        };
    }

    /**
     * User's inbox
     */
    @FieldResolver()
    async inbox(@Ctx() { database, payload }: Context,
        @Arg('limit', { defaultValue: 0 }) limit: number, //[IE: pagination added]
        @Arg('offset', { defaultValue: 0 }) offset: number) //[IE: pagination added]
        : Promise<User["inbox"]> {
        // lookup the messages for a user from messages table
        const userId = payload.userId;

        const messages = await database.MessageModel
            .find({ to: userId })
            .skip(offset)
            .limit(limit);

        return messages.map((message: { id: any; contents: any; to: any; from: any; }) => ({
            id: message.id,
            contents: message.contents,
            to: message.to as any,
            from: message.from as any,
        }));
    }

    /**
   * User's message archive
   */
    @FieldResolver()
    async archive(@Ctx() { database, payload }: Context,
        @Arg('limit', { defaultValue: 0 }) limit: number,  //[IE: pagination added]
        @Arg('offset', { defaultValue: 0 }) offset: number //[IE: pagination added]
    ): Promise<User["archive"]> {
        const userId = payload.userId;

        const messages = await database.ArchiveModel
            .find({ to: userId })
            .skip(offset)
            .limit(limit);
        ;

        return messages.map((message: { id: any; contents: any; to: any; from: any; }) => ({
            id: message.id,
            contents: message.contents,
            to: message.to as any,
            from: message.from as any,
        }));
    }

    /**
     * IE: Unread message count for a user
     */
    @FieldResolver()
    async unreadMessageCount(
        @Root() user: User,
        @Ctx() { database, payload }: Context,
    ): Promise<User["unreadMessageCount"]> {
        // do a count on the DB for messages count
        const userId = payload.userId;
        const count = await database.MessageModel.find({ to: userId });
        return count.length;
    }

    /**
     * Read message count for a user
     */
    @FieldResolver()
    async readMessageCount(
        @Root() user: User,
        @Ctx() { database, payload }: Context,
    ): Promise<User["readMessageCount"]> {
        // do a count on the DB for messages count
        const userId = payload.userId;
        const count = await database.ArchiveModel.find({ to: userId });
        return count.length;
    }


    /**
     * Login mutation
     */
    @Mutation(() => String)
    async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        console.log('Hi3')
        const record = await database.UserModel.findOne({ email });

        if (!record) {
            throw new Error(`Incorrect password`);
        }

        const correct = await bcrypt.compare(password, record.password);

        if (!correct) {
            throw new Error(`Invalid credentials`);
        }

        const accessToken = jwt.sign({ userId: record._id }, config.auth.secret, { expiresIn: "15m" });

        return accessToken
    }

    /**
     * Register new user
     */
    @Mutation(returns => String)
    async register(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { database }: Context) {
        const existing = await database.UserModel.findOne({ email });

        if (existing) {
            throw new Error(`User exists!`);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await database.UserModel.create({
            email,
            password: hash,
        });

        return jwt.sign({ userId: user._id }, config.auth.secret, { expiresIn: "15m" });
    }
}
