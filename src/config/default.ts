import { Config } from "./types";

const config: Config = {
    database: {
        uri: "mongodb://localhost:27017/yulife-performance",
    },
    auth: {
        secret: "LOCAL_SECRET",
    },
    frontend: {
        selfUrl: "http://localhost:5000/app",
    }
}

export default config;