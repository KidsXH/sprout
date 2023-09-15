"use client";
import React, { MutableRefObject } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useEffect, useMemo, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import { zebraStripes } from "@uiw/codemirror-extensions-zebra-stripes";
import sproutTheme from "./theme";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectChainNodes } from "@/store/selectionSlice";
import {
  selectHighlightNode,
  updateCodeScrollTop,
} from "@/store/highlightSlice";
import nodes from "@/mocks/nodes";
import { setSourceCode } from "@/store/modelSlice";

function CodeEditor() {
  const CodeRef: MutableRefObject<ReactCodeMirrorRef | null> = useRef(null);
  const chainNodes = useAppSelector(selectChainNodes);
  const highlightNodeId = useAppSelector(selectHighlightNode);

  const dispatch = useAppDispatch();
  const [codeScrollTop, setCodeScrollTop] = React.useState<number>(0);
  const [highlightCodeRange, setHighlightCodeRange] = React.useState<any>([]);
  const [code, setCode] = React.useState<string>("");
  const onChange = React.useCallback((value: any, viewUpdate: any) => {
    //console.log("value:", value);
    setCode(value);
  }, []);

  const DIJKSTRA_CODE = `def dijkstra(graph, start, end):
      distances = {node: 32767 for node in graph}
      distances[start] = 0
      nodes = [node for node in graph]

      while nodes:
          nodes.sort(key=lambda node: distances[node])

          current_node = nodes[0]

          if current_node == end:
              break

          for neighbor in graph[current_node]:
              distance = distances[current_node] + graph[current_node][neighbor]
              
              if distance < distances[neighbor]:
                  distances[neighbor] = distance

          nodes.remove(current_node)
      
      return distances[end]



`;

  const handleBlurEvent = (event: any) => {
    dispatch(setSourceCode(code));
  };
  const handleWheelEvent = (event: any) => {
    // const codeEditor = CodeRef.current?.editor;
    const codeElement = document.getElementById("code-editor");
    const scrollTop: number = codeElement?.scrollTop || 0;
    setCodeScrollTop(scrollTop);
  };

  useEffect(() => {
    dispatch(updateCodeScrollTop(codeScrollTop));
  }, [codeScrollTop]);

  useEffect(() => {
    setTimeout(() => {
      setHighlightCodeRange(
        highlightNodeId === -1 ? [] : nodes[highlightNodeId].range,
      );
    }, 1400);
    return () => {
      setHighlightCodeRange([]);
    };
  }, [highlightNodeId]);

  return (
    <CodeMirror
      className="code-editor-content "
      // value={DIJKSTRA_CODE}
      height="100%"
      width="500px"
      extensions={[
        python(),
        zebraStripes({
          lineNumber: [highlightCodeRange],
          lightColor: "#ccd7da50",
        }),
      ]}
      onChange={onChange}
      theme={sproutTheme}
      onWheel={handleWheelEvent}
      ref={CodeRef}
      onBlur={handleBlurEvent}
    />
  );
}
export default CodeEditor;

// const extensions = [python()];
// const code = "console.log('hello world!');\n\n\n";
// export default function CodeEditor() {
//   const editor = useRef();
//   const { setContainer } = useCodeMirror({
//     container: editor.current,
//     extensions,
//     value: code,
//   });

//   useEffect(() => {
//     if (editor.current) {
//       setContainer(editor.current);
//     }
//   }, [editor.current]);

//   return <div ref={editor} />;
// }
