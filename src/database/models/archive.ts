import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { User } from "./user";

export class Archive {
    @prop({ ref: User })
    public from!: Ref<User>;

    @prop({ ref: User, index: true })
    public to!: Ref<User>;

    @prop()
    public contents!: string;

    @prop({ default: Date.now() })
    public archivedAt!: Number;
}


const ArchiveModel = getModelForClass(Archive);

export default ArchiveModel;