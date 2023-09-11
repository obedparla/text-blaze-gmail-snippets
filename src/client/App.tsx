import { Header } from "./components/Header/Header";
import { BodyContent } from "./components/BodyContent/BodyContent";
import { Heading, Text } from "@chakra-ui/react";

function App() {
  return (
    <div className="app__container">
      <Header />

      <section className={"hero_section"}>
        <div className={"hero_section__content"}>
          <Heading as={"h1"}>
            Analyze your emails and get useful snippets to save directly to Text
            Blaze
          </Heading>
          <img src={"/hero_svg.svg"} alt={"Nice looking svg image"} />
        </div>
      </section>

      <section className={"content__wrapper"}>
        <BodyContent />
      </section>
    </div>
  );
}

export default App;
