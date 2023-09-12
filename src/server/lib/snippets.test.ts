import { expect, test } from "vitest";
import { getSnippetsFromText } from "./snippets";

const textExample = [
  "The quick brown fox jumps over the lazy dog. It's an old typing exercise.\n\nMany people have used it to practice their typing. The sentence utilizes every letter in the English alphabet.",
  "It's an old typing exercise. The quick brown fox jumps over the lazy dog. This sentence is particularly famous.\n\nMany people have used it to practice their typing. Keyboards have been worn out with it.",
  "Many people have used it to practice their typing. Typists and writers alike appreciate its utility.\n\nThe quick brown fox jumps over the lazy dog. It's an old typing exercise. The sentence utilizes every letter in the English alphabet.",
  "For decades, people have practiced typing with this sentence. The quick brown fox jumps over the lazy dog.\n\nIt's an old typing exercise. Many people find it quite useful.",
  "Did you know? The quick brown fox jumps over the lazy dog is quite a popular phrase.\n\nMany people have used it to practice their typing. It's an old typing exercise, known for its comprehensive use of the English alphabet.",
  "The sentence utilizes every letter in the English alphabet. That's why the quick brown fox jumps over the lazy dog is famous.\n\nMany people have used it to practice their typing. It's more than just a random sentence.",
  "While it may seem random, the quick brown fox jumps over the lazy dog is a staple in typing classes.\n\nIt's an old typing exercise. Many students have typed it out, hoping to perfect their skills.",
  "In the world of typing, some sentences stand out. The quick brown fox jumps over the lazy dog is one of them.\n\nIt's an old typing exercise. Every aspiring typist has likely encountered it.",
  "It's an old typing exercise, and for good reason. The quick brown fox jumps over the lazy dog is more than just a sentence.\n\nMany people have used it to practice their typing. It encapsulates the entirety of the English alphabet.",
  "Have you typed it? The quick brown fox jumps over the lazy dog is a challenge for many beginners.\n\nIt's an old typing exercise. Typing it correctly means you've used every letter in the English language.",
];

const expectedSnippets = [
  "It's an old typing exercise.",
  "The quick brown fox jumps over the lazy dog.",
  "Many people have used it to practice their typing.",
  "It's an old typing exercise, known for its comprehensive use of the English alphabet.",
  "The sentence utilizes every letter in the English alphabet.",
  "The quick brown fox jumps over the lazy dog is quite a popular phrase.",
  "The quick brown fox jumps over the lazy dog is one of them.",
];

test("Snippet generation works as expected", () => {
  expect(getSnippetsFromText(textExample)).toStrictEqual(expectedSnippets);
});
