export interface nodeContent {
  node: number;
  summary: string;
  content: string;
  type: string;
}

export interface node {
  id: number;
  parent: number;
  children: number[];
  range: number[];
  codeType: string;
  content: nodeContent[];
  contentID: number;
}

const nodes: node[] = [
  {
    id: 0,
    parent: -1,
    children: [1],
    range: [1, 1],
    codeType: "c",
    content: [
      {
        node: 0,
        summary: "intro",
        content:
          "In this tutorial, we will be discussing how to implement Dijkstra's algorithm using Python. Dijkstra's algorithm is used to find the shortest path between two nodes in a weighted graph. ",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 1,
    parent: 0,
    children: [2],
    range: [2, 3],
    codeType: "c",
    content: [
      {
        node: 1,
        summary: "initial",
        content:
          "The first step in implementing Dijkstra's algorithm is to initialize the distances from the starting node to all other nodes in the graph. We create a dictionary called distances which will store the distances of all nodes from the starting node. Initially, we set the distance of each node to a large number except for the starting node which we set to 0.",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 2,
    parent: 1,
    children: [3],
    range: [4, 4],
    codeType: "c",
    content: [
      {
        node: 2,
        summary: "create list",
        content:
          "Next, we create a list called nodes which contains all the nodes in the graph.",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 3,
    parent: 2,
    children: [4],
    range: [6, 20],
    codeType: "c",
    content: [
      {
        node: 3,
        summary: "run algorithm",
        content:
          "We run the algorithm until all nodes have been processed or until we have reached the end node. In each iteration of the algorithm, we select the node with the smallest distance from the starting node from the list of nodes. We do this by sorting the nodes list by the distance of each node from the starting node.",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 4,
    parent: 3,
    children: [5],
    range: [11, 12],
    codeType: "c",
    content: [
      {
        node: 4,
        summary: "check end",
        content:
          "If the current node is the end node, we break out of the loop as we have found the shortest path.",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 5,
    parent: 4,
    children: [6],
    range: [14, 18],
    codeType: "c",
    content: [
      {
        node: 5,
        summary: "update distance",
        content:
          "Next, we iterate over all the neighbors of the current node and calculate the distance from the starting node to the neighbor node through the current node. If this distance is less than the distance currently stored in the distances dictionary for the neighbor node, we update the distance for the neighbor node in the distances dictionary.",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 6,
    parent: 5,
    children: [7],
    range: [20, 20],
    codeType: "c",
    content: [
      {
        node: 6,
        summary: "Remove node",
        content:
          "After we have processed all the neighbors of the current node, we remove the current node from the nodes list.",
        type: "c",
      },
    ],
    contentID: 0,
  },
  {
    id: 7,
    parent: 6,
    children: [8],
    range: [22, 22],
    codeType: "c",
    content: [
      {
        node: 7,
        summary: "return distance",
        content:
          "Finally, we return the distance stored in the distances dictionary for the end node.",
        type: "c",
      },
    ],
    contentID: 0,
  },
];

export default nodes;
