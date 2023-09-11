import natural from "natural";
import nlp from "wink-nlp-utils";

export function getSnippetsFromText(
  textArray: string[],
  similarityThreshold = 0.85,
) {
  const allSentences = textArray.flatMap((text) => {
    // todo splitting \r\n may yield even better results
    let cleanText = text.replaceAll(/\s+/g, " ");

    const longSentencesTokens = nlp.string.sentences(cleanText) as string[];

    const sentences = longSentencesTokens.filter(
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
