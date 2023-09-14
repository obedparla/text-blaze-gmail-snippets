import {SnippetsData} from "../types/snippetsData";

export function fetchFromUrl<T>(url: string, options: RequestInit): Promise<T> {
  return fetch(url, { ...options }).then((response) => {
    if (response.ok) {
      try {
        return response.json();
      } catch (e) {
        throw new Error(`${e}`);
      }
    } else {
      throw new Error(`Response not OK. Status: ${response.statusText}`);
    }
  });
}

export function fetchGmailSnippets(sensitivity: number, numberOfEmails: number) {
  return fetchFromUrl<SnippetsData>("/v1/gmail-snippets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sensitivity, numberOfEmails }),
  })
}