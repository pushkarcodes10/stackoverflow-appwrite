import { DatabasesIndexType, OrderBy, Permission } from "node-appwrite";

import {db, questionCollection} from "../name"
import {databases} from "./config"


export default async function createQuestionCollection(){
  // create collection
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])
  console.log("Question collection is created")

  //creating attributes and Indexes
  console.log("Creating Question Attributes...");
  try {
    await databases.createStringAttribute(db, questionCollection, "title", 100, true);
    await databases.createStringAttribute(db, questionCollection, "content", 10000, true);
    await databases.createStringAttribute(db, questionCollection, "authorId", 50, true);
    await databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true);
    await databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false);
    console.log("Question Attributes creation requests sent.");
  } catch (error) {
    console.error("Error sending Question Attribute creation requests:", error);
    throw error;
  }

  // Poll until "title" and "content" attributes are available (needed for indexes)
  console.log("Waiting for title and content attributes to be available for indexing...");
  const keysToVerify = ["title", "content"];
  for (const key of keysToVerify) {
    let isAvailable = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        const attribute = await databases.getAttribute(db, questionCollection, key);
        if (attribute.status === "available") {
          isAvailable = true;
          break;
        } else if (attribute.status === "failed" || attribute.status === "stuck") {
          throw new Error(`Attribute ${key} creation failed with status: ${attribute.status}`);
        }
      } catch (err: any) {
        console.log(`Still waiting for attribute ${key}... (${err.message})`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!isAvailable) {
      throw new Error(`Timed out waiting for attribute ${key} to be ready.`);
    }
  }

  // create Indexes
  console.log("Creating Question Indexes...");
  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title",
      DatabasesIndexType.Fulltext,
      ["title"],
      [OrderBy.Asc]
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content",
      DatabasesIndexType.Fulltext,
      ["content"],
      [OrderBy.Asc]
    )
  ]);
  console.log("Question Indexes created successfully.");
}