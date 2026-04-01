"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogRenderer } from "@/components/blog-renderer";
import type { BlogPost } from "@/lib/blog";

export function BlogLayout({ post }: { post: BlogPost }) {
  const [activeId, setActiveId] = useState<string>("");

  // Track which heading is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const heading of post.headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [post.headings]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Posts
          </Link>
          <Link href="/" className="font-heading text-xl tracking-wide">
            Latch
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
          {/* Main content — 700px max */}
          <article className="max-w-[700px]">
            {/* Meta */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs tracking-[0.25em] uppercase text-primary">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wider uppercase leading-[1.1]">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {post.description}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {post.author}
                </span>
              </div>
            </div>

            <div className="h-px bg-border mb-10" />

            {/* Article body */}
            <BlogRenderer content={post.content} />

            {/* Final CTA banner */}
            <div className="mt-16 border border-primary/30 bg-primary/5 p-8 md:p-10 text-center">
              <h3 className="font-heading text-2xl md:text-3xl tracking-wider uppercase mb-3">
                Ready to Take Control?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Lock your Screen Time passcode behind 600 words. No willpower
                required — just friction.
              </p>
              <Link href="/#pricing">
                <Button className="rounded-full text-sm font-medium px-8 py-5">
                  Get Latch
                </Button>
              </Link>
            </div>
          </article>

          {/* Sidebar — sticky TOC + CTA */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* TOC */}
              {post.headings.length > 0 && (
                <nav>
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4">
                    On this page
                  </p>
                  <ul className="space-y-2">
                    {post.headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(h.id)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`block text-sm leading-snug transition-colors ${
                            h.level === 3 ? "pl-4" : ""
                          } ${
                            activeId === h.id
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Sticky CTA */}
              <div className="border border-border p-5 bg-card">
                <p className="font-heading text-lg tracking-wider uppercase mb-2">
                  Try Latch
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Lock your phone down. Get it back only when you&apos;ve earned
                  it.
                </p>
                <Link href="/#pricing" className="block">
                  <Button
                    className="w-full rounded-none text-xs tracking-widest uppercase"
                    size="sm"
                  >
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
