import { databases, users } from "@/src/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/src/models/name";
import { Query, Models } from "node-appwrite";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/src/components/magicui/shimmer-button";
import QuestionCard from "@/src/components/QuestionCard";
import { UserPrefs } from "@/src/store/Auth";
import Pagination from "@/src/components/Pagination";
import Search from "./Search";
import NumberTicker from "@/src/components/magicui/number-ticker";
import { AnimatedList } from "@/src/components/magicui/animated-list";
import Header from "@/src/app/components/Header";
import Footer from "@/src/app/components/Footer";

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
    const sp = await searchParams;
    sp.page ||= "1";

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+sp.page - 1) * 25),
        Query.limit(25),
    ];

    if (sp.tag) queries.push(Query.equal("tags", sp.tag));
    if (sp.search)
        queries.push(
            Query.or([
                Query.search("title", sp.search),
                Query.search("content", sp.search),
            ])
        );

    let questions;

    try {
        questions = await databases.listDocuments(db, questionCollection, queries);
    } catch (error) {
        console.error("Failed to load questions", error);
        questions = { total: 0, documents: [] };
    }

    try {
        questions.documents = await Promise.all(
            questions.documents.map(async (ques: any) => {
                const [author, answers, votes] = await Promise.all([
                    users.get<UserPrefs>(ques.authorId),
                    databases.listDocuments(db, answerCollection, [
                        Query.equal("questionId", ques.$id),
                        Query.limit(1),
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("type", "question"),
                        Query.equal("typeId", ques.$id),
                        Query.limit(1),
                    ]),
                ]);

                return {
                    ...ques,
                    totalAnswers: answers.total,
                    totalVotes: votes.total,
                    author: {
                        $id: author.$id,
                        reputation: author.prefs.reputation,
                        name: author.name,
                    },
                };
            })
        );
    } catch (error) {
        console.error("Failed to enrich question data", error);
        questions.documents = [];
    }

    return (
        <div className="container mx-auto px-4 pb-20 pt-36">
            <Header />
            <div className="mb-10 flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Questions</h1>
                <Link href="/ask">
                    <ShimmerButton className="shadow-2xl">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            Ask a question
                        </span>
                    </ShimmerButton>
                </Link>
            </div>
            <div className="mb-4">
                <Search />
            </div>
            <div className="mb-4">
                <p><NumberTicker value={questions.total} /> questions</p>
            </div>
            {questions.documents.length === 0 ? (
                <div className="max-w-3xl rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-300">
                    We couldn&apos;t load the questions right now. Please try again in a moment.
                </div>
            ) : (
                <AnimatedList className="mb-4 max-w-3xl space-y-6">
                    {questions.documents.map((ques: any) => (
                        <QuestionCard key={ques.$id} ques={JSON.parse(JSON.stringify(ques))} />
                    ))}
                </AnimatedList>
            )}
            <Pagination total={questions.total} limit={25} />
            <Footer />
        </div>
    );
};

export default Page;
