import {useEditor} from "@/providers/Editor";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  LexicalEditor,
  TextNode,
  ParagraphNode,
  COMMAND_PRIORITY_HIGH, LexicalCommand, PASTE_COMMAND
} from "lexical";
import {$createCodeNode, $isCodeNode} from '@lexical/code';
import {mergeRegister} from '@lexical/utils';
import {useEffect, useMemo, useState} from "react";

export function CodeTransformPlugin({editorID}: { editorID: string }): JSX.Element | null {
  const editor = useEditor(editorID);
  const [listenedCommands, setListenedCommands] = useState<
    ReadonlyArray<LexicalCommand<unknown> & { payload: unknown }>
  >([]);

  useCodeTransform(editor);

  useEffect(() => {
    editor?.update(() => {
      const root = $getRoot();
      root.clear();
      root.append($createParagraphNode().append(($createTextNode('print("Hello World")'))));
    });
  }, [editor]);

  useEffect(() => {
    return editor?.registerCommand(
      PASTE_COMMAND,
      (payload) => {
        setListenedCommands((state: any) => {
          const newState = [...state];
          newState.push({
            payload,
            type: 'PASTE_COMMAND',
          });

          if (newState.length > 10) {
            newState.shift();
          }

          return newState;
        });

        return false;
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor]);

  useEffect(() => {
    editor?.update(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      const codeNode = $createCodeNode('python');
      codeNode.append($createTextNode(text));
      const newParagraph = $createParagraphNode();
      newParagraph.append(codeNode);
      root.clear();
      root.append(newParagraph);
    });
  }, [editor, listenedCommands]);


  return null;
}

const useCodeTransform = (editor: LexicalEditor | null) => {
  useEffect(() => {
    return editor?.registerNodeTransform(TextNode, node => {
      const parent = node.getParentOrThrow();
      if (!$isCodeNode(parent)) {
        const text = parent.getTextContent();
        const codeNode = $createCodeNode('python');
        codeNode.append($createTextNode(text));
        const newParagraph = $createParagraphNode();
        newParagraph.append(codeNode);
        parent.replace(newParagraph);
      }
    });
  }, [editor]);
}
