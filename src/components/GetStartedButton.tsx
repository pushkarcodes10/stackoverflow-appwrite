"use client";

import Link from "next/link";
import ShimmerButton from "@/src/components/magicui/shimmer-button";
import confetti from "canvas-confetti";

export default function GetStartedButton() {
    const handleClick = (e: React.MouseEvent) => {
        const end = Date.now() + 1.5 * 1000;
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
                zIndex: 9999,
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
                zIndex: 9999,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    return (
        <Link href="/login" onClick={handleClick} className="inline-block">
            <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                    Get Started
                </span>
            </ShimmerButton>
        </Link>
    );
}
