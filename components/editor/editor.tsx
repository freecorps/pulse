"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import { useQueryState } from "nuqs";
import { Editor } from "@tiptap/react";
import { Button } from "../ui/button";
import { databases } from "@/app/appwrite";

const SyncStatus = ({ status }: { status: "saved" | "saving" | "error" }) => {
  const statusMap = {
    saved: "✓ Salvo",
    saving: "⟳ Salvando...",
    error: "✕ Erro ao salvar",
  };

  const colorMap = {
    saved: "text-green-600",
    saving: "text-yellow-600",
    error: "text-red-600",
  };

  return (
    <span className={`ml-2 text-sm ${colorMap[status]}`}>
      {statusMap[status]}
    </span>
  );
};

const MenuBar = ({
  editor,
  syncStatus,
}: {
  editor: Editor | null;
  syncStatus: "saved" | "saving" | "error";
}) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="control-group">
      <div className="button-group justify-between">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            Bold
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            Italic
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            Strike
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
          >
            Code
          </Button>
          <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            Clear marks
          </Button>
          <Button onClick={() => editor.chain().focus().clearNodes().run()}>
            Clear nodes
          </Button>
          <Button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            Paragraph
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            H2
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            H3
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive("heading", { level: 4 }) ? "is-active" : ""
            }
          >
            H4
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={
              editor.isActive("heading", { level: 5 }) ? "is-active" : ""
            }
          >
            H5
          </Button>
          <Button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={
              editor.isActive("heading", { level: 6 }) ? "is-active" : ""
            }
          >
            H6
          </Button>
          <Button onClick={addImage}>Add image from URL</Button>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            Bullet list
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          >
            Ordered list
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
          >
            Code block
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            Blockquote
          </Button>
          <Button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            Horizontal rule
          </Button>
          <Button onClick={() => editor.chain().focus().setHardBreak().run()}>
            Hard break
          </Button>
          <Button onClick={() => editor.chain().focus().undo().run()}>
            Undo
          </Button>
          <Button onClick={() => editor.chain().focus().redo().run()}>
            Redo
          </Button>
          <SyncStatus status={syncStatus} />
        </div>
      </div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateOnDb(json: any, id: string | null) {
  if (!id) {
    return;
  }
  try {
    const status = await databases.updateDocument("News", "posts", id, {
      content: JSON.stringify(json), // Convertendo para string
    });
    return status;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

const TipTapEditor = () => {
  const [id] = useQueryState("id");
  const [syncStatus, setSyncStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const timerRef = useRef<NodeJS.Timeout>();
  const [initialContent, setInitialContent] = useState(null);

  // Buscar conteúdo inicial
  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const post = await databases.getDocument("News", "posts", id);
          // Parse do conteúdo de volta para objeto
          const parsedContent = post.content ? JSON.parse(post.content) : null;
          setInitialContent(parsedContent);
        } catch (error) {
          console.error("Error fetching post:", error);
          setSyncStatus("error");
        }
      }
    };
    fetchPost();
  }, [id]);

  const debouncedUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (json: any) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setSyncStatus("saving");

      timerRef.current = setTimeout(async () => {
        try {
          await updateOnDb(json, id);
          setSyncStatus("saved");
        } catch (error) {
          console.error("Error updating document:", error);
          setSyncStatus("error");
        }
      }, 2000);
    },
    [id]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      debouncedUpdate(json);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
      },
    },
  });

  // Atualizar o conteúdo do editor quando o conteúdo inicial for carregado
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  return (
    <div className="w-full border rounded-lg">
      <MenuBar editor={editor} syncStatus={syncStatus} />
      <div className="px-4 py-3">
        <EditorContent editor={editor} className="min-h-[200px]" />
      </div>
      <style jsx global>{`
        .ProseMirror {
          > * + * {
            margin-top: 0.75em;
          }

          ul,
          ol {
            padding: 0 1rem;
            margin: 1.25rem 1rem 1.25rem 0.4rem;
          }

          ul li,
          ol li {
            margin: 0.25em 0;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            line-height: 1.1;
            font-weight: 600;
          }

          h1 {
            font-size: 1.4rem;
            margin: 3.5rem 0 1.5rem;
          }
          h2 {
            font-size: 1.2rem;
            margin: 3.5rem 0 1.5rem;
          }
          h3 {
            font-size: 1.1rem;
            margin: 2.5rem 0 1rem;
          }
          h4,
          h5,
          h6 {
            font-size: 1rem;
            margin: 2rem 0 0.75rem;
          }

          code {
            background-color: hsl(var(--muted));
            border-radius: 0.4rem;
            padding: 0.25em 0.3em;
            font-size: 0.85rem;
          }

          pre {
            background-color: hsl(var(--secondary));
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            margin: 1.5rem 0;

            code {
              background: none;
              padding: 0;
              font-size: 0.8rem;
            }
          }

          blockquote {
            border-left: 3px solid hsl(var(--border));
            margin: 1.5rem 0;
            padding-left: 1rem;
          }

          hr {
            border: none;
            border-top: 1px solid hsl(var(--border));
            margin: 2rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TipTapEditor;
