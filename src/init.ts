import "reflect-metadata"; // this ensures type graphql works properly
import jwt from "express-jwt";
import expressPlayground from "graphql-playground-middleware-express";
import express from "express";
import getDatabase from "./database";
import createGraphqlServer from "./graphql";
import config from "./config";

const init = async () => {
    const app = express();
    const db = await getDatabase(config.database);
    console.log(`DB connected to ${config.database.uri}!`);
    const server = await createGraphqlServer(db);

    const path = "/graphql";

    app.use(
        path,
        jwt({
            secret: config.auth.secret,
            credentialsRequired: false,
            algorithms: ["HS256"],
        }),
    );

    // for debugging
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    server.applyMiddleware({ app, path });

    app.listen(4000);
    console.log(`App listening on port 4000!`);
};

init();
