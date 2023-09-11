export function fetchFromUrl<T>(url: string, options: RequestInit): Promise<T> {
  return fetch(url, { ...options }).then((response) => {
    if (response.ok) {
      if ("error" in response) {
        throw new Error(`${response.error}`);
      }

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
