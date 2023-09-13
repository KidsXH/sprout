const data: Array<{ id: number; x: number; y: number; text: string; parent: number }> = [
  {
    id: 0,
    text: "1",
    x: 0,
    y: 0,
    parent: -1,
  },
  {
    id: 1,
    text: "2-3",
    x: 0,
    y: 1,
    parent: 0
  },
  {
    id: 2,
    text: "4",
    x: 0,
    y: 2,
    parent: 1
  },
  {
    id: 3,
    text: "2",
    x: -1,
    y: 1,
    parent: 0
  },
  {
    id: 4,
    text: "2-4",
    x: 1,
    y: 1,
    parent: 0
  },
  {
    id: 5,
    text: "3-4",
    x: -2,
    y: 2,
    parent: 3
  },
  {
    id: 6,
    text: "4",
    x: -1,
    y: 2,
    parent: 3
  },
  {
    id: 7,
    text: "6-20",
    x: 1,
    y: 2,
    parent: 4
  },
  {
    id: 8,
    text: "6-22",
    x: 2,
    y: 2,
    parent: 4
  },
  {
    id: 9,
    text: "6-20",
    x: -3,
    y: 3,
    parent: 5
  },
];

export default data;
