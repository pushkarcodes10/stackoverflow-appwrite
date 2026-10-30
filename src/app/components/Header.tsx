"use client";
import React from "react";
import { FloatingNav } from "@/src/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import { useAuthStore } from "@/src/store/Auth";
import slugify from "slugify";

export default function Header() {
    const { user } = useAuthStore();

    const navItems = [
        {
            name: "Questions",
            link: "/questions",
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];

    if (user) {
        navItems.unshift({
            name: "Home",
            link: "/questions",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
        navItems.push({
            name: "Profile",
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
    } else {
        navItems.unshift({
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
    }

    return (
        <div className="relative w-full">
            <FloatingNav navItems={navItems} />
        </div>
    );
}
