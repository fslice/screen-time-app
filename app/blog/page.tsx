import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog — Latch",
  description: "Tips, guides, and thoughts on screen time, digital wellness, and building better habits.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl tracking-wide">
            Latch
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[700px] px-6 pt-28 pb-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs tracking-[0.25em] uppercase text-primary">
              Blog
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
            Writing
          </h1>
          <p className="mt-4 text-muted-foreground">
            On screen time, digital wellness, and building better habits.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block py-8 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl tracking-wider uppercase group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {post.description}
                    </p>
                    <span className="mt-3 text-xs text-muted-foreground block">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-2" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
