"use client";

import React from "react";

interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
  [key: string]: unknown;
}

function renderTextWithMarks(textNode: TiptapNode, key: string | number): React.ReactNode {
  let element: React.ReactNode = textNode.text ?? "";

  if (textNode.marks && textNode.marks.length > 0) {
    for (const mark of textNode.marks) {
      switch (mark.type) {
        case "bold":
          element = <strong key={`b-${String(key)}`}>{element}</strong>;
          break;
        case "italic":
          element = <em key={`i-${String(key)}`}>{element}</em>;
          break;
        case "strike":
          element = <s key={`s-${String(key)}`}>{element}</s>;
          break;
        case "code":
          element = (
            <code
              key={`c-${String(key)}`}
              className="px-1.5 py-0.5 rounded bg-[var(--background-accent)] font-mono text-xs text-[var(--primary-text)] font-semibold"
            >
              {element}
            </code>
          );
          break;
        case "link":
          element = (
            <a
              key={`l-${String(key)}`}
              href={String(mark.attrs?.href || "#")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary-text)] underline hover:opacity-80 transition-opacity"
            >
              {element}
            </a>
          );
          break;
        default:
          break;
      }
    }
  }

  return <React.Fragment key={key}>{element}</React.Fragment>;
}

function renderNode(node: TiptapNode, index: number): React.ReactNode {
  const key = `node-${index}`;

  if (node.type === "text") {
    return renderTextWithMarks(node, key);
  }

  const children = node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "paragraph":
      return (
        <p
          key={key}
          className="font-sans text-[16px] sm:text-[17px] leading-[1.8] text-[#2B2725] mb-5"
        >
          {children && children.length > 0 ? children : <br />}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level || 2);
      if (level === 2) {
        return (
          <h2
            key={key}
            className="font-newsreader font-medium text-[24px] sm:text-[28px] md:text-[30px] text-[var(--foreground)] mt-8 mb-3 leading-snug tracking-[0.2px]"
          >
            {children}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3
            key={key}
            className="font-newsreader font-medium text-[20px] sm:text-[22px] text-[var(--foreground)] mt-6 mb-2 leading-snug"
          >
            {children}
          </h3>
        );
      }
      return (
        <h4
          key={key}
          className="font-sans font-bold text-[17px] text-[var(--foreground)] mt-4 mb-2"
        >
          {children}
        </h4>
      );
    }
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-[var(--primary)] pl-5 py-2 my-6 font-newsreader italic text-[17px] sm:text-[19px] text-[var(--foreground)] bg-[var(--primary-soft)]/20 rounded-r-lg"
        >
          {children}
        </blockquote>
      );
    case "bulletList":
      return (
        <ul
          key={key}
          className="list-disc list-outside pl-6 space-y-2 text-[#2B2725] my-5 font-sans text-[16px] leading-relaxed"
        >
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol
          key={key}
          className="list-decimal list-outside pl-6 space-y-2 text-[#2B2725] my-5 font-sans text-[16px] leading-relaxed"
        >
          {children}
        </ol>
      );
    case "listItem":
      return (
        <li key={key} className="leading-relaxed">
          {children}
        </li>
      );
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} className="my-8 border-t border-[var(--dust)]/60" />;
    case "image": {
      const src = String(node.attrs?.src || "");
      const alt = String(node.attrs?.alt || "");
      const caption = node.attrs?.caption ? String(node.attrs.caption) : null;
      return (
        <figure key={key} className="my-6">
          <img
            src={src}
            alt={alt}
            className="w-full rounded-xl object-cover max-h-[480px] bg-[var(--background-accent)]"
          />
          {caption && (
            <figcaption className="text-xs text-center text-[var(--muted)] mt-2 italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }
    default:
      return <div key={key}>{children}</div>;
  }
}

export default function TiptapRenderer({
  content,
}: {
  content?: unknown;
}) {
  if (!content) return null;

  // Jika konten adalah objek doc Tiptap
  if (
    typeof content === "object" &&
    content !== null &&
    (content as TiptapDoc).type === "doc" &&
    Array.isArray((content as TiptapDoc).content)
  ) {
    const doc = content as TiptapDoc;
    return (
      <div className="tiptap-rendered-content w-full">
        {doc.content?.map((node, i) => renderNode(node, i))}
      </div>
    );
  }

  // Fallback jika konten berupa string teks biasa
  if (typeof content === "string") {
    const paragraphs = content.split("\n\n").filter(Boolean);
    return (
      <div className="w-full space-y-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-sans text-[16px] sm:text-[17px] leading-[1.8] text-[#2B2725]"
          >
            {p}
          </p>
        ))}
      </div>
    );
  }

  return null;
}
