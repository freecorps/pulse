"use client";
import "./editor.scss";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import Image from "@tiptap/extension-image";
import { HelpCircle } from "lucide-react";
import { SlashCommands } from "./extensions/SlashCommands";
import MarkdownIt from "markdown-it";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";

// Inicializa o parser markdown
const md = new MarkdownIt();

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

const HowToUse = () => {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      ajuda
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Digite / para abrir o menu de comandos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface TipTapEditorProps {
  content: JSONContent | null;
  onUpdate: (json: JSONContent) => void;
  syncStatus: "saved" | "saving" | "error";
}

const TipTapEditor = ({ content, onUpdate, syncStatus }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
      SlashCommands,
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate(json);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain");

        if (text && /[*#`>-]/.test(text)) {
          event.preventDefault();

          // Converte Markdown para HTML
          const html = md.render(text);

          // Insere o HTML convertido
          editor?.commands.insertContent(html);

          return true;
        }

        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="w-full border rounded-lg">
      <div className="px-4 py-3">
        <EditorContent editor={editor} className="min-h-[200px]" />
      </div>
      <div className="px-4 py-2 border-t text-sm text-muted-foreground flex items-center justify-between">
        <SyncStatus status={syncStatus} />
        <HowToUse />
      </div>
    </div>
  );
};

export default TipTapEditor;
