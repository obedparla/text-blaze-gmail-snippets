import natural from "natural";

export function getSnippetsFromText(
  textArray: string[],
  similarityThreshold = 0.9,
) {
  const snippetsMap: { [key: string]: number } = {};

  // https://naturalnode.github.io/natural/Tokenizers.html#tokenizers
  const tokenizer = new natural.SentenceTokenizerNew();
  const allSentences = textArray.flatMap((text) => tokenizer.tokenize(text));

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

export const texts2 = [
  "The quick brown fox jumps ovr the lazy dg. It's an old typing exercise.\n\nMany people have used it to practice their typing. The sentence utilizes every letter in the English alphabet.",
  "It's an old typing exercise. The quick brown fox jumps over the lazy dog. This sentence is particularly famous.\n\nMany people have used it to practice their typing. Keyboards have been worn out with it.",
  "Many people have used it to practice their typing. Typists and writers alike appreciate its utility.\n\nThe quick brown fox jumps over the lazy dog. It's an old typing exercise. The sentence utilizes every letter in the English alphabet.",
  "For decades, people have practiced typing with this sentence. The quick brown fox jumps over the lazy dog.\n\nIt's an old typing exercise. Many people find it quite useful.",
  "Did you know? The quick brown fox jumps over the lazy dog is quite a popular phrase.\n\nMany people have used it to practice their typing. It's an old typing exercise, known for its comprehensive use of the English alphabet.",
  "The sentence utilizes every letter in the English alphabet. That's why the quick brown fox jumps over the lazy dog is famous.\n\nMany people have used it to practice their typing. It's more than just a random sentence.",
  "While it may seem random, the quck brown fox jups over the lazy dog is a staple in typing classes.\n\nIt's an old typing exercise. Many students have typed it out, hoping to perfect their skills.",
  "In the world of typing, some sentences stand out. Th quick brown fox jumps over th lazy dog is one of them.\n\nIt's an old typing exercise. Every aspiring typist has likely encountered it.",
  "It's an old typing exercise, and for good reason. The quick brwn fox jumps over the lazy dg is more than just a sentence.\n\nMany people have used it to practice their typing. It encapsulates the entirety of the English alphabet.",
  "Have you typed it? The quick brown fox jumps over the lazy dog is a challenge for many beginners.\n\nIt's an old typing exercise. Typing it correctly means you've used every letter in the English language.",
];
