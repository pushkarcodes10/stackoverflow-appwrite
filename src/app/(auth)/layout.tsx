"use client";

import { useAuthStore } from "../../store/Auth"
import { useRouter } from "next/navigation"
import React from "react"

import AnimatedGridPattern from "@/src/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const Layout = ({children} : {children: React.ReactNode}) => {
    const { session, hydrated, verfiySession } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (!hydrated) {
            void verfiySession();
            return;
        }

        if (session) {
            router.replace('/questions');
        }
    }, [hydrated, router, session, verfiySession]);

    if (!hydrated || session) {
        return null;
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-12">
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.1}
                duration={3}
                repeatDelay={1}
                className={cn(
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
                )}
            />
            <div className="relative z-10 w-full">{children}</div>
        </div>
    )
}

export default Layout