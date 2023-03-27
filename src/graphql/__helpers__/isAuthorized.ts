import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import config from "../../config";
import { Context, ContextPayload } from "../context";

export const isAuthorized: MiddlewareFn<Context> = ({ context }, next) => {
    const authorizationHeader = context.req.headers['authorization'];

    if (!authorizationHeader) {
        throw new Error('No authorization token provided!')
    }

    try {
        const token = authorizationHeader.split(" ");
        const payload = verify(token[1], config.auth.secret);
        context.payload = payload as ContextPayload;
    } catch (e) {
        throw new Error('Invalid authorization token');
    }


    return next();
}