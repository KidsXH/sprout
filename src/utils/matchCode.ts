export const matchCode = (searchCode: string, sourceCode: string) => {
  searchCode = searchCode.replaceAll(" ", "");
  sourceCode = sourceCode.replaceAll(" ", "");
  const numSearchCodeLines = searchCode.split("\n").length;
  const numSourceCodeLines = sourceCode.split("\n").length;

  const start = sourceCode.indexOf(searchCode);

  let startLine = 1;
  let endLine = numSourceCodeLines;

  if (start !== -1) {
    startLine = sourceCode.slice(0, start).split("\n").length;
    endLine = startLine + numSearchCodeLines - 1;
  }
  return [startLine, endLine];
};
