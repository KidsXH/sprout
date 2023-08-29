
import {StructuredOutputParser} from 'langchain/output_parsers';

// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
  source: "source used to answer the user's question, should be a website.",
});

export const formatInstructions = parser.getFormatInstructions();


