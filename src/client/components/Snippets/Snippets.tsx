import { fetchFromUrl } from "../../utils/fetch";
import { useQuery } from "react-query";
import { SnippetsData } from "../../types/snippetsData";

import "./snippets.css";

export function Snippets() {
  const { isError, isLoading, isSuccess, data, error } = useQuery(
    "snippetsData",
    () => fetchFromUrl<SnippetsData>("/v1/gmail-snippets", { method: "POST" }),
  );

  if (isError) {
    return <div>{`${error}`}</div>;
  }

  if (isLoading) {
    return <div>Loading snippets</div>;
  }

  return (
    <div className={"snippets_wrapper"}>
      {data?.snippets.map((snippet) => <div>{snippet}</div>)}
    </div>
  );
}
