"use client";

import React from "react";

/**
 * Renders markdown content as React elements.
 * Supports: headings (h1-h3), paragraphs, bold, italic, links, lists, blockquotes, code, images, hr.
 */
export function BlogRenderer({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="blog-content">
      {blocks.map((block, i) => (
        <React.Fragment key={i}>{renderBlock(block)}</React.Fragment>
      ))}
    </div>
  );
}

type Block =
  | { type: "heading"; level: number; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "hr" }
  | { type: "image"; src: string; alt: string };

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // HR
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const text = headingMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blocks.push({ type: "heading", level: headingMatch[1].length, text, id });
      i++;
      continue;
    }

    // Image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }

    // Code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      i++; // skip closing ```
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("```") &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join(" ") });
    }
  }

  return blocks;
}

function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3";
      const className =
        block.level === 1
          ? "font-heading text-4xl md:text-5xl tracking-wider uppercase mt-12 mb-6"
          : block.level === 2
          ? "font-heading text-2xl md:text-3xl tracking-wider uppercase mt-10 mb-4"
          : "font-heading text-xl md:text-2xl tracking-wider uppercase mt-8 mb-3";
      return (
        <Tag id={block.id} className={className}>
          {renderInline(block.text)}
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p className="text-base leading-[1.8] text-foreground/80 mb-6">
          {renderInline(block.text)}
        </p>
      );
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-primary pl-6 my-8 text-foreground/70 italic text-lg leading-[1.8]">
          {renderInline(block.text)}
        </blockquote>
      );
    case "ul":
      return (
        <ul className="space-y-2 mb-6 ml-6">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="text-base leading-[1.8] text-foreground/80 flex items-start gap-3"
            >
              <span className="text-primary mt-2.5 shrink-0">
                <svg width="6" height="6" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" fill="currentColor" />
                </svg>
              </span>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2 mb-6 ml-6">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="text-base leading-[1.8] text-foreground/80 flex items-start gap-3"
            >
              <span className="text-primary font-heading text-lg shrink-0">
                {i + 1}.
              </span>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <pre className="bg-card border border-border p-6 overflow-x-auto mb-6 text-sm">
          <code>{block.code}</code>
        </pre>
      );
    case "hr":
      return <hr className="border-border my-10" />;
    case "image":
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className="w-full border border-border"
          />
          {block.alt && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center">
              {block.alt}
            </figcaption>
          )}
        </figure>
      );
  }
}

/**
 * Render inline markdown: **bold**, *italic*, [links](url), `code`
 */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Pattern: **bold**, *italic*, [text](url), `code`
  const regex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic
      parts.push(
        <em key={match.index} className="italic">
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      // Link
      parts.push(
        <a
          key={match.index}
          href={match[7]}
          className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          target={match[7].startsWith("http") ? "_blank" : undefined}
          rel={match[7].startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {match[6]}
        </a>
      );
    } else if (match[8]) {
      // Inline code
      parts.push(
        <code
          key={match.index}
          className="bg-card border border-border px-1.5 py-0.5 text-sm"
        >
          {match[9]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}
