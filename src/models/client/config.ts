import env from "@/src/app/env";

import { Client, Account, Avatars, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint || "https://fra.cloud.appwrite.io/v1")
    .setProject(env.appwrite.projectId || "");

const databases = new Databases(client)
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);


export { client, databases, account, avatars, storage}