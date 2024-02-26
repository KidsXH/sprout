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

const BUCKET = `def bucketSort(array):
  
      bucket = []
      
      for i in range(len(array)):
          bucket.append([])

      for j in array:
          index_b = int(10 * j)
          bucket[index_b].append(j)

      for i in range(len(array)):
          bucket[i] = sorted(bucket[i])

      k = 0
      for i in range(len(array)):
          for j in range(len(bucket[i])):
              array[k] = bucket[i][j]
              k += 1
      return 
    `;

export const DA = `import numpy as np

np.random.seed(42)

names = np.array(["Student_" + str(i) for i in range(200)])
ages = np.random.randint(15, 25, 200).astype(float)
scores = np.random.randint(50, 102, (200, 5)).astype(float)
attendance = np.random.uniform(50, 101, 200)

indices = np.random.choice(200, 20, replace=False)
scores[indices, np.random.choice(5, 20)] = np.nan
ages[indices[:10]] = np.nan

ages[np.isnan(ages)] = np.nanmean(ages)

for col in range(scores.shape[1]):
    scores[np.isnan(scores[:, col]), col] = np.nanmean(scores[:, col])
ages[ages > 100] = np.nanmean(ages)

scores[scores > 100] = 100
attendance[attendance > 100] = 100

average_scores = np.mean(scores, axis=1)
age_groups = np.digitize(ages, [16, 18, 20, 22, 25])

normalized_scores = (scores - np.min(scores, axis=0)) / (np.max(scores, axis=0) - np.min(scores, axis=0))

above_avg_indices = np.where((average_scores > np.mean(average_scores)) & (attendance > np.mean(attendance)))
filtered_data = normalized_scores[above_avg_indices]

age_group_means = [np.mean(normalized_scores[age_groups == i], axis=0) for i in range(5)]

print(filtered_data)
print(age_group_means)`;
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
        highlightNodeId === -1 || highlightNodeId >= chainNodes.length
          ? []
          : chainNodes[highlightNodeId].range,
      );
    }, 0);
    return () => {
      setHighlightCodeRange([]);
    };
  }, [highlightNodeId, chainNodes]);

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
        // console.log("code range", [start - 1, start + lineCount - 2]);
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
      
      return distances[end]`;
