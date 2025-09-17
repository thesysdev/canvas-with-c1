import { Button } from "@crayonai/react-ui";
import { Github, StarIcon } from "lucide-react";

export const GithubButton = () => {
  const handleClick = () => {
    window.open("https://github.com/thesysdev/canvas-with-c1", "_blank");
  };

  return (
    <Button
      variant="primary"
      iconLeft={<Github />}
      iconRight={<StarIcon fill="#eac54f" color="#eac54f" />}
      className="fixed bottom-12 right-2"
      onClick={handleClick}
    >
      Github
    </Button>
  );
};
