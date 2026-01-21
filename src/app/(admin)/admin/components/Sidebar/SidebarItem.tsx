"use client";

import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarItemProps {
    name: string;
    href: string;
    icon: LucideIcon;
    isActive: boolean;
}

export function SidebarItem({
    name,
    href,
    icon: Icon,
    isActive,
}: SidebarItemProps) {
    return (
        <Link href={href} className="block group">
            <div
                className={`
        relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all
        ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"}
      `}
            >
                {isActive && (
                    <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-blue-600/10 border border-blue-600/20 rounded-2xl"
                        transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                        }}
                    />
                )}

                <div className="flex items-center gap-3 relative z-10">
                    <Icon
                        size={20}
                        className={`${isActive ? "text-blue-500" : "group-hover:scale-110 transition-transform duration-300"}`}
                    />
                    <span className="font-bold text-sm tracking-tight">
                        {name}
                    </span>
                </div>

                {isActive && (
                    <ChevronRight
                        size={14}
                        className="text-blue-500 relative z-10"
                    />
                )}
            </div>
        </Link>
    );
}
