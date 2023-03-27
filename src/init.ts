import "reflect-metadata"; // this ensures type graphql works properly
import expressPlayground from "graphql-playground-middleware-express";
import express from "express";
import getDatabase from "./database";
import config from "./config";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./graphql/resolvers";


const init = async () => {
    const app = express();
    const database = await getDatabase(config.database);
    console.log(`DB connected to ${config.database.uri}!`);

    const server = new ApolloServer({
        schema: await buildSchema({ resolvers }),
        context: ({ req }) => ({ database, req }),
    });


    const path = "/graphql";

    // app.use(
    //     path,
    //     jwt({
    //         secret: config.auth.secret,
    //         credentialsRequired: true,
    //         algorithms: ["HS256"],
    //     }),
    // );

    // for debugging
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    server.applyMiddleware({ app, path });

    app.listen(3000);
    console.log(`App listening on port 3000!`);
    console.log('MODE:', process.env.NODE_ENV);
};

init();
