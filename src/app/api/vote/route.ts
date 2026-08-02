import { databases, users } from "@/src/models/server/config";
import { answerCollection, db, questionCollection, voteCollection } from "@/src/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { UserPrefs } from "@/src/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const { votedById, voteStatus, type, typeId } = await request.json();

        // Fetch the entity (question or answer) to find the authorId
        const collection = type === "question" ? questionCollection : answerCollection;
        const entity = await databases.getDocument(db, collection, typeId);
        const authorId = entity.authorId;

        // Fetch existing vote by this user on this entity
        const existingVotes = await databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("votedById", votedById),
        ]);

        const existingVote = existingVotes.documents.length > 0 ? existingVotes.documents[0] : null;

        let reputationChange = 0;
        let newVoteDocument = null;

        if (existingVote) {
            if (existingVote.voteStatus === voteStatus) {
                // Toggle off (delete the vote)
                await databases.deleteDocument(db, voteCollection, existingVote.$id);
                reputationChange = voteStatus === "upvoted" ? -1 : 1;
            } else {
                // Change vote direction
                newVoteDocument = await databases.updateDocument(db, voteCollection, existingVote.$id, {
                    voteStatus: voteStatus
                });
                reputationChange = voteStatus === "upvoted" ? 2 : -2;
            }
        } else {
            // Create new vote
            newVoteDocument = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeId,
                votedById,
                voteStatus,
            });
            reputationChange = voteStatus === "upvoted" ? 1 : -1;
        }

        // Update author's reputation
        if (authorId) {
            try {
                const author = await users.get<UserPrefs>(authorId);
                const currentReputation = author.prefs?.reputation || 0;
                await users.updatePrefs(authorId, {
                    reputation: currentReputation + reputationChange
                });
            } catch (userError) {
                console.error("Failed to update user reputation", userError);
            }
        }

        // Calculate new vote result
        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.limit(1) 
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.limit(1)
            ])
        ]);

        const voteResult = upvotes.total - downvotes.total;

        return NextResponse.json({
            data: {
                document: newVoteDocument,
                voteResult,
            },
            message: "Vote recorded successfully",
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Error handling vote" },
            { status: 500 }
        );
    }
}
