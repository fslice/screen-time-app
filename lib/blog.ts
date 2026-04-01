import fs from "fs";
import path from "path";

export interface BlogMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  published: boolean;
  headings: { id: string; text: string; level: number }[];
}

export interface BlogPost extends BlogMeta {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

/**
 * Parse frontmatter from a markdown string.
 * Returns { meta, content } where content is everything after the frontmatter.
 */
function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    meta[key] = value;
  }

  return { meta, content: match[2] };
}

/**
 * Extract headings (h2, h3) from markdown content for the TOC.
 */
function extractHeadings(
  content: string
): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}

/**
 * Get all published blog posts, sorted by date (newest first).
 */
export function getAllPosts(): BlogMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { meta, content } = parseFrontmatter(raw);
      const slug = file.replace(/\.md$/, "");

      return {
        title: meta.title || slug,
        description: meta.description || "",
        date: meta.date || "",
        author: meta.author || "Latch Team",
        slug,
        published: meta.published !== "false",
        headings: extractHeadings(content),
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

/**
 * Get a single blog post by slug.
 */
export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);

  return {
    title: meta.title || slug,
    description: meta.description || "",
    date: meta.date || "",
    author: meta.author || "Latch Team",
    slug,
    published: meta.published !== "false",
    headings: extractHeadings(content),
    content,
  };
}

/**
 * Get all slugs for static generation.
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
