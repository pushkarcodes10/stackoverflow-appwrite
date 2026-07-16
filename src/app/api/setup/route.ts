import { NextResponse } from "next/server";
import getOrCreateDB from "@/src/models/server/dbSetup";
import getOrCreateStorage from "@/src/models/server/storage.setup";

export async function GET() {
  try {
    await getOrCreateDB();
    await getOrCreateStorage();
    return NextResponse.json({
      success: true,
      message: "Database, collections, and storage setup executed successfully!",
    });
  } catch (error: any) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred during database setup.",
      },
      { status: 500 }
    );
  }
}
