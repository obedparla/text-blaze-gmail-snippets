import "./styles.css";
import { Button, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <>
      <header className={"header"}>
        <Text className={"header__name"}>Text Blaze Gmail Snippets</Text>

        <nav className={"header__links"}>
          <a href={"/auth/google"}>
            <Button size={"sm"}>Login</Button>
          </a>
        </nav>
      </header>
    </>
  );
}
