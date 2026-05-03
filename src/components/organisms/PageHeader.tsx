"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgColor?: string;
}

export function PageHeader({
  title,
  subtitle,
  bgColor = "bg-tcrc-accent",
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-6 py-4 text-white",
        bgColor
      )}
    >
      <h1 className="text-tcrc-title3 font-bold">
        <Link href="/" className="block">
          {title}
        </Link>
        {subtitle && (
          <span className="block text-tcrc-body font-normal">
            <Link href="/">{subtitle}</Link>
          </span>
        )}
      </h1>
      <button
        onClick={() => router.back()}
        className="text-white p-2 ios-button rounded-tcrc-full"
      >
        <ArrowLeft size={24} />
      </button>
    </header>
  );
}
