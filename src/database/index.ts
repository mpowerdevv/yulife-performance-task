import { mongoose } from "@typegoose/typegoose";
import { UserModel, MessageModel, ArchiveModel } from "./models";
import { Config } from "../config/types";
import { Unpacked } from "../utils/types";

const init = async (config: Config["database"]) => {
    const connection = await mongoose.connect(config.uri, { useUnifiedTopology: true, useNewUrlParser: true });

    return {
        connection,
        UserModel,
        MessageModel,
        ArchiveModel
    };
};

export type Database = Unpacked<ReturnType<typeof init>>;

export default init;
