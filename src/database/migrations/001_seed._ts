import bcrypt from "bcrypt";
import { Db, ObjectID } from "mongodb";
import { random } from "../../utils/math";
const randomSentence = require("random-sentence");

const USER_COUNT = 10000;

export const up = async (db: Db) => {
    const plainPassword = "abcd1234";
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(plainPassword, salt);
    const users = Array.from(new Array(USER_COUNT)).map((_, i) => ({
        password,
        _id: new ObjectID(),
        email: `user+${i}@test.yulife.com`,
        name: `User ${i}`,
    }))
    await db.collection("users").insertMany(users);

    const messages = [] as any[];

    // create some test messages
    users.map((user, i) => {
        const friends = [
            users[random(i + 1, USER_COUNT - 1)],
            users[random(i + 1, USER_COUNT - 1)],
            users[random(i + 1, USER_COUNT - 1)],
            users[random(i + 1, USER_COUNT - 1)],
        ];

        if (i === 10) {
            console.log(friends);
        }

        friends.map(({ _id }) => 
            messages.push({
                from: _id,
                to: user._id,
                contents: randomSentence({ words: random(5, 10) }),
            })
        );

    })
    await db.collection("messages").insertMany(messages);

}

export const down = async (db: Db) => {
    await db.collection("users").deleteMany({});
    await db.collection("messages").deleteMany({});
}

