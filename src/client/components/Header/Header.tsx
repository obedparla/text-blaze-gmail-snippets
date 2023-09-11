import "./styles.css";
import { Button, ButtonGroup, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <>
      <header className={"header"}>
        <div className={"header__name"}>Text Blaze Gmail Snippets</div>

        <nav className={"header__links"}>
          <a href={"/auth/google"}>
            <Button size={"sm"}>Login</Button>
          </a>
        </nav>
      </header>
    </>
  );
}
