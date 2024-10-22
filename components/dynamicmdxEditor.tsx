import dynamic from "next/dynamic";
import { MDXEditorProps, MDXEditorMethods } from "@mdxeditor/editor";
import React from "react";

const DynamicMDXEditor = dynamic(() => import("./mdxEditorClient"), {
  ssr: false,
});

export default React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <DynamicMDXEditor {...props} ref={ref} />
);
