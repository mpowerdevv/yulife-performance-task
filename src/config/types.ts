export type Config = {
    database: {
        uri: string;
    };
    auth: {
        secret: string;
    };
    frontend: {
        selfUrl: string;
    };
}