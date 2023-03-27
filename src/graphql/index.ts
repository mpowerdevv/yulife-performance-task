import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { Database } from "../database";
import { resolvers } from "./resolvers";
import Context from "./context";

export default async (db: Database) => {
    const schema = await buildSchema({ resolvers });

    const server = new ApolloServer({
        schema,
        context: req => new Context(db, req),
    });

    return server;
};
