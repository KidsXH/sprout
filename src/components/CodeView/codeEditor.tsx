"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useMemo, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { quietlight } from "@uiw/codemirror-theme-quietlight";
import { zebraStripes } from "@uiw/codemirror-extensions-zebra-stripes";
import sproutTheme from "./theme";

function CodeEditor() {
  const onChange = React.useCallback((value: any, viewUpdate: any) => {
    console.log("value:", value);
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
  const highlightCode = [3, 6];
  return (
    <CodeMirror
      className="code-editor-content "
      value={DIJKSTRA_CODE}
      height="100%"
      width="500px"
      extensions={[
        python(),
        zebraStripes({ lineNumber: [highlightCode], lightColor: "#ccd7da50" }),
      ]}
      onChange={onChange}
      theme={sproutTheme}
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
