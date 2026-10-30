import { databases, users } from "@/src/models/server/config";
import { answerCollection, db } from "@/src/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/src/store/Auth";

function getErrorDetails(error: unknown, fallbackMessage: string) {
    if (error && typeof error === "object") {
        const candidate = error as {
            message?: string;
            status?: number;
            code?: number;
        };

        return {
            message: typeof candidate.message === "string" && candidate.message.trim().length > 0 ? candidate.message : fallbackMessage,
            status: typeof candidate.status === "number" ? candidate.status : typeof candidate.code === "number" ? candidate.code : 500,
        };
    }

    return { message: fallbackMessage, status: 500 };
}

export async function POST(request: NextRequest) {
    try {
        const {questionId, answer, authorId} = await request.json();

        const response = await databases.createDocument(db, answerCollection, ID.unique(), {
            content: answer,
            authorId: authorId,
            questionId: questionId
        })

        const prefs = await users.getPrefs<UserPrefs>(authorId)
        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation)
        })

        return NextResponse.json(response,
            {
                status: 201
            }
        )
        
    } catch (error: unknown) {
        const { message, status } = getErrorDetails(error, "Error creating an answer");
        return NextResponse.json(
            {
                error: message,
            },
            {
                status,
            }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
       const {answerId} = await request.json()

       const answer = await databases.getDocument(db, answerCollection, answerId)

       const response = await databases.deleteDocument(db, answerCollection, answerId)

       const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
       await users.updatePrefs(answer.authorId, {
         reputation: Number(prefs.reputation),
       });

       return NextResponse.json( 
        {data: response},
        {status: 200}
    );
    } catch (error: unknown) {
       const { message, status } = getErrorDetails(error, "Error deleting the answer");
       return NextResponse.json(
        {
          error: message,
        },
        {
          status,
        },
       );
    }
}