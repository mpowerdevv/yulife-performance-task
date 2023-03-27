import { sign } from "jsonwebtoken";
import config from "../../config";
import User from "../resolvers/user/user.type";

export const createAccessToken = (user: User) => {
    return sign({ user: user.id }, config.auth.secret, { expiresIn: '15m' });
}