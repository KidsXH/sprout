'use client';
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import CodeHighlightPlugin from '@/plugins/CodeHighlightPlugin';
import codeEditorTheme from "@/themes/codeEditorTheme";
import {EditorProvider, EditorRegister} from "@/providers/Editor";
import {CodeTransformPlugin} from "@/plugins/CodeTransformPlugin";
import TreeViewPlugin from "@/plugins/TreeViewPlugin";

const initialConfig = {
  namespace: 'CodeEditor',
  theme: codeEditorTheme,
  onError: (e: any) => {
    console.error(e)
  },
  nodes: [
    CodeNode,
    CodeHighlightNode,
  ]
};
const CodeEditor = () => {
  return (
    <EditorProvider>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorRegister id={'code-editor'}/>
        <div className="relative h-full">
          <RichTextPlugin
            contentEditable={<ContentEditable className="code-editor-content h-full" style={{}}/>}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin/>
          <CodeHighlightPlugin/>
          <CodeTransformPlugin editorID={'code-editor'}/>
          {/*<div className={"max-h-48 overflow-scroll"}><TreeViewPlugin/></div>*/}

        </div>
      </LexicalComposer>
    </EditorProvider>
  );
}

const Placeholder = () => {
  return (
    <div className="absolute top-0 m-2 select-none">Enter some text...</div>
  );
}

export default CodeEditor;