import { Snippets } from "../Snippets/Snippets";
import { fetchFromUrl } from "../../utils/fetch";
import { UserData } from "../../types/user";
import { useQuery } from "react-query";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Spinner,
} from "@chakra-ui/react";

export function BodyContent() {
  const { isError, isLoading, data, error } = useQuery("userData", () =>
    fetchFromUrl<UserData>("/v1/user_data", { method: "POST" }),
  );

  console.log("data user", data);

  if (isError) {
    return <div>{`Failed to load user data. Error: ${error}`}</div>;
  }

  if (isLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="orange.500"
        size="xl"
      />
    );
  }

  return (
    <>
      {data?.loggedIn ? (
        <Card variant={"elevated"}>
          <CardHeader>
            <Heading size="md">Snippets:</Heading>
          </CardHeader>
          <CardBody>
            <Snippets />
          </CardBody>
          <CardFooter>
            <Button colorScheme="">Load more</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card variant={"elevated"}>
          <CardHeader>
            <Heading size="md">Please log in to use the app</Heading>
          </CardHeader>
        </Card>
      )}
    </>
  );
}
