/* eslint-disable @typescript-eslint/no-explicit-any */

import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { Editor } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
import React, { useState } from "react";
import { ReactRenderer } from "@tiptap/react";
import { ImageModal } from "../modals/ImageModal";

interface CommandItem {
  title: string;
  command: (editor: Editor) => void;
}

const CommandList = ({
  items,
  command,
  editor,
}: {
  items: CommandItem[];
  command: any;
  editor: Editor;
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  return (
    <div className="slash-commands-menu">
      {items.map((item, index) => {
        if (item.title === "Imagem") {
          return (
            <div key={index} className="slash-commands-item">
              <div
                className="slash-commands-button"
                onClick={() => setImageModalOpen(true)}
              >
                {item.title}
              </div>
              <ImageModal
                editor={editor}
                open={imageModalOpen}
                onOpenChange={setImageModalOpen}
              />
            </div>
          );
        }

        return (
          <div
            key={index}
            onClick={() => command(item)}
            className="slash-commands-button"
          >
            {item.title}
          </div>
        );
      })}
    </div>
  );
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: Instance[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: () => DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // Cria o elemento para o Tippy
      const element = document.createElement("div");
      popup = [
        tippy(document.body, {
          getReferenceClientRect: props.clientRect as any,
          appendTo: () => document.body,
          content: element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        }),
      ];

      // Renderiza o componente React no elemento
      if (component.element && element) {
        element.appendChild(component.element);
      }
    },

    onUpdate: (props: { clientRect: () => DOMRect }) => {
      if (!popup?.[0]) return;

      popup[0].setProps({
        getReferenceClientRect: props.clientRect as any,
      });
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();
        return true;
      }
      return false;
    },

    onExit: () => {
      popup?.[0].destroy();
      if (component) {
        component.destroy();
      }
    },
  };
};

const items: CommandItem[] = [
  {
    title: "Texto normal",
    command: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: "Título 1",
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Título 2",
    command: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Lista com marcadores",
    command: (editor: Editor) =>
      editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Lista numerada",
    command: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Bloco de código",
    command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Citação",
    command: (editor: Editor) =>
      editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Imagem",
    command: () => {},
  },
];

export const SlashCommands = Extension.create({
  name: "slash-commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: any;
          props: any;
        }) => {
          props.command(editor);
          editor.commands.deleteRange(range);
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return items.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: renderItems,
      }),
    ];
  },
});
