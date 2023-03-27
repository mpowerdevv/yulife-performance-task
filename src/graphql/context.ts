import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Request, Response } from "express";
import { Database } from "../database";


export interface ContextPayload {
    userId: string
}

export interface Context {
    database: Database
    req: Request,
    payload: ContextPayload
}