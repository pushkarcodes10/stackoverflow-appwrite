"use client";

import QuestionForm from "@/src/components/QuestionForm";
import React from "react";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import Header from "@/src/app/components/Header";

export default function AskPage() {
  const { session, user, hydrated, verfiySession } = useAuthStore();
  const router = useRouter();
  const isAuthenticated = Boolean(session || user);

  React.useEffect(() => {
    if (!hydrated) {
      void verfiySession();
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router, verfiySession]);

  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 pb-12 pt-24 max-w-4xl">
      <Header />
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">
          Ask a Public Question
        </h1>
        <p className="text-muted-foreground">
          You are ready to ask a programming-related question and this form will help guide you through the process.
        </p>
      </div>
      
      <div className="rounded-xl border border-white/10 bg-slate-950/50 p-6 shadow-xl backdrop-blur">
        <QuestionForm />
      </div>
    </div>
  );
}
