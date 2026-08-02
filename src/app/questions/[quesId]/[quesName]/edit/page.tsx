import { db, questionCollection } from "@/src/models/name";
import { databases } from "@/src/models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async ({ params }: { params: Promise<{ quesId: string; quesName: string }> }) => {
    const { quesId, quesName } = await params;
    const question = await databases.getDocument(db, questionCollection, quesId);

    return <EditQues question={question as any} />;
};

export default Page;
