import dynamic from "next/dynamic";
import { MDXEditorProps, MDXEditorMethods } from "@mdxeditor/editor";
import React from "react";

const DynamicMDXEditor = dynamic(() => import("./mdxEditorClient"), {
  ssr: false,
});

const ForwardedDynamicMDXEditor = React.forwardRef<
  MDXEditorMethods,
  MDXEditorProps
>((props, ref) => <DynamicMDXEditor {...props} ref={ref} />);

ForwardedDynamicMDXEditor.displayName = "ForwardedDynamicMDXEditor";

export default ForwardedDynamicMDXEditor;
