import { Button } from "@crayonai/react-ui";
import { Github } from "lucide-react";

export const GithubButton = () => {
  const handleClick = () => {
    window.open("https://github.com/thesysdev/canvas-with-c1", "_blank");
  };

  return (
    <Button
      variant="secondary"
      iconLeft={<Github />}
      className="fixed bottom-12 right-2"
      onClick={handleClick}
    >
      Github
    </Button>
  );
};
