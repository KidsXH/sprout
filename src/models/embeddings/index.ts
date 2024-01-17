import { CreateEmbeddingResponse } from "openai";
import { EmbeddingModel } from "@/models/api";
import { UMAP } from "umap-js";

export function normalizeCoordinates(coords: number[][]) {
  let maxX = 0;
  let maxY = 0;

  // Find the maximum absolute values for each dimension
  for (const [x, y] of coords) {
      if (Math.abs(x) > maxX) {
          maxX = Math.abs(x);
      }
      if (Math.abs(y) > maxY) {
          maxY = Math.abs(y);
      }
  }

  // Normalize each coordinate
  return coords.map(([x, y]) => [x / maxX, y / maxY]);
}

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

      const embeddings = res.map((value: any, index: any) => {
        console.assert(index == value.index);
        return value.embedding;
      });

      const umapConfig = {
        nComponents: 2,
        nNeighbors: 3,
      }
      if (embeddings.length <= 1) {
        return [[0], [0]]
      } else if (embeddings.length <= 3) {
        umapConfig.nNeighbors = 1
      } else {
        umapConfig.nNeighbors = 2
      }

      const umap = new UMAP(umapConfig);

      const coords = normalizeCoordinates(umap.fit(embeddings));

      return coords;
    });

  return embeddingsResponse;
}
