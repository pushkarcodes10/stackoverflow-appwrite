import { databases, users } from "@/src/models/server/config";
import { answerCollection, db } from "@/src/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/src/store/Auth";

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
        
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error Creating an answer"
            }, 
            {
                status: error?.status || error?.code || 500
            }
        )
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
    } catch (error: any) {
       return NextResponse.json(
        {
          error: error?.message || "Error deleting the answer",
        },
        {
          status: error?.status || error?.code || 500
        },
       ); 
    }
}