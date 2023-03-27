import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Database } from "../database";

class Context {
    public userId?: string;
    public isAuthenticated?: boolean;

    constructor(public database: Database, expressContext: ExpressContext) {
        const user = (expressContext.req as any).user as Creds;

        if (user) {
            this.userId = user.userId;
            this.isAuthenticated = true;
        }
    }
}

export default Context;

type Creds = {
    userId: string;
    iat: number;
};
