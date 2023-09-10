import natural from "natural";
import nlp from "wink-nlp-utils";

export function getSnippetsFromText(
  textArray: string[],
  similarityThreshold = 0.85,
) {
  const allSentences = textArray.flatMap((text) => {
    let cleanText = text.replaceAll(/\s+|>|\r\n/g, " ");

    // todo maybe I should split based on \r\n here too
    const shortSentencesTokens = cleanText.split(/(?<=[,.;!?:])\s*/);

    const longSentencesTokens = nlp.string.sentences(cleanText) as string[];

    const sentences = [...shortSentencesTokens, ...longSentencesTokens].filter(
      (text) => {
        const numberOfWords = text.split(" ").length;

        return numberOfWords > 1;
      },
    );

    // in case a short sentence and a long sentence collide
    return [...new Set([...sentences])];
  });

  console.log("allSentences", allSentences);

  const snippetsMap: { [key: string]: number } = {};

  allSentences.forEach((sentenceToCompare, parentIndex) => {
    for (
      let childIndex = parentIndex + 1;
      childIndex < allSentences.length;
      childIndex++
    ) {
      const sentence = allSentences[childIndex];

      if (
        // https://naturalnode.github.io/natural/Tokenizers.html#tokenizers
        // tested using "LevenshteinDistance" as well but this is more flexible when changing thresholds
        natural.JaroWinklerDistance(sentenceToCompare, sentence, {
          ignoreCase: true,
        }) >= similarityThreshold
      ) {
        // Note: slightly different phrases will both appear if the threshold is < 1
        // Useful for ordering by "most common"
        snippetsMap[sentenceToCompare] =
          (snippetsMap[sentenceToCompare] || 0) + 1;
      }
    }
  });

  const duplicatedSnippetsSortedByOccurrences = Object.entries(snippetsMap)
    .filter(([_, occurrences]) => occurrences > 1)
    .sort(
      ([snippetA, occurrencesA], [snippetB, occurrencesB]) =>
        occurrencesB - occurrencesA,
    )
    .map(([snippet, _]) => snippet);

  return duplicatedSnippetsSortedByOccurrences;
}
