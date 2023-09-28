import { CreateEmbeddingResponse } from "openai";
import { EmbeddingModel } from "@/models/api";
import { UMAP } from "umap-js";

export async function getCoordinates(
  inputs: string[],
  apiKey: string,
): Promise<number[][] | undefined> {
  if (inputs.length < 1) {
    return new Promise(() => {
      return [];
    });
  }

  if (inputs.includes("")) {
    return new Promise(() => {
      return [];
    });
  }

  const embedModel = new EmbeddingModel(apiKey, "text-embedding-ada-002");
  const embeddingsResponse = embedModel
    .getEmbeddings(inputs)
    .catch((err) => {
      console.error(
        "Error while retrieving node embeddings from OpenAI: " + err,
      );
    })
    .then((res: CreateEmbeddingResponse | void) => {
      if (!res) {
        return;
      }

      const embeddings = res.data.map((value, index) => {
        console.assert(index == value.index);
        return value.embedding;
      });

      if (embeddings.length <= 2) {
        return [];
      }
      const umap = new UMAP({
        nComponents: 2,
        nNeighbors: 1,
      });
      const umapResult = umap.fit(embeddings);
      return umapResult;
    });

  return embeddingsResponse;
}
