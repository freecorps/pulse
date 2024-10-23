"use client";

import React, { forwardRef } from "react";
import {
  MDXEditor,
  type MDXEditorProps,
  type MDXEditorMethods,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  linkDialogPlugin,
  CreateLink,
  imagePlugin,
  InsertImage,
  tablePlugin,
  InsertTable,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";

const MDXEditorClient = forwardRef<
  MDXEditorMethods,
  MDXEditorProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <MDXEditor
      {...props}
      ref={ref}
      className={className}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {""}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <ListsToggle />
            </>
          ),
        }),
      ]}
    />
  );
});

MDXEditorClient.displayName = "MDXEditorClient";

export default MDXEditorClient;
