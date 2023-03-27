import { BuildSchemaOptions } from "type-graphql";

import ProgressResolver from "./message/message.resolver";
import UserResolver from "./user/user.resolver";

export const resolvers: BuildSchemaOptions["resolvers"] = [ProgressResolver, UserResolver];
