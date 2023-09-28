"use client";
import React, { MutableRefObject } from "react";
import CodeMirror, {
  ReactCodeMirrorRef,
  getStatistics,
} from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";
import { python } from "@codemirror/lang-python";
import { zebraStripes } from "@uiw/codemirror-extensions-zebra-stripes";
import sproutTheme from "./theme";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import {
  selectHighlightNode,
  updateCodeScrollTop,
} from "@/store/highlightSlice";
import { setSourceCode } from "@/store/modelSlice";
import { selectChainNodes } from "@/store/chatSlice";
import { updateSelectedCodeRange } from "@/store/selectionSlice";

function CodeEditor() {
  const CodeRef: MutableRefObject<ReactCodeMirrorRef | null> = useRef(null);
  const highlightNodeId = useAppSelector(selectHighlightNode);

  const dispatch = useAppDispatch();
  const [codeScrollTop, setCodeScrollTop] = React.useState<number>(0);
  const [highlightCodeRange, setHighlightCodeRange] = React.useState<any>([]);
  const [code, setCode] = React.useState<string>(DIJKSTRA_CODE);
  const chainNodes = useAppSelector(selectChainNodes);

  const handleWheelEvent = (event: any) => {
    const codeElement = document.getElementById("code-editor");
    const scrollTop: number = codeElement?.scrollTop || 0;
    setCodeScrollTop(scrollTop);
  };

  useEffect(() => {
    dispatch(updateCodeScrollTop(codeScrollTop));
  }, [dispatch, codeScrollTop]);

  useEffect(() => {
    setTimeout(() => {
      setHighlightCodeRange(
        highlightNodeId === -1 ? [] : chainNodes[highlightNodeId].range,
      );
    }, 1400);
    return () => {
      setHighlightCodeRange([]);
    };
  }, [highlightNodeId]);

  return (
    <CodeMirror
      className="code-editor-content"
      theme={sproutTheme}
      ref={CodeRef}
      height="100%"
      width="500px"
      extensions={[
        python(),
        zebraStripes({
          lineNumber: [highlightCodeRange],
          lightColor: "#ccd7da50",
        }),
      ]}
      value={code}
      onChange={(value) => {
        setCode(value);
      }}
      onUpdate={(view) => {
        const state = getStatistics(view);
        const selectedCode = state.selectionCode;
        const lineCount = selectedCode.split("\n").length;
        const start = state.line.number;
        dispatch(updateSelectedCodeRange([start, start + lineCount - 1]));
        console.log("code range", [start - 1, start + lineCount - 2]);
      }}
      onBlur={() => {
        dispatch(setSourceCode(code));
      }}
      onWheel={handleWheelEvent}
    />
  );
}

export default CodeEditor;

export const DIJKSTRA_CODE = `def dijkstra(graph, start, end):
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
