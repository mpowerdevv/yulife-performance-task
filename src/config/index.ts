import { Config } from "./types";
import productionConfig from "./production";
import defaultConfig from "./default";

const getConfig = (): Config => {
    switch (process.env.NODE_ENV) {
        case "production":
            return productionConfig;
        default:
            return defaultConfig;
    }
}

export default getConfig();
