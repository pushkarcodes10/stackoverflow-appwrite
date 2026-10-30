import env from "@/src/app/env";

import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";

const endpoint = env.appwrite.endpoint || "https://fra.cloud.appwrite.io/v1";
const projectId = env.appwrite.projectId || "";
const apiKey = env.appwrite.apikey || "";

const client = new Client();

if (!projectId || !apiKey) {
  console.warn("Appwrite server env vars are missing. Set APPWRITE_PROJECT_ID and APPWRITE_API_KEY in Vercel.");
}

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, databases, users, avatars, storage };