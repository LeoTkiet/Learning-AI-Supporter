"use client";

import React, { useEffect, useRef } from "react";

interface LatexRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export function LatexRenderer({ content, className = "", block = false }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderLatex() {
      try {
        const katex = (await import("katex")).default;
        if (!containerRef.current || !isMounted) return;

        // Parse LaTeX formulas marked with $...$ or $$...$$
        let formatted = content;
        
        // Render $$ ... $$ as displayMode
        formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
          try {
            return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
          } catch {
            return math;
          }
        });

        // Render $ ... $ as inlineMode
        formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
          try {
            return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
          } catch {
            return math;
          }
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = formatted;
        }
      } catch {
        // Fallback to plain text if KaTeX fails
        if (containerRef.current) {
          containerRef.current.innerText = content;
        }
      }
    }

    renderLatex();
    return () => {
      isMounted = false;
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`latex-content leading-relaxed ${className} ${block ? "my-2" : "inline-block"}`}
    >
      {content}
    </div>
  );
}
