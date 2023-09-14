import {fetchGmailSnippets} from "../../utils/fetch";
import { useQuery } from "react-query";

import "./snippets.css";
import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { SensitivitySlider } from "./components/SensitivitySlider";

export function Snippets() {
  const [orderBy, orderBySet] = useState<"asc" | "desc">("asc");
  const [sensitivity, sensitivitySet] = useState(0.85);
  const [emailsToAnalyze, emailsToAnalyzeSet] = useState(20);

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["snippetsData", sensitivity, emailsToAnalyze],
    queryFn: () =>
      fetchGmailSnippets(sensitivity, emailsToAnalyze)
  });

  if (isError) {
    return <div>{`Failed to load snippets. ${error}`}</div>;
  }

  let snippets: string[] = [];

  if (data?.snippets) {
    snippets = orderBy === "asc" ? data.snippets : [...data.snippets].reverse();
  }

  return (
    <div className={"snippets_wrapper"}>
      <Stack mt="-6" spacing="3">
        <Flex gap={2}>
          <Text fontSize={14}>Order by:</Text>

          <RadioGroup
            onChange={(value: "asc" | "desc") => orderBySet(value)}
            value={orderBy}
            size={"sm"}
            colorScheme="orange"
          >
            <Stack direction="row">
              <Radio value="asc">Most used</Radio>
              <Radio value="desc">Least used</Radio>
            </Stack>
          </RadioGroup>
        </Flex>

        <Flex gap={2}>
          <Text fontSize={14}>How many emails to analyze:</Text>

          <NumberInput
            maxW="100px"
            ml="1rem"
            value={emailsToAnalyze}
            onChange={(_: string, value: number) =>
              emailsToAnalyzeSet(value || 20)
            }
            min={5}
            max={40}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>

        <Flex gap={2}>
          <Text fontSize={14} mr={-1}>
            Sensitivity:
          </Text>
          <Tooltip
            label="Changes how similar two sentences must be to qualify as a snippet. Lower means more snippets but less accuracy."
            fontSize="md"
          >
            <span>&#63;</span>
          </Tooltip>

          <SensitivitySlider
            onChange={sensitivitySet}
            sensitivity={sensitivity}
          />
        </Flex>

        {isLoading ? (
          <Flex alignContent={"center"} justifyContent={"center"} mt={10}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="orange.500"
              size="xl"
            />
          </Flex>
        ) : (
          <Stack divider={<StackDivider />} mt={10}>
            {snippets.map((snippet) => (
              <div key={snippet}>{snippet}</div>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  );
}
